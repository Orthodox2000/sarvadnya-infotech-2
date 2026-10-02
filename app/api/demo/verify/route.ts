import { NextResponse } from 'next/server';
import { fetchOrderAmountPaise, verifySignature } from '@/lib/demo/razorpay.ts';
import { getDb } from '@/lib/mongodb-utils';
import { isIgnoredRequest } from '@/lib/visitors';

// CHANGE: 2026-10-02 — verify a Razorpay TEST payment for the /demo cart scaffold (SP-1).
// WHY: the success page NEVER trusts its own URL. Anyone can hand-craft
// /demo/checkout/success?razorpayPaymentId=…&razorpaySignature=… and reach a page that
// renders a green "verified" badge, so verification happens here instead.
//
// SECURITY INVARIANTS
//  - The amount is NEVER taken from the request body. It comes from the stored order, or —
//    for DISPLAY ONLY, after verification has already passed — from Razorpay. Never the caller.
//  - The order is located by razorpay_order_id in the DATABASE, not by anything the client
//    asserts about it (Razorpay's own go-live checklist).
//  - The signature is compared with crypto.timingSafeEqual inside verifySignature(). That HMAC
//    is the ONLY verification step; see step 4b for why the amount fetch is not a second one.
//  - Nothing sensitive is logged and nothing is echoed back beyond ids, an amount and a verdict.
//
// PRODUCTION DATABASE: as in the order route, the DB write is gated on isIgnoredRequest() so a
// local run cannot pollute the live collection.

export const runtime = 'nodejs';
export const maxDuration = 60;

const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now < entry.resetAt) {
    entry.count++;
    if (entry.count > RATE_LIMIT) return true;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap) if (val.resetAt < now) rateLimitMap.delete(key);
  }
  return false;
}

/** Razorpay ids are opaque but fixed-shape; reject anything else before using it in a query. */
const RAZORPAY_ID_RE = /^[A-Za-z0-9_]{1,64}$/;

export async function POST(request: Request) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { ok: false, verified: false, error: 'Too many verification attempts.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, verified: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const razorpayOrderId = typeof body.razorpayOrderId === 'string' ? body.razorpayOrderId : '';
  const razorpayPaymentId = typeof body.razorpayPaymentId === 'string' ? body.razorpayPaymentId : '';
  const razorpaySignature = typeof body.razorpaySignature === 'string' ? body.razorpaySignature : '';

  if (
    !RAZORPAY_ID_RE.test(razorpayOrderId) ||
    !RAZORPAY_ID_RE.test(razorpayPaymentId) ||
    !razorpaySignature
  ) {
    return NextResponse.json(
      { ok: false, verified: false, error: 'Missing or malformed payment details.' },
      { status: 400 },
    );
  }

  // 1. Load OUR order by razorpay_order_id. The client cannot tell us which order this is.
  let stored: Record<string, unknown> | null = null;
  try {
    const db = await getDb();
    stored = await db
      .collection('demo_orders')
      .findOne({ razorpayOrderId }, { projection: { _id: 0 } } as never);
  } catch {
    stored = null;
  }

  // 2. Verify the signature. This is the actual security boundary: only Razorpay, holding our
  //    secret, can produce it for this exact `order|payment` pair.
  const verified = verifySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!verified) {
    return NextResponse.json(
      { ok: false, verified: false, error: 'The payment signature did not verify.' },
      { status: 400 },
    );
  }

  // 3. Record the payment id for idempotency, so a replayed callback cannot double-apply.
  //    Gated on isIgnoredRequest() for the same production-DB reason as the order route.
  if (stored && !isIgnoredRequest(request)) {
    try {
      const db = await getDb();
      await db.collection('demo_orders').updateOne(
        { razorpayOrderId },
        {
          $set: {
            razorpayPaymentId,
            status: 'verified',
            updatedAt: new Date(),
          },
        } as never,
      );
    } catch {
      // Non-fatal: the signature already proved the payment.
    }
  }

  // 4. Amount comes from OUR stored order, never from the request. When nothing was stored
  //    (a local run, or the order write failed) we report null rather than inventing a figure.
  const amountPaise = typeof stored?.amountPaise === 'number' ? stored.amountPaise : null;

  // 4b. DISPLAY-ONLY FALLBACK for the receipt's amount field.
  //
  // Reached only when the DB has no order - a localhost run (the `demo_orders` write is
  // deliberately skipped for ignored IPs) or a failed insert. Without this the printed
  // receipt would say "Amount: -" on exactly the machine the owner tests from.
  //
  // It is NOT a second verification factor: it runs only after verifySignature() returned
  // true, nothing it returns can change `verified`, and it is never reached on the failure
  // path above (which has already returned). A Razorpay outage here degrades to "not
  // recorded" - never to a wrong number and never to an error page.
  const amountForDisplay = amountPaise ?? (await fetchOrderAmountPaise(razorpayOrderId));

  return NextResponse.json({
    ok: true,
    verified: true,
    amount: amountForDisplay,
    orderId: typeof stored?.orderId === 'string' ? stored.orderId : null,
    razorpayOrderId,
    razorpayPaymentId,
    persisted: Boolean(stored),
    testMode: true,
  });
}