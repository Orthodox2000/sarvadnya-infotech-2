import { NextResponse } from 'next/server';
import { fetchOrderAmountPaise, verifySignature } from '@/lib/cart/payment';
import { computeTotals, toPriceMap, type CartItem } from '@/lib/cart/math';
import { getPrices } from '@/lib/prices-server';
import { createRateLimiter } from '@/lib/cart/rate-limit';
import { getDb } from '@/lib/mongodb-utils';
import { isIgnoredRequest } from '@/lib/visitors';

// CHANGE: 2026-10-02 — verify a Razorpay TEST payment for the real cart (SP-1 cart build).
// WHY: the /checkout/success page NEVER trusts its own URL. Anyone can hand-craft
// /checkout/success?razorpayPaymentId=…&razorpaySignature=… and land on a page that renders
// a green "verified" badge — so verification happens here.
//
// SECURITY INVARIANTS (identical posture to the /demo gateway this was modelled on):
//  - The amount is NEVER taken from the request body. It comes from the stored order, or —
//    for DISPLAY ONLY, after verification has already passed — from Razorpay. Never the caller.
//  - The order is located by razorpay_order_id in the DATABASE, not by anything the client
//    asserts about it.
//  - The signature is compared with crypto.timingSafeEqual inside verifySignature(). That
//    HMAC is the ONLY verification step; the amount fetch is display, not a second factor.
//  - Itemised lines come from the stored order; on a localhost run (order deliberately not
//    persisted) they are reconstructed from the order's `cartItems` note — DISPLAY data only,
//    never a verification input.

export const runtime = 'nodejs';
export const maxDuration = 60;

const rateLimiter = createRateLimiter(60, 60_000);

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Razorpay ids are opaque but fixed-shape; reject anything else before using it in a query. */
const RAZORPAY_ID_RE = /^[A-Za-z0-9_]{1,64}$/;

interface VerifyLine {
  slug: string;
  name: string;
  qty: number;
  unitPaise: number;
  totalPaise: number;
}

export async function POST(request: Request) {
  const { limited, retryAfter } = rateLimiter.check(getClientIp(request));
  if (limited) {
    return NextResponse.json(
      { ok: false, verified: false, error: 'Too many verification attempts.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
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
    stored = (await db.collection('orders').findOne({ razorpayOrderId }, { projection: { _id: 0 } } as never)) as Record<string, unknown> | null;
  } catch {
    stored = null;
  }

  // 2. Verify the signature. This is the actual security boundary: only Razorpay, holding
  //    our secret, can produce it for this exact `order|payment` pair.
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
  //    Gated on isIgnoredRequest() for the shared-production-DB reason (AGENTS.md).
  if (stored && !isIgnoredRequest(request)) {
    try {
      const db = await getDb();
      await db.collection('orders').updateOne(
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
  //    (a local run) we report null rather than inventing a figure.
  const amountPaise = typeof stored?.amountPaise === 'number' ? stored.amountPaise : null;

  // 4b. DISPLAY-ONLY FALLBACK for the receipt's amount — reached only when the DB has no
  //     order (localhost) and only AFTER verifySignature() passed. Not a second factor.
  const amountForDisplay = amountPaise ?? (await fetchOrderAmountPaise(razorpayOrderId));

  // 5. Itemised lines for the receipt. Prefer the persisted order; on a localhost run,
  //    rebuild them from the order's `cartItems` note (created by /api/cart/order) against
  //    the live price list. All of it renders after the HMAC above — display, not trust.
  let lines: VerifyLine[] | null = null;
  const storedItems = stored?.items;
  if (Array.isArray(storedItems) && storedItems.length > 0) {
    lines = storedItems
      .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
      .map((l) => ({
        slug: typeof l.slug === 'string' ? l.slug : '',
        name: typeof l.name === 'string' ? l.name : String(l.slug ?? ''),
        qty: typeof l.qty === 'number' ? l.qty : 1,
        unitPaise: typeof l.unitPaise === 'number' ? l.unitPaise : 0,
        totalPaise: typeof l.totalPaise === 'number' ? l.totalPaise : 0,
      }));
  } else {
    const noteItems = stored ? (stored.cartItems as unknown) : null;
    const parsed = typeof noteItems === 'string' ? safeParseCartItems(noteItems) : null;
    if (parsed && parsed.length > 0) {
      const prices = await getPrices();
      const known = toPriceMap(prices);
      const items: CartItem[] = parsed.map(([slug, qty]) => ({ slug, qty }));
      const totals = computeTotals(items, known);
      lines = totals.lines.map((l) => ({
        slug: l.slug,
        name: l.item.name,
        qty: l.qty,
        unitPaise: l.unitPaise,
        totalPaise: l.totalPaise,
      }));
    }
  }

  return NextResponse.json({
    ok: true,
    verified: true,
    amount: amountForDisplay,
    orderId: typeof stored?.orderId === 'string' ? stored.orderId : null,
    razorpayOrderId,
    razorpayPaymentId,
    persisted: Boolean(stored),
    testMode: true,
    items: lines,
    totals:
      typeof stored?.subtotalPaise === 'number'
        ? {
            subtotalPaise: stored.subtotalPaise,
            gstPaise: typeof stored.gstPaise === 'number' ? stored.gstPaise : 0,
            discountPaise: typeof stored.discountPaise === 'number' ? stored.discountPaise : 0,
            // stored totals carry the authoritative total; fall back to amount when absent
            totalPaise: typeof stored.totalPaise === 'number' ? stored.totalPaise : amountForDisplay,
          }
        : null,
  });
}

/** Parse the compact [["slug",qty],…] note. Defensive: shape, sizes and types all checked. */
function safeParseCartItems(raw: string): [string, number][] | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0 || data.length > 50) return null;
    const out: [string, number][] = [];
    for (const entry of data) {
      if (!Array.isArray(entry) || entry.length !== 2) return null;
      const [slug, qty] = entry;
      if (typeof slug !== 'string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(slug)) return null;
      if (typeof qty !== 'number' || !Number.isFinite(qty) || qty < 1 || qty > 99) return null;
      out.push([slug, qty]);
    }
    return out;
  } catch {
    return null;
  }
}