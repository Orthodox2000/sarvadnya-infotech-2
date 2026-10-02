// CHANGE: 2026-10-02 — the ONE Razorpay gateway seam for the real site cart (SP-1 cart build).
// WHY: every Razorpay interaction lives in this module so "test mode only" is enforced in one
// place rather than by convention. Going live later means changing THIS file and rotating the
// env keys, not hunting through routes. Mirrors lib/demo/razorpay.ts — read that header first
// for the full rationale; the guarantees here are identical:
//
//   1. assertTestKeys() THROWS unless the key id starts with `rzp_test_`. A live key cannot
//      be used by accident even if someone misconfigures the environment.
//   2. The secret is never returned, never logged, never NEXT_PUBLIC_.
//   3. The SDK is a LAZY SINGLETON — never constructed at module scope, so importing this
//      file during `next build` (no .env at build time) cannot throw and break the build.
//
// SIGNATURE VERIFICATION uses crypto.timingSafeEqual, NOT the SDK's `===`: the SDK ends in a
// plain string compare (timing channel on a public endpoint) and reads the wrong field name
// for the checkout callback payload. The HMAC over `${orderId}|${paymentId}` is the ONLY
// verification step; `orders.fetch` below exists purely to fill a receipt figure on localhost
// (a display value, never a second factor — read its doc block).
//
// IMPORTANT: no "/demo" literal — the demo-independence guard scans lib/.

import crypto from 'node:crypto';
import Razorpay from 'razorpay';

const TEST_KEY_PREFIX = 'rzp_test_';
/** Razorpay caps `receipt` at 40 characters. */
const MAX_RECEIPT = 40;
/** Guard against pathological notes; an item summary lives in order.notes for receipts. */
const MAX_NOTE_LENGTH = 300;

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
 * THROW unless the configured keys are Razorpay TEST keys. The mechanism that makes
 * "test mode only" a property of the code, not a promise in a README. Neither key nor secret
 * is included in the error message — a thrown error can end up in a log or an error tracker.
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
        `Test keys must start with "${TEST_KEY_PREFIX}". The cart is test-only by design.`,
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

/** Lazy singleton — built on first use, never at module scope (guarantee 3). */
function getClient(): Razorpay {
  assertTestKeys();
  if (!client) {
    client = new Razorpay({ key_id: readKeyId(), key_secret: readSecret() });
  }
  return client;
}

/** Create a Razorpay order. Amount is INTEGER PAISE, matching the Orders API exactly. */
export async function createOrder({ amountPaise, receipt, notes }: CreateOrderInput): Promise<RazorpayOrder> {
  if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
    throw new Error('createOrder: amountPaise must be a positive integer number of paise.');
  }
  if (typeof receipt !== 'string' || receipt.length === 0) {
    throw new Error('createOrder: receipt is required.');
  }

  const safeNotes: Record<string, string> = {};
  if (notes) {
    for (const [k, v] of Object.entries(notes)) {
      if (typeof v === 'string' && v) safeNotes[k] = v.slice(0, MAX_NOTE_LENGTH);
    }
  }

  const order = await getClient().orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: receipt.slice(0, MAX_RECEIPT),
    // `payment_capture` deliberately OMITTED: the Orders API defaults to capture-on-payment,
    // and for a test cart we want capture to be an explicit go-live decision, not ours.
    ...(Object.keys(safeNotes).length ? { notes: safeNotes } : {}),
  });

  // `RazorpayOrder` inherits `amount: number | string` from the SDK types; this value goes
  // straight into the browser's Checkout call, so it is validated, not cast.
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

/**
 * Verify a payment callback signature.
 *
 * Razorpay signs `${orderId}|${paymentId}` with HMAC-SHA256 keyed by the API secret and
 * hex-encodes it. Compared with crypto.timingSafeEqual. Returns false (never throws) for any
 * malformed input, so a caller cannot accidentally treat an exception as a pass.
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
 * one. It exists for exactly one reason: when the stored `orders` document is absent — a
 * localhost run (deliberately not persisted, AGENTS.md on the shared production DB) or a
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