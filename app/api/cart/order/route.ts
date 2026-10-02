import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { assertTestKeys, createOrder, getPublishableKeyId } from '@/lib/cart/payment';
import { repriceOrderItems } from '@/lib/cart/pricing';
import { MAX_CART_LINES } from '@/lib/cart/math';
import { createRateLimiter } from '@/lib/cart/rate-limit';
import { getDb } from '@/lib/mongodb-utils';
import { isIgnoredRequest } from '@/lib/visitors';

// CHANGE: 2026-10-02 — create a Razorpay TEST order for the real cart (SP-1 cart build).
// WHY: this route is the server-authoritative pricing boundary. The browser posts slugs and
// quantities ONLY; every money figure below is re-derived from the LIVE prices collection by
// repriceOrderItems(). The body's amount fields are NEVER read.
//
// SECURITY INVARIANTS (same posture as the /demo gateway this was modelled on):
//  - assertTestKeys() runs before anything else — this route cannot create a LIVE order even
//    under a misconfigured environment (and the leaked test keys are rotated before go-live).
//  - Unpriced / inactive / unknown slugs are REJECTED with 400, never silently charged or
//    silently dropped — the UI blocks module adds, this route is the backstop.
//  - The Razorpay order is created EITHER WAY so a local run is genuinely end-to-end; the
//    `orders` document is written ONLY for non-ignored (i.e. real visitor) requests, per the
//    AGENTS.md shared-production-DB rule.
//  - No email, no geo lookup, no conversion tracking. This route touches only Razorpay and
//    the orders collection.

export const runtime = 'nodejs';
export const maxDuration = 60;

const rateLimiter = createRateLimiter(Number(process.env.CART_ORDER_RATE_LIMIT || 20), 60_000);

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: Request) {
  // 1. Test-mode guard first. Nothing else runs unless the cart is on Razorpay TEST keys.
  try {
    assertTestKeys();
  } catch (err) {
    // The message is safe: assertTestKeys() never echoes a key or a secret.
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Razorpay is not configured.' },
      { status: 503 },
    );
  }

  // 2. Rate limit.
  const ip = getClientIp(request);
  const { limited, retryAfter } = rateLimiter.check(ip);
  if (limited) {
    return NextResponse.json(
      { ok: false, error: 'Too many orders. Wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  // 3. Parse + validate the body shape.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }
  const rawItems = (body as { items?: unknown })?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ ok: false, error: 'Your cart is empty.' }, { status: 400 });
  }
  if (rawItems.length > MAX_CART_LINES) {
    return NextResponse.json({ ok: false, error: 'Too many distinct items.' }, { status: 400 });
  }

  // 4. REPRICE SERVER-SIDE against the live catalogue. Rejected lines get a named 400 so the
  //    checkout page can tell the buyer exactly which item cannot be bought yet.
  const { totals, rejected } = await repriceOrderItems(rawItems);
  if (rejected.length > 0) {
    const first = rejected[0];
    const reason =
      first.reason === 'unpriced'
        ? ' cannot be added yet — it is not for sale.'
        : first.reason === 'inactive'
          ? ' is no longer available.'
          : ' is not in the catalogue.';
    return NextResponse.json(
      { ok: false, error: `"${first.name}"${reason} Remove it from your cart and try again.` },
      { status: 400 },
    );
  }
  if (totals.lines.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'None of those items can be purchased yet.' },
      { status: 400 },
    );
  }
  const amountPaise = totals.totalPaise;

  // 5. Create the Razorpay order (always — a local run must be genuinely end-to-end).
  //    notes.cartItems is a compact [slug,qty] summary so the verify route can itemise the
  //    receipt even when no `orders` row was persisted (localhost runs, AGENTS.md). It is
  //    DISPLAY DATA only — the security boundary stays the HMAC in verify.
  const orderId = `cart_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
  const cartItemsNote = JSON.stringify(totals.lines.map((l) => [l.slug, l.qty])).slice(0, 300);
  let razorpayOrder;
  try {
    razorpayOrder = await createOrder({
      amountPaise,
      receipt: orderId,
      notes: { source: 'cart', testMode: 'true', cartItems: cartItemsNote },
    });
  } catch (err) {
    // Surface the reason, but never key material — createOrder() never puts any in its errors.
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Could not create the order.' },
      { status: 502 },
    );
  }

  // 6. Persist, unless this is an ignored (local/loopback) request. A persistence failure
  //    must NOT block a test payment — verify degrades to signature-only verification.
  const persist = !isIgnoredRequest(request);
  if (persist) {
    try {
      const db = await getDb();
      await db.collection('orders').insertOne({
        orderId,
        razorpayOrderId: razorpayOrder.id,
        amountPaise,
        currency: 'INR',
        items: totals.lines.map((l) => ({
          slug: l.slug,
          name: l.item.name,
          qty: l.qty,
          unitPaise: l.unitPaise,
          totalPaise: l.totalPaise,
        })),
        subtotalPaise: totals.subtotalPaise,
        gstPaise: totals.gstPaise,
        discountPaise: totals.discountPaise,
        status: 'created',
        testMode: true,
        ip,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
    } catch {
      // non-fatal — see above
    }
  }

  // 7. Respond. `amount` is the server's figure — the browser must pass it to Razorpay
  //    UNCHANGED. The itemised lines are echoed for the checkout summary.
  return NextResponse.json({
    ok: true,
    orderId,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: getPublishableKeyId(),
    testMode: true,
    persisted: persist,
    items: totals.lines.map((l) => ({ slug: l.slug, name: l.item.name, qty: l.qty, unitPaise: l.unitPaise, totalPaise: l.totalPaise })),
    totals: {
      subtotalPaise: totals.subtotalPaise,
      gstPaise: totals.gstPaise,
      discountPaise: totals.discountPaise,
      totalPaise: totals.totalPaise,
    },
  });
}