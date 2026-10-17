// CHANGE: 2026-10-02 — the ONE Razorpay gateway seam for the real site cart (SP-1 cart build).
// CHANGE: 2026-10-17 — GO-LIVE: the cart is now mode-aware and FAIL-CLOSED. Whether the site
// takes REAL money is an explicit environment decision (`RAZORPAY_MODE`), never an accident of
// which key happens to be pasted into the environment.
//
// WHY one module: every Razorpay interaction lives here so the test/live boundary is enforced in
// one place rather than by convention. Mirrors lib/demo/razorpay.ts — but note the DEMO variant
// stays test-only UNCONDITIONALLY (its own assertTestKeys()); only THIS seam is mode-aware.
//
//   1. getMode() reads RAZORPAY_MODE. Anything other than an explicit `live` (trimmed, case
//      insensitive) is `test` — so a missing/blank/typo'd variable can never go live.
//   2. assertKeys() THROWS unless the configured key id MATCHES the mode: `rzp_live_` in live,
//      `rzp_test_` in test. A live key in a test-mode environment is refused, and a test key in
//      live mode is refused — so neither an accidental real charge nor a silent sandbox happens.
//   3. The secret is never returned, never logged, never NEXT_PUBLIC_.
//   4. The SDK is a LAZY SINGLETON — never constructed at module scope, so importing this
//      file during `next build` (no .env at build time) cannot throw and break the build.
//
// SIGNATURE VERIFICATION uses crypto.timingSafeEqual, NOT the SDK's `===`: the SDK ends in a
// plain string compare (timing channel on a public endpoint) and reads the wrong field name
// for the checkout callback payload. The HMAC over `${orderId}|${paymentId}` is the ONLY
// checkout verification step; `fetchOrderAmountPaise` below exists purely to fill a receipt
// figure on localhost (a display value, never a second factor — read its doc block). The
// server-to-server webhook events are covered by verifyWebhookSignature().

import crypto from 'node:crypto';
import Razorpay from 'razorpay';

const TEST_KEY_PREFIX = 'rzp_test_';
const LIVE_KEY_PREFIX = 'rzp_live_';
/** Razorpay caps `receipt` at 40 characters. */
const MAX_RECEIPT = 40;
/** Guard against pathological notes; an item summary lives in order.notes for receipts. */
const MAX_NOTE_LENGTH = 300;

/** Which Razorpay environment this deployment talks to. */
export type RazorpayMode = 'test' | 'live';

/**
 * Resolve the configured mode. FAIL-CLOSED: only an explicit `live` (any casing, trimmed)
 * selects live; a missing, blank or misspelled value is `test`.
 */
export function getMode(): RazorpayMode {
  return (process.env.RAZORPAY_MODE || '').trim().toLowerCase() === 'live' ? 'live' : 'test';
}

/** True only when the deployment is explicitly configured to take real money. */
export function isLiveMode(): boolean {
  return getMode() === 'live';
}

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
 * THROW unless the configured keys are present AND the key id matches the configured mode.
 * This is the mechanism that makes "test vs live" a property of the configuration, not a
 * promise in a README. Neither key nor secret is included in the error message — a thrown
 * error can end up in a log or an error tracker.
 */
export function assertKeys(): void {
  const mode = getMode();
  const expectedPrefix = mode === 'live' ? LIVE_KEY_PREFIX : TEST_KEY_PREFIX;
  const keyId = readKeyId();
  if (!keyId) {
    throw new Error('Razorpay is not configured: RAZORPAY_KEY_ID is missing.');
  }
  if (!keyId.startsWith(expectedPrefix)) {
    // Deliberately does NOT echo the value, only the expected prefix.
    throw new Error(
      `Refusing to run: RAZORPAY_MODE=${mode} requires a Razorpay key id starting with ` +
        `"${expectedPrefix}". Set RAZORPAY_MODE (test|live) to match the keys in this environment.`,
    );
  }
  if (!readSecret()) {
    throw new Error('Razorpay is not configured: RAZORPAY_KEY_SECRET is missing.');
  }
}

/**
 * True when keys are present AND valid for the configured mode. Safe to call without throwing.
 * (`test` mode requires a test key pair, `live` mode requires a live key pair.)
 */
export function isGatewayConfigured(): boolean {
  try {
    assertKeys();
    return true;
  } catch {
    return false;
  }
}

/** The publishable key id, for sending to the browser. The SECRET is never exposed. */
export function getPublishableKeyId(): string {
  assertKeys();
  return readKeyId();
}

let client: Razorpay | null = null;

/** Lazy singleton — built on first use, never at module scope (guarantee 4). */
function getClient(): Razorpay {
  assertKeys();
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
    // `payment_capture` deliberately OMITTED: the Orders API defaults to AUTOMATIC capture,
    // which is what we want now that the cart can be live (RAZORPAY_MODE=live) — a payment
    // that succeeds should be captured, not left authorized. Leaving it unset also keeps the
    // same order shape in test and live, so nothing about capture is a per-mode surprise.
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

/**
 * Verify a Razorpay WEBHOOK signature (server-to-server events).
 *
 * Razorpay signs the RAW request body with the webhook secret configured in the dashboard
 * (Settings → Webhooks → your endpoint → Secret) and sends the hex digest in the
 * `X-Razorpay-Signature` header. The body MUST be the exact bytes received — re-serialising
 * parsed JSON changes key order/spacing and breaks the HMAC — so callers pass `await request.text()`.
 *
 * Compared with crypto.timingSafeEqual, like verifySignature(). Returns false (never throws) for
 * any malformed input, and false when RAZORPAY_WEBHOOK_SECRET is unset, so an unconfigured
 * webhook can never accept a forged event. The secret is never echoed or logged.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (!secret || typeof rawBody !== 'string' || !rawBody || !signature) return false;
  if (!/^[0-9a-f]{64}$/i.test(signature)) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
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
 * can turn a failed verification into a pass, and `getClient()` calls `assertKeys()`, so an
 * environment whose mode does not match its keys still cannot reach Razorpay.
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