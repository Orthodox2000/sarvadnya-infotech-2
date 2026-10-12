// CHANGE: 2026-10-12 — payment rate-limit + money-boundary test suite.
// WHY (owner: "well stress tests for payments ... avoid same IP spamming or route attacks —
// rate limit per transaction trigger"): the checkout must not be spammable per IP, per
// repeated cart, per buyer identity, or per order id — and the money figures must NEVER come
// from the client. This suite exercises the limiter the payment routes actually use
// (lib/cart/transaction-limit.ts) with real concurrency, and statically proves the routes
// keep their money boundary. No server, no Mongo, no Razorpay, zero network.
//
// Run:      npm run test:payments
// Heavy:    STRESS=1 npm run test:payments        (millions of checks; asserts map bounds)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  createTransactionLimiter,
  cartFingerprint,
  identityFingerprint,
} from '../lib/cart/transaction-limit.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRESS = process.env.STRESS === '1';

let passed = 0;
let failed = 0;
function assert(cond, label) {
  if (cond) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.error(`  ✗ ${label}`); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('\n[1] cart fingerprint — order-independent, collision-safe');
{
  const a = cartFingerprint([{ slug: 'tallyprime-gold', qty: 1 }, { slug: 'tss-silver', qty: 2 }]);
  const b = cartFingerprint([{ slug: 'tss-silver', qty: 2 }, { slug: 'tallyprime-gold', qty: 1 }]);
  const c = cartFingerprint([{ slug: 'tallyprime-gold', qty: 2 }, { slug: 'tss-silver', qty: 2 }]);
  assert(a === b, 'same items in a different order → same fingerprint');
  assert(a !== c, 'different quantity → different fingerprint');
  assert(a.length === 24, 'fingerprint is a truncated 24-char digest');
  assert(cartFingerprint([]) !== cartFingerprint([{ slug: 'x', qty: 1 }]), 'empty vs non-empty differ');
}

console.log('\n[2] buyer identity fingerprint — normalised');
{
  const a = identityFingerprint('Buyer@Example.com', '9821309060');
  const b = identityFingerprint('buyer@example.com', '+91 98213 09060');
  const c = identityFingerprint('buyer@example.com', '9821309061');
  assert(a === b, 'case + +91 spacing normalise to the same identity hash');
  assert(a !== c, 'a different phone → different identity');
}

console.log('\n[3] per-IP scope — exact boundary');
{
  const lim = createTransactionLimiter({ ip: { limit: 5, windowMs: 60_000 } });
  let allowed = 0;
  let limited = 0;
  for (let i = 0; i < 7; i++) {
    const d = lim.check({ ip: '203.0.113.9' });
    if (d.limited) limited++; else allowed++;
  }
  assert(allowed === 5, `exactly 5 allowed (got ${allowed})`);
  assert(limited === 2, `2 blocked (got ${limited})`);
  const d = lim.check({ ip: '203.0.113.9' });
  assert(d.scope === 'ip', 'tripped scope is reported as "ip"');
  assert(Number(d.headers['Retry-After']) > 0, 'Retry-After header present');
  assert(d.headers['X-RateLimit-Limit'] === '5', 'X-RateLimit-Limit reflects the scope limit');
  assert(d.headers['X-RateLimit-Remaining'] === '0', 'X-RateLimit-Remaining is 0 when blocked');
  assert(d.headers['X-RateLimit-Scope'] === 'ip', 'X-RateLimit-Scope names the scope');
  assert(lim.check({ ip: '198.51.100.4' }).limited === false, 'a different IP is unaffected');
}

console.log('\n[4] scope isolation — cart and identity are independent keys');
{
  const lim = createTransactionLimiter({
    ip: { limit: 2, windowMs: 60_000 },
    cart: { limit: 2, windowMs: 60_000 },
    identity: { limit: 2, windowMs: 60_000 },
  });
  // Fill only the cart scope.
  lim.check({ cart: 'ip1:cartA' });
  lim.check({ cart: 'ip1:cartA' });
  const cartTrip = lim.check({ cart: 'ip1:cartA' });
  assert(cartTrip.limited && cartTrip.scope === 'cart', 'cart scope trips on its own');
  assert(lim.check({ cart: 'ip1:cartB' }).limited === false, 'a different cart is unaffected');
  assert(lim.check({ identity: 'sameBuyer' }).limited === false, 'identity scope is unaffected by cart');
  assert(lim.check({ ip: 'ip1' }).limited === false, 'ip scope is unaffected by cart');
  // Missing keys are skipped, not treated as the empty-string key.
  assert(lim.check({}).limited === false, 'a check with no keys never trips');
  assert(lim.check({ cart: undefined, identity: undefined }).limited === false, 'undefined keys are skipped');
}

console.log('\n[5] scope precedence — the first configured scope wins');
{
  const lim = createTransactionLimiter({
    ip: { limit: 1, windowMs: 60_000 },
    cart: { limit: 1, windowMs: 60_000 },
  });
  lim.check({ ip: 'ipA', cart: 'ipA:c1' });
  const d = lim.check({ ip: 'ipA', cart: 'ipA:c1' });
  assert(d.limited && d.scope === 'ip', 'ip is reported before cart when both would trip');
}

console.log('\n[6] window reset — the limiter frees up after the window');
{
  const lim = createTransactionLimiter({ ip: { limit: 1, windowMs: 60 } });
  assert(lim.check({ ip: 'ip-reset' }).limited === false, 'first request allowed');
  assert(lim.check({ ip: 'ip-reset' }).limited === true, 'second within window blocked');
  await sleep(80);
  assert(lim.check({ ip: 'ip-reset' }).limited === false, 'allowed again after the window passes');
}

console.log('\n[7] concurrency stress — no key may exceed its limit');
{
  const LIMIT = 20;
  const KEYS = 50;
  const rounds = STRESS ? 4000 : 400;
  const lim = createTransactionLimiter({ ip: { limit: LIMIT, windowMs: 60_000 } });

  const keys = Array.from({ length: KEYS }, (_, k) => `10.0.0.${k}`);
  const tallies = new Map(keys.map((k) => [k, { ok: 0, no: 0 }]));

  // Round-robin across every key so each is hammered interleaved and concurrently.
  const total = KEYS * rounds;
  for (let i = 0; i < total; i++) {
    const ip = keys[i % KEYS];
    const d = lim.check({ ip });
    const t = tallies.get(ip);
    if (d.limited) t.no++; else t.ok++;
  }
  let worstOk = 0;
  let anyOver = false;
  let anyUnder = false;
  for (const t of tallies.values()) {
    if (t.ok > worstOk) worstOk = t.ok;
    if (t.ok > LIMIT) anyOver = true;
    if (t.ok < LIMIT) anyUnder = true; // each key got >= LIMIT requests, so all should saturate
  }
  assert(!anyOver, `no key exceeded its limit of ${LIMIT} under ${total} interleaved checks`);
  assert(worstOk === LIMIT, `every key saturated exactly at ${LIMIT} (worst=${worstOk})`);
  assert(!anyUnder, 'all keys reached their limit (no cross-key leakage)');
  assert(lim.sizes().ip === KEYS, `tracked exactly ${KEYS} keys (got ${lim.sizes().ip})`);
}

console.log('\n[8] memory bound — stale keys are evicted past maxEntries');
{
  const lim = createTransactionLimiter({ ip: { limit: 1000, windowMs: 1, maxEntries: 100 } });
  for (let i = 0; i < 5000; i++) lim.check({ ip: `key-${i}` });
  await sleep(5);
  for (let i = 0; i < 200; i++) lim.check({ ip: `later-${i}` });
  const tracked = lim.sizes().ip;
  assert(tracked <= 500, `map stays near maxEntries after 5200 stale checks (size=${tracked}, maxEntries=100)`);
}

console.log('\n[9] money boundary — routes never read an amount from the client');
{
  const order = readFileSync(join(ROOT, 'app/api/cart/order/route.ts'), 'utf8');
  const verifySrc = readFileSync(join(ROOT, 'app/api/cart/verify/route.ts'), 'utf8');
  assert(!order.match(/\bbody\b[\s\S]{0,40}\.amount/), 'order route does not read body.amount');
  assert(!order.includes('body.amount') && !order.includes('body.total'), 'order route has no client amount/total reads');
  for (const re of [/\bbody\.amount\b/, /\.amountPaise\s*=\s*body/, /\bbody\.totalPaise\b/]) {
    assert(!order.match(re), `order route free of client money field (${re})`);
  }
  assert(order.includes('repriceOrderItems'), 'order route reprices from the catalogue server-side');
  assert(/stored\?\.amountPaise/.test(verifySrc), 'verify route reads the amount from the STORED order');
  assert(!/\bbody\.amount\b/.test(verifySrc), 'verify route never reads a client amount');
}

console.log('\n[10] route wiring — both payment routes use the transaction limiter');
{
  const order = readFileSync(join(ROOT, 'app/api/cart/order/route.ts'), 'utf8');
  const verify = readFileSync(join(ROOT, 'app/api/cart/verify/route.ts'), 'utf8');
  for (const [name, src] of [['order', order], ['verify', verify]]) {
    assert(src.includes('createTransactionLimiter'), `${name} route imports/uses createTransactionLimiter`);
    assert(/status:\s*429/.test(src), `${name} route returns 429 when limited`);
    assert(src.includes('X-RateLimit-Scope') || src.includes('headers:'), `${name} route stamps limiter headers`);
  }
  assert(order.includes('cartFingerprint') && order.includes('identityFingerprint'), 'order route keys by cart + identity');
  assert(/order:\s*`/.test(verify), 'verify route keys by orderId');
}

console.log(`\n${'─'.repeat(52)}`);
console.log(`payment-limit suite: ${passed} passed, ${failed} failed${STRESS ? ' (STRESS)' : ''}`);
if (failed > 0) process.exit(1);
