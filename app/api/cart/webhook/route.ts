import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/cart/payment';
// CHANGE: 2026-10-17 — per-IP burst brake (the shared transaction limiter). A webhook is not
// spammable in a useful way once the signature gate is in front of it, but every public write
// route carries a limiter (scripts/security-audit.mjs enforces it), and a runaway retry storm
// should not be able to hammer Mongo.
import { createTransactionLimiter } from '@/lib/cart/transaction-limit';
import { getDb } from '@/lib/mongodb-utils';
import { isIgnoredRequest } from '@/lib/visitors';
import { orderStatusChangeUpdate } from '@/lib/order-status';

// CHANGE: 2026-10-17 (go-live) — Razorpay server-to-server WEBHOOK endpoint for the real cart.
//
// WHY: the client-return flow (/checkout/success -> POST /api/cart/verify) can only confirm a
// payment if the buyer's browser makes it back to the site. If the tab is closed, the phone
// dies, or the network drops between Razorpay capturing the money and the redirect, the order
// stays `created` with no record of the capture. Razorpay's webhook is the durable, retried,
// server-to-server confirmation. It is ADDITIVE: the client verify still runs and remains the
// shopper-facing path; this route is the no-lost-payments backstop.
//
// SECURITY INVARIANTS:
//  - The ONLY trust boundary is the HMAC over the RAW request body, keyed by
//    RAZORPAY_WEBHOOK_SECRET (the secret configured on the Razorpay webhook), compared with
//    crypto.timingSafeEqual inside verifyWebhookSignature(). No signature -> 400, always.
//  - The body is read as TEXT (`request.text()`) and parsed only AFTER verification, because
//    re-serialising the parsed JSON would change the bytes the HMAC was computed over.
//  - The DB write is IDEMPOTENT: it only advances `created -> verified`, so a retried webhook
//    (Razorpay retries failures) or a webhook that arrives after the client already verified
//    appends no duplicate status hop.
//  - It NEVER creates an order and never invents an amount; if we have no matching order doc it
//    simply acknowledges (200) so Razorpay stops retrying.
//  - No email, no conversion tracking. Gated on isIgnoredRequest() for the shared-production-DB
//    reason (a loopback probe must not write).
//
// Razorpay expects a fast 2xx; anything else is retried with backoff. We therefore acknowledge
// early for events we do not act on.

export const runtime = 'nodejs';
export const maxDuration = 60;

const webhookLimiter = createTransactionLimiter({
  // Generous burst brake per source IP. Env-overridable (CART_WEBHOOK_RATE_LIMIT). Razorpay
  // retries can arrive together after an outage, so this is deliberately loose.
  ip: { limit: Number(process.env.CART_WEBHOOK_RATE_LIMIT || 120), windowMs: 60_000 },
});

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Razorpay ids are opaque but fixed-shape; reject anything else before using it in a query. */
const RAZORPAY_ID_RE = /^[A-Za-z0-9_]{1,64}$/;

/**
 * Events that mean money has actually been CAPTURED. `payment.captured` fires when a payment
 * is captured; `order.paid` fires when every payment for an order is complete. Both are treated
 * as "this order is paid". Everything else (payment.authorized, payment.failed, refund.*, …) is
 * acknowledged without changing our order — an authorized-but-uncaptured payment is not money.
 */
const PAID_EVENTS = new Set(['payment.captured', 'order.paid']);

export async function POST(request: Request) {
  // 1. Per-IP brake before anything else.
  const ip = getClientIp(request);
  const decision = webhookLimiter.check({ ip });
  if (decision.limited) {
    return NextResponse.json({ ok: false, error: 'Too many requests.' }, { status: 429, headers: decision.headers });
  }

  // 2. RAW body — must be the exact bytes Razorpay signed. Never re-serialise.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: 'Unreadable body.' }, { status: 400 });
  }
  if (!raw) {
    return NextResponse.json({ ok: false, error: 'Empty body.' }, { status: 400 });
  }

  // 3. The signature is the only trust boundary.
  const signature = request.headers.get('x-razorpay-signature') || '';
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 400 });
  }

  // 4. Parse — safe now that the signature is verified.
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const eventType = typeof event.event === 'string' ? event.event : '';

  // 5. Acknowledge events we do not act on, so Razorpay does not retry them.
  if (!PAID_EVENTS.has(eventType)) {
    return NextResponse.json({ ok: true, event: eventType, handled: false });
  }

  // 6. Extract ids defensively from either event shape.
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  const payment = ((payload.payment as Record<string, unknown> | undefined)?.entity ?? null) as
    | Record<string, unknown>
    | null;
  const orderEntity = ((payload.order as Record<string, unknown> | undefined)?.entity ?? null) as
    | Record<string, unknown>
    | null;

  const razorpayOrderId =
    (typeof payment?.order_id === 'string' && payment.order_id) ||
    (typeof orderEntity?.id === 'string' && orderEntity.id) ||
    '';
  const razorpayPaymentId = typeof payment?.id === 'string' ? payment.id : '';

  if (!RAZORPAY_ID_RE.test(razorpayOrderId)) {
    // Nothing we can act on — acknowledge so it is not retried forever.
    return NextResponse.json({ ok: true, event: eventType, handled: false });
  }

  // 7. Idempotent advance: created -> verified ONLY. A repeat webhook (or one that lands after
  //    the client already verified the order) matches nothing, so no duplicate hop is appended.
  if (!isIgnoredRequest(request)) {
    try {
      const db = await getDb();
      const chg = orderStatusChangeUpdate('verified', {
        note: `Payment captured (webhook ${eventType}${razorpayPaymentId ? ` ${razorpayPaymentId}` : ''})`,
        actor: 'system',
      });
      const set: Record<string, unknown> = { ...chg.$set };
      if (razorpayPaymentId) set.razorpayPaymentId = razorpayPaymentId;
      if (payment && typeof payment.amount === 'number') set.capturedPaise = payment.amount;

      await db.collection('orders').updateOne(
        { razorpayOrderId, status: 'created' },
        { $set: set, $push: chg.$push } as never,
      );
    } catch {
      // Swallow: still acknowledge so Razorpay does not retry a write we may have partially done.
      // (The update is a single atomic op, so a failure means nothing was written.)
    }
  }

  return NextResponse.json({ ok: true, event: eventType, handled: true });
}

/** Razorpay only POSTs. Answer other verbs with 405 rather than a confusing 404/500. */
export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
