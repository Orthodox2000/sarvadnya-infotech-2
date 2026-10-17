// CHANGE: 2026-10-17 — go-live regression suite for the CART Razorpay seam (lib/cart/payment.ts).
// Runs with Node 24 native TS type-stripping. ZERO NETWORK: only the pure/validation paths are
// exercised (a live Razorpay call would need real credentials and could move real money).
//
// The behaviours pinned here decide whether the site can charge REAL money by accident, and
// whether a forged webhook can mark an order paid:
//   1. getMode() is FAIL-CLOSED — only an explicit `live` selects live.
//   2. assertKeys() requires the key id to MATCH the mode (no live key in test mode, no test
//      key in live mode).
//   3. verifyWebhookSignature() is the webhook trust boundary — tampered bodies and wrong
//      secrets must fail; an unset secret rejects everything.
//
// Run: npm run test:payments-gateway

import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  getMode,
  isLiveMode,
  isGatewayConfigured,
  assertKeys,
  getPublishableKeyId,
  verifyWebhookSignature,
} from '../lib/cart/payment.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name} — ${err.message}`);
    failed++;
  }
}
function ok(cond, what) {
  if (!cond) throw new Error(what);
}
function eq(a, b, what) {
  if (a !== b) throw new Error(`${what}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}
function throws(fn, what) {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error(`${what}: expected a throw, got none`);
}

const GOOD_TEST_ID = 'rzp_test_TivnBlTYrx7wwB';
const GOOD_LIVE_ID = 'rzp_live_TowJo1sMjOAMdp';
const SECRET = 'testsecret_do_not_use_in_prod';

/** Set env for one test, always restoring afterwards (mode + keys + webhook secret). */
function withEnv(vars, fn) {
  const keys = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_MODE', 'RAZORPAY_WEBHOOK_SECRET'];
  const saved = {};
  for (const k of keys) saved[k] = process.env[k];
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    fn();
  } finally {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

console.log('\n[1] getMode — FAIL-CLOSED');
test('unset RAZORPAY_MODE defaults to test', () => {
  withEnv({ RAZORPAY_MODE: undefined }, () => eq(getMode(), 'test', 'default mode'));
});
test('blank RAZORPAY_MODE is test', () => {
  withEnv({ RAZORPAY_MODE: '   ' }, () => eq(getMode(), 'test', 'blank mode'));
});
test('misspelled RAZORPAY_MODE is test', () => {
  withEnv({ RAZORPAY_MODE: 'sandbox' }, () => eq(getMode(), 'test', 'typo mode'));
});
test('explicit "live" is live', () => {
  withEnv({ RAZORPAY_MODE: 'live' }, () => eq(getMode(), 'live', 'live mode'));
});
test('"LIVE" / " Live " normalise to live', () => {
  withEnv({ RAZORPAY_MODE: 'LIVE' }, () => eq(getMode(), 'live', 'uppercase'));
  withEnv({ RAZORPAY_MODE: ' Live ' }, () => eq(getMode(), 'live', 'padded'));
});
test('isLiveMode reflects getMode', () => {
  withEnv({ RAZORPAY_MODE: undefined }, () => eq(isLiveMode(), false, 'test -> false'));
  withEnv({ RAZORPAY_MODE: 'live' }, () => eq(isLiveMode(), true, 'live -> true'));
});

console.log('\n[2] assertKeys — key must MATCH the mode');
test('test mode accepts an rzp_test_ pair', () => {
  withEnv({ RAZORPAY_MODE: 'test', RAZORPAY_KEY_ID: GOOD_TEST_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    assertKeys();
    eq(isGatewayConfigured(), true, 'configured');
  });
});
test('test mode REFUSES a live key (no accidental real charge)', () => {
  withEnv({ RAZORPAY_MODE: 'test', RAZORPAY_KEY_ID: GOOD_LIVE_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    throws(assertKeys, 'live key in test mode');
    eq(isGatewayConfigured(), false, 'not configured');
    throws(() => getPublishableKeyId(), 'getPublishableKeyId with a live key in test mode');
  });
});
test('live mode accepts an rzp_live_ pair', () => {
  withEnv({ RAZORPAY_MODE: 'live', RAZORPAY_KEY_ID: GOOD_LIVE_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    assertKeys();
    eq(isGatewayConfigured(), true, 'configured');
    eq(getPublishableKeyId(), GOOD_LIVE_ID, 'publishable key');
  });
});
test('live mode REFUSES a test key (no silent sandbox)', () => {
  withEnv({ RAZORPAY_MODE: 'live', RAZORPAY_KEY_ID: GOOD_TEST_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    throws(assertKeys, 'test key in live mode');
    eq(isGatewayConfigured(), false, 'not configured');
  });
});
test('substring must NOT count as the prefix', () => {
  withEnv({ RAZORPAY_MODE: 'test', RAZORPAY_KEY_ID: 'xxrzp_test_yy', RAZORPAY_KEY_SECRET: SECRET }, () => {
    throws(assertKeys, 'substring is not a prefix match');
  });
});
test('missing key / secret throws', () => {
  withEnv({ RAZORPAY_MODE: 'test', RAZORPAY_KEY_ID: undefined, RAZORPAY_KEY_SECRET: SECRET }, () => {
    throws(assertKeys, 'missing key id');
  });
  withEnv({ RAZORPAY_MODE: 'live', RAZORPAY_KEY_ID: GOOD_LIVE_ID, RAZORPAY_KEY_SECRET: undefined }, () => {
    throws(assertKeys, 'missing secret');
  });
  withEnv({ RAZORPAY_MODE: undefined, RAZORPAY_KEY_ID: undefined, RAZORPAY_KEY_SECRET: undefined }, () => {
    eq(isGatewayConfigured(), false, 'nothing configured');
  });
});

console.log('\n[3] verifyWebhookSignature — the webhook trust boundary');
// Razorpay signs the RAW body with the webhook secret.
const SECRET_W = 'whsec_do_not_use_in_prod';
const sign = (body, secret = SECRET_W) => crypto.createHmac('sha256', secret).update(body).digest('hex');
const BODY = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1', amount: 100 } } } });

test('valid signature over the raw body passes', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: SECRET_W }, () => {
    eq(verifyWebhookSignature(BODY, sign(BODY)), true, 'valid');
  });
});
test('uppercase hex signature still passes', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: SECRET_W }, () => {
    eq(verifyWebhookSignature(BODY, sign(BODY).toUpperCase()), true, 'uppercase');
  });
});
test('wrong secret fails', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: SECRET_W }, () => {
    eq(verifyWebhookSignature(BODY, sign(BODY, 'attacker')), false, 'wrong secret');
  });
});
test('tampered body fails (raw bytes are what was signed)', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: SECRET_W }, () => {
    const sig = sign(BODY);
    eq(verifyWebhookSignature(BODY.replace('100', '999'), sig), false, 'tampered body');
  });
});
test('re-serialised JSON (different key order) fails', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: SECRET_W }, () => {
    const sig = sign(BODY);
    const reordered = JSON.stringify({ payload: JSON.parse(BODY).payload, event: 'payment.captured' });
    eq(verifyWebhookSignature(reordered, sig), false, 'reordered body');
  });
});
test('unset secret rejects everything', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: undefined }, () => {
    eq(verifyWebhookSignature(BODY, sign(BODY)), false, 'no secret configured');
  });
});
test('malformed signatures are rejected without throwing', () => {
  withEnv({ RAZORPAY_WEBHOOK_SECRET: SECRET_W }, () => {
    for (const bad of ['', 'deadbeef', 'z'.repeat(64), 'A'.repeat(63), 'A'.repeat(65)]) {
      eq(verifyWebhookSignature(BODY, bad), false, `sig "${bad.slice(0, 10)}"`);
    }
    eq(verifyWebhookSignature('', sign(BODY)), false, 'empty body');
  });
});

console.log('\n[4] static — routes keep the money + safety boundary');
test('order route calls assertKeys() (not the retired assertTestKeys)', () => {
  const src = readFileSync(join(ROOT, 'app/api/cart/order/route.ts'), 'utf8');
  ok(src.includes('assertKeys();'), 'order route must call assertKeys()');
  ok(!src.includes('assertTestKeys'), 'order route must not reference the retired assertTestKeys');
});
test('order route reports the mode, not a hardcoded test flag', () => {
  const src = readFileSync(join(ROOT, 'app/api/cart/order/route.ts'), 'utf8');
  ok(/testMode:\s*!isLiveMode\(\)/.test(src), 'order route derives testMode from isLiveMode()');
  ok(!/testMode:\s*true\b/.test(src), 'order route must not hardcode testMode: true');
});
test('verify route reports the mode, not a hardcoded test flag', () => {
  const src = readFileSync(join(ROOT, 'app/api/cart/verify/route.ts'), 'utf8');
  ok(/testMode:\s*!isLiveMode\(\)/.test(src), 'verify route derives testMode from isLiveMode()');
  ok(!/testMode:\s*true\b/.test(src), 'verify route must not hardcode testMode: true');
});
test('webhook verifies the signature BEFORE parsing the body', () => {
  const src = readFileSync(join(ROOT, 'app/api/cart/webhook/route.ts'), 'utf8');
  const verifyAt = src.indexOf('verifyWebhookSignature(raw, signature)');
  const parseAt = src.indexOf('JSON.parse(raw)');
  ok(verifyAt !== -1, 'webhook must call verifyWebhookSignature(raw, signature)');
  ok(parseAt !== -1, 'webhook must parse the body');
  ok(verifyAt < parseAt, 'signature verification must run BEFORE JSON.parse');
});
test('webhook reads the RAW body (request.text), never request.json', () => {
  const src = readFileSync(join(ROOT, 'app/api/cart/webhook/route.ts'), 'utf8');
  ok(src.includes('await request.text()'), 'webhook must read the raw body');
  ok(!/await request\.json\(/.test(src), 'webhook must never call request.json() (bytes are signed)');
});
test('webhook advance is idempotent (only created -> verified)', () => {
  const src = readFileSync(join(ROOT, 'app/api/cart/webhook/route.ts'), 'utf8');
  ok(/status:\s*'created'/.test(src), "webhook update must filter on status: 'created'");
});
test('demo seam stays test-only (unchanged by go-live)', () => {
  const src = readFileSync(join(ROOT, 'lib/demo/razorpay.ts'), 'utf8');
  ok(src.includes("const TEST_KEY_PREFIX = 'rzp_test_'"), 'demo must keep the test prefix gate');
  ok(!src.includes('RAZORPAY_MODE'), 'demo must NOT become mode-aware');
});

console.log(`\n${failed === 0 ? '✅' : '❌'} payment gateway: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
