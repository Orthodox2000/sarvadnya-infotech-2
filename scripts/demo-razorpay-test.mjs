// CHANGE: 2026-10-02 — regression suite for the Razorpay gateway seam (SP-1).
// Runs with Node 24 native TS type-stripping. NO NETWORK CALLS: only the pure/validation
// paths are exercised, because a test that hits Razorpay needs credentials and would spend
// nothing but could still fail for reasons unrelated to the code.
//
// The behaviours pinned here are the ones that decide whether a forged payment can be
// accepted, plus the "test mode only" guard that keeps /demo from ever charging real money.

import crypto from 'node:crypto';
import {
  assertTestKeys,
  createOrder,
  getPublishableKeyId,
  isTestModeConfigured,
  verifySignature,
} from '../lib/demo/razorpay.ts';

const GOOD_ID = 'rzp_test_TivnBlTYrx7wwB';
const SECRET = 'testsecret_do_not_use_in_prod';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL — ${err.message}`);
    failed++;
  }
}
function ok(cond, what) {
  if (!cond) throw new Error(what);
}
function eq(a, b, what) {
  if (a !== b) throw new Error(`${what}: expected ${b}, got ${a}`);
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

/** Set env for one test, always restoring afterwards. */
function withEnv(vars, fn) {
  const saved = {};
  for (const k of ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']) saved[k] = process.env[k];
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

const sign = (orderId, paymentId, secret = SECRET) =>
  crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');

// ─────────────────────── test-mode guard ───────────────────────
console.log('\nTEST-MODE GUARD');

test('assertTestKeys accepts an rzp_test_ key pair', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    assertTestKeys();
    eq(isTestModeConfigured(), true, 'isTestModeConfigured');
  });
});

test('REGRESSION: a LIVE key is refused (rzp_live_ must never work)', () => {
  withEnv({ RAZORPAY_KEY_ID: 'rzp_live_AbCdEf123456', RAZORPAY_KEY_SECRET: SECRET }, () => {
    throws(assertTestKeys, 'live key id');
    eq(isTestModeConfigured(), false, 'isTestModeConfigured must be false');
    throws(() => getPublishableKeyId(), 'getPublishableKeyId with a live key');
  });
});

test('a key id that merely CONTAINS rzp_test_ is refused (prefix, not substring)', () => {
  withEnv({ RAZORPAY_KEY_ID: 'prod_rzp_test_AbCdEf', RAZORPAY_KEY_SECRET: SECRET }, () => {
    throws(assertTestKeys, 'substring must not count as the test prefix');
  });
});

test('missing key id or secret is refused', () => {
  withEnv({ RAZORPAY_KEY_ID: undefined, RAZORPAY_KEY_SECRET: SECRET }, () =>
    throws(assertTestKeys, 'missing key id'),
  );
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: undefined }, () =>
    throws(assertTestKeys, 'missing secret'),
  );
  withEnv({ RAZORPAY_KEY_ID: undefined, RAZORPAY_KEY_SECRET: undefined }, () =>
    eq(isTestModeConfigured(), false, 'nothing configured'),
  );
});

test('the refusal message never echoes the key or secret', () => {
  const liveKey = 'rzp_live_SUPERSECRETVALUE123';
  withEnv({ RAZORPAY_KEY_ID: liveKey, RAZORPAY_KEY_SECRET: SECRET }, () => {
    let msg = '';
    try {
      assertTestKeys();
    } catch (e) {
      msg = e.message;
    }
    ok(!msg.includes(liveKey), 'message leaked the key id');
    ok(!msg.includes(SECRET), 'message leaked the secret');
    ok(msg.includes('rzp_test_'), 'message should state the required prefix');
  });
});

// ─────────────────────── signature verification ───────────────────────
console.log('\nSIGNATURE VERIFICATION');

test('a correctly signed callback verifies', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    eq(
      verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: sign('order_1', 'pay_1') }),
      true,
      'valid signature',
    );
  });
});

test('REGRESSION: a signature made with the WRONG secret is rejected', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    eq(
      verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: sign('order_1', 'pay_1', 'attacker') }),
      false,
      'forged signature',
    );
  });
});

test('REGRESSION: replaying a valid signature against a different order is rejected', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    const sig = sign('order_1', 'pay_1');
    eq(verifySignature({ orderId: 'order_2', paymentId: 'pay_1', signature: sig }), false, 'swapped order');
    eq(verifySignature({ orderId: 'order_1', paymentId: 'pay_2', signature: sig }), false, 'swapped payment');
  });
});

test('REGRESSION: the signature is bound to BOTH ids (| separator, per Razorpay spec)', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    // "order_1pay_1" must not verify for "order_1|pay_1" — i.e. the separator really is used.
    const noSep = crypto.createHmac('sha256', SECRET).update('order_1pay_1').digest('hex');
    eq(verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: noSep }), false, 'no separator');
  });
});

test('uppercase hex is accepted (Razorpay casing must not be load-bearing)', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    const sig = sign('order_1', 'pay_1');
    eq(verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: sig.toUpperCase() }), true, 'uppercase');
  });
});

test('REGRESSION: malformed signature returns FALSE, never throws', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    // timingSafeEqual THROWS on a length mismatch — a guard that threw would turn a forged
    // callback into a 500, and a caller with a try/catch could mistake that for a pass.
    for (const bad of ['', 'x', 'deadbeef', 'z'.repeat(64), 'a'.repeat(63), 'a'.repeat(65), 'ab cd']) {
      eq(verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: bad }), false, `sig "${bad.slice(0, 12)}"`);
    }
  });
});

test('REGRESSION: missing ids or an unconfigured secret return FALSE', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, () => {
    const sig = sign('order_1', 'pay_1');
    eq(verifySignature({ orderId: '', paymentId: 'pay_1', signature: sig }), false, 'empty orderId');
    eq(verifySignature({ orderId: 'order_1', paymentId: '', signature: sig }), false, 'empty paymentId');
    eq(verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: '' }), false, 'empty signature');
  });
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: undefined }, () => {
    eq(
      verifySignature({ orderId: 'order_1', paymentId: 'pay_1', signature: sign('order_1', 'pay_1') }),
      false,
      'no secret configured',
    );
  });
});

// ─────────────────────── order creation guards ───────────────────────
console.log('\nORDER CREATION GUARDS');

test('createOrder rejects a non-integer or non-positive amount (would 400 at the gateway)', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, async () => {
    for (const bad of [0, -1, 1.5, NaN, Infinity]) {
      let threw = false;
      try {
        await createOrder({ amountPaise: bad, receipt: 'r1' });
      } catch {
        threw = true;
      }
      ok(threw, `amount ${bad} should be rejected before any network call`);
    }
  });
});

test('createOrder rejects a missing receipt', () => {
  withEnv({ RAZORPAY_KEY_ID: GOOD_ID, RAZORPAY_KEY_SECRET: SECRET }, async () => {
    let threw = false;
    try {
      await createOrder({ amountPaise: 100, receipt: '' });
    } catch {
      threw = true;
    }
    ok(threw, 'empty receipt should be rejected');
  });
});

test('REGRESSION: importing the module without keys does NOT throw at import time', () => {
  // The module was imported at the top of this file with NO keys set. If the SDK were
  // constructed at module scope, that import alone would have failed the whole suite.
  eq(typeof createOrder, 'function', 'module loaded fine with no env');
});

// ─────────────────────── money boundary (static) ───────────────────────
// The dynamic tests below prove the maths is right. These prove the ROUTES never hand the
// maths an attacker-controlled number in the first place. A route can compute the correct
// total and still be exploitable if it reads `body.amount` before calling computeTotals.
console.log('\nMONEY BOUNDARY (static)');

import { readFileSync } from 'node:fs';

const ORDER_ROUTE = 'app/api/demo/order/route.ts';
const VERIFY_ROUTE = 'app/api/demo/verify/route.ts';

const FORBIDDEN_BODY_READS = [
  'body.amount',
  'body.total',
  'body.totalPaise',
  'body.subtotal',
  'body.tax',
  'body.claimedTotal',
  'body.pricePaise',
  'body.unitPaise',
  'items[0].pricePaise',
  'rawItems.pricePaise',
];

function sourceOf(p) {
  return readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
}

test('REGRESSION: the order route never reads an amount/tax/price off the request body', () => {
  const src = sourceOf(ORDER_ROUTE);
  for (const needle of FORBIDDEN_BODY_READS) {
    ok(!src.includes(needle), `${ORDER_ROUTE} must not reference \`${needle}\``);
  }
  // The body is destructured for `items` and nothing else.
  ok(src.includes('body as { items?: unknown }'), 'order route should read only `items` from the body');
});

test('REGRESSION: the order route passes the repriced amount, not a client value', () => {
  const src = sourceOf(ORDER_ROUTE);
  ok(
    src.includes('const amountPaise = totals.totalPaise;'),
    'amount sent to Razorpay must be the server-repriced total',
  );
  ok(src.includes('computeTotals(rawItems)'), 'order route must reprice from the catalog');
});

test('REGRESSION: the verify route never takes the amount from the request body', () => {
  const src = sourceOf(VERIFY_ROUTE);
  for (const needle of FORBIDDEN_BODY_READS) {
    ok(!src.includes(needle), `${VERIFY_ROUTE} must not reference \`${needle}\``);
  }
  ok(
    src.includes("typeof stored?.amountPaise === 'number'"),
    'verify route must source the amount from the stored order',
  );
});

test('REGRESSION: both routes gate their MongoDB writes on isIgnoredRequest()', () => {
  for (const p of [ORDER_ROUTE, VERIFY_ROUTE]) {
    const src = sourceOf(p);
    ok(src.includes('isIgnoredRequest'), `${p} must import isIgnoredRequest`);
    ok(src.includes("collection('demo_orders')"), `${p} must touch demo_orders`);
  }
  // A write must never sit outside the `!isIgnoredRequest(request)` branch.
  const order = sourceOf(ORDER_ROUTE);
  ok(
    order.includes('const persist = !isIgnoredRequest(request);') && order.includes('if (persist) {'),
    'order route must wrap its insertOne in the persist gate',
  );
});

test('REGRESSION: neither route sends email or touches visitor tracking', () => {
  for (const p of [ORDER_ROUTE, VERIFY_ROUTE]) {
    const src = sourceOf(p);
    for (const banned of ['sendEmailDirect', 'markConversion', 'lookupGeo', 'lookupReverseDns', 'recordVisitor']) {
      ok(!src.includes(banned), `${p} must not call ${banned} — /demo touches nothing else`);
    }
  }
});

test('REGRESSION: both routes call assertTestKeys() or verify before doing work', () => {
  // The order route must assert test keys up front; the verify route is protected because
  // verifySignature() refuses when the secret is absent (asserted dynamically above).
  const order = sourceOf(ORDER_ROUTE);
  const assertAt = order.indexOf('assertTestKeys();');
  const createAt = order.indexOf('createOrder({');
  ok(assertAt !== -1, 'order route must call assertTestKeys()');
  ok(assertAt < createAt, 'assertTestKeys() must run BEFORE createOrder()');
});

// CHANGE: 2026-10-02 — guards for fetchOrderAmountPaise, the DISPLAY-ONLY amount fallback.
//
// WHY THIS NEEDS LOCKING DOWN: the receipt added an upstream `orders.fetch` to the verify
// route, which is a security-critical path whose entire claim is "the HMAC is the only
// thing that decides the verdict". A reader - or a later refactor - could easily start
// treating that fetch as a second confirmation, which is exactly the ambiguity this project
// already deleted `fetchPayment()` to avoid. These assertions make the distinction structural
// rather than a matter of reading the comment.
test('REGRESSION: the Razorpay amount fetch is DISPLAY ONLY and never decides the verdict', () => {
  const src = sourceOf(VERIFY_ROUTE);

  // 1. It is only ever assigned to a display variable.
  ok(
    src.includes('amountPaise ?? (await fetchOrderAmountPaise(razorpayOrderId))'),
    'verify route must fall back to the Razorpay amount only when nothing was stored',
  );

  // 2. The verdict literal is still unconditional and is not derived from the fetch.
  ok(/verified:\s*true/.test(src), 'verify route must return a literal `verified: true` after the signature check');
  ok(
    !/verified:\s*(amountForDisplay|fetched|amount)/.test(src),
    '`verified` must NEVER be derived from the Razorpay fetch',
  );

  // 3. Ordering: the unverified early-return must come before the fetch, so a failed
  //    signature can never reach Razorpay at all.
  const failReturn = src.indexOf('The payment signature did not verify.');
  const fetchAt = src.indexOf('fetchOrderAmountPaise(razorpayOrderId)');
  ok(failReturn !== -1, 'verify route must still return early on a bad signature');
  ok(
    failReturn < fetchAt,
    'the unverified early-return must precede the amount fetch - an invalid signature must never call Razorpay',
  );
});

test('REGRESSION: fetchOrderAmountPaise degrades to null and never throws', async () => {
  const mod = await import('../lib/demo/razorpay.ts');
  const fetchAmount = mod.fetchOrderAmountPaise;

  ok(typeof fetchAmount === 'function', 'lib/demo/razorpay.ts must export fetchOrderAmountPaise');

  // Rejects junk ids before spending a network call - including the empty string, which a
  // bare `typeof x === 'string'` check would have let through to the SDK.
  for (const bad of ['', 'not an id', 'a'.repeat(65), '../etc/passwd', null, undefined, 12345]) {
    const out = await fetchAmount(bad);
    ok(
      out === null,
      `fetchOrderAmountPaise(${JSON.stringify(bad)}) must return null, got ${JSON.stringify(out)}`,
    );
  }

  // Absent/unreachable keys must also yield null rather than throwing. This is the case that
  // actually fires in CI and on a machine with no Razorpay env - it must not 500 the
  // success page of an otherwise correctly verified payment.
  const out = await fetchAmount('order_QlZOOoXuAcO78e');
  ok(
    out === null || Number.isSafeInteger(out),
    'must return null or a positive safe integer, never throw',
  );
});

console.log(`\n${'-'.repeat(60)}`);
console.log(`  Total: ${passed + failed}  |  PASSED: ${passed}  |  FAILED: ${failed}`);
console.log('-'.repeat(60));

if (failed > 0) process.exit(1);