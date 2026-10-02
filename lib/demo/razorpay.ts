// CHANGE: 2026-10-02 — the ONE Razorpay gateway seam for the /demo cart scaffold (SP-1).
// WHY: every Razorpay interaction lives in this module, so "test mode only" is enforced in
// one place rather than by convention. Going live with real money later means changing THIS
// file, not hunting through routes.
//
// THREE STRUCTURAL GUARANTEES
// 1. assertTestKeys() THROWS unless the key id starts with `rzp_test_`. A live key
//    (`rzp_live_…`) cannot be used by accident even if someone misconfigures the environment.
// 2. The secret is never returned, never logged, and never carries a NEXT_PUBLIC_ prefix.
// 3. The SDK is a LAZY SINGLETON — never constructed at module scope, so importing this file
//    during `next build` (where .env is absent) cannot throw and break the whole build.
//
// SIGNATURE VERIFICATION IS NOT THE SDK's.
// `validatePaymentVerification` (razorpay-utils) ends in `return expectedSignature === signature;`
// — a plain string compare, i.e. a timing channel on a public endpoint. It also reads
// `params.order_id`, whereas the checkout callback sends `razorpay_order_id`, so passing the
// callback payload straight in throws. Both verified by reading the installed source. We build
// the identical HMAC-SHA256 over `${orderId}|${paymentId}` and compare with
// crypto.timingSafeEqual. The SDK is used for order creation, plus a read-only
// `orders.fetch` for DISPLAY data (fetchOrderAmountPaise) — never for verification.

import crypto from 'node:crypto';
import Razorpay from 'razorpay';

const TEST_KEY_PREFIX = 'rzp_test_';
/** Razorpay caps `receipt` at 40 characters. */
const MAX_RECEIPT = 40;

export interface CreateOrderInput {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

function readKeyId(): string {
  return process.env.RAZORPAY_KEY_ID || '';
}

function readSecret(): string {
  return process.env.RAZORPAY_KEY_SECRET || '';
}

/**
 * THROW unless the configured keys are Razorpay TEST keys.
 * This is the mechanism that makes "test mode only" a property of the code rather than a
 * promise in a README. Neither key nor secret is included in the error message — a thrown
 * error can end up in a log or an error tracker.
 */
export function assertTestKeys(): void {
  const keyId = readKeyId();
  if (!keyId) {
    throw new Error('Razorpay is not configured: RAZORPAY_KEY_ID is missing.');
  }
  if (!keyId.startsWith(TEST_KEY_PREFIX)) {
    // Deliberately does NOT echo the value, only whether it has the wrong prefix.
    throw new Error(
      'Refusing to run: RAZORPAY_KEY_ID is not a Razorpay TEST key. ' +
        `Test keys must start with "${TEST_KEY_PREFIX}". /demo is test-only by design.`,
    );
  }
  if (!readSecret()) {
    throw new Error('Razorpay is not configured: RAZORPAY_KEY_SECRET is missing.');
  }
}

/** True when keys are present AND test-mode. Safe to call without throwing. */
export function isTestModeConfigured(): boolean {
  try {
    assertTestKeys();
    return true;
  } catch {
    return false;
  }
}

/** The publishable key id, for sending to the browser. The SECRET is never exposed. */
export function getPublishableKeyId(): string {
  assertTestKeys();
  return readKeyId();
}

let client: Razorpay | null = null;

/** Lazy singleton — built on first use, never at module scope (see guarantee 3). */
function getClient(): Razorpay {
  assertTestKeys();
  if (!client) {
    client = new Razorpay({ key_id: readKeyId(), key_secret: readSecret() });
  }
  return client;
}

/** Create a Razorpay order. Amount is INTEGER PAISE, matching the Orders API exactly. */
export async function createOrder({
  amountPaise,
  receipt,
  notes,
}: CreateOrderInput): Promise<RazorpayOrder> {
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
    throw new Error('createOrder: amountPaise must be a positive integer number of paise.');
  }
  if (typeof receipt !== 'string' || receipt.length === 0) {
    throw new Error('createOrder: receipt is required.');
  }

  const order = await getClient().orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: receipt.slice(0, MAX_RECEIPT),
    // `payment_capture` is deliberately OMITTED. The Orders API defaults to no auto-capture,
    // which is what /demo wants — no capture is ever an explicit go-live step, not ours. The
    // SDK types it as `boolean` (not the 1/0 the REST docs show), so passing `0`/`1` would
    // fail typecheck and broke overload resolution.
    ...(notes ? { notes } : {}),
  });

  // `RazorpayOrder` inherits `amount: number | string` from the request body type, but this
  // value goes straight into the browser's Checkout call — so it is validated, not cast.
  const amount = typeof order.amount === 'string' ? Number(order.amount) : order.amount;
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error('createOrder: Razorpay returned an unusable amount for this order.');
  }

  return {
    id: order.id,
    amount,
    currency: order.currency,
    receipt: order.receipt,
  };
}

// CHANGE: 2026-10-02 — REMOVED an unused `fetchPayment()` helper.
// WHY: Task 6 originally added `payments.fetch()` "to confirm the status upstream", but nothing
// ever called it, no test covered it, and neither the design spec nor the plan asks for it.
// Leaving an exported, undocumented-in-use function that reads like a second verification factor
// is worse than leaving it out: a future reader would reasonably assume /demo verification
// cross-checks Razorpay, when the HMAC below is in fact the ONLY thing being checked.
//
// The HMAC alone is sound, and deliberately so: only Razorpay and this server hold the API
// secret, so a valid signature over `order_id|payment_id` cannot be produced by an attacker.
// If /demo ever graduates to real payments, re-add an upstream fetch there as defence-in-depth
// against secret compromise — that is the right place for it, not ahead of time here.
//
// ADDED LATER, DELIBERATELY NOT A COUNTEREXAMPLE: `fetchOrderAmountPaise()` at the bottom of
// this file does call `orders.fetch`. It is not the upstream confirmation this note warns
// about, and the difference is the point: it feeds a printed receipt figure and NOTHING else.
// It is called only AFTER verifySignature() has already passed, cannot influence the verdict,
// and returns null rather than guessing. The distinction is "an extra security factor" versus
// "a display value" — mixing them is exactly the confusion this file exists to prevent.

/**
 * Verify a payment callback signature.
 *
 * Razorpay signs `${orderId}|${paymentId}` with HMAC-SHA256 keyed by the API secret and
 * hex-encodes it. Compared with crypto.timingSafeEqual — see the note at the top of this file
 * for why the SDK's `===` is not used here.
 *
 * Returns false (never throws) for any malformed input, so a caller cannot accidentally treat
 * an exception as a pass.
 */
export function verifySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = readSecret();
  if (!secret || !orderId || !paymentId || !signature) return false;
  // Razorpay returns a 64-char hex digest. Reject anything else before comparing, because
  // timingSafeEqual THROWS on a length mismatch — which would turn a bad request into a 500.
  if (!/^[0-9a-f]{64}$/i.test(signature)) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature.toLowerCase(), 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Reset the singleton. Test-only helper so a suite can change keys between cases. */
export function __resetClientForTests(): void {
  client = null;
}

/**
 * Read the authoritative amount back from Razorpay for an existing order.
 *
 * ============================ READ THIS BEFORE CALLING ============================
 * THIS IS **DISPLAY DATA ONLY**. It is NOT a verification step and MUST NOT be treated as
 * one. It exists for exactly one reason: when the `demo_orders` document is absent — a
 * localhost run (deliberately not persisted, see AGENTS.md on the shared production DB) or a
 * failed write — the receipt would otherwise have to print "Amount: -". Razorpay's own copy
 * of the order is the honest substitute: it is the figure the customer was actually charged.
 *
 * The security boundary remains `verifySignature()` alone. Nothing returned by this function
 * can turn a failed verification into a pass, and `getClient()` calls `assertTestKeys()`, so
 * a live-key environment still cannot reach Razorpay.
 * ===================================================================================
 *
 * Returns `null` on ANY failure - a missing order, a network error, an unparseable amount.
 * Callers must render "not recorded" rather than a guess. Never throws.
 */
export async function fetchOrderAmountPaise(razorpayOrderId: string): Promise<number | null> {
  if (typeof razorpayOrderId !== 'string' || !/^[A-Za-z0-9_]{1,64}$/.test(razorpayOrderId)) {
    return null;
  }
  try {
    const order = await getClient().orders.fetch(razorpayOrderId);
    const amount = typeof order.amount === 'string' ? Number(order.amount) : order.amount;
    if (!Number.isSafeInteger(amount) || amount <= 0) return null;
    return amount;
  } catch {
    // Deliberately swallowed: this figure is decoration on a receipt, and a Razorpay
    // outage must not turn a correctly-verified payment into an error page.
    return null;
  }
}