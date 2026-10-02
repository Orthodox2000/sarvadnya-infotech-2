import { NextResponse } from 'next/server';
import { computeTotals } from '@/lib/demo/cart.ts';
import { assertTestKeys, createOrder, getPublishableKeyId } from '@/lib/demo/razorpay.ts';
import { getDb } from '@/lib/mongodb-utils';
import { isIgnoredRequest } from '@/lib/visitors';
import crypto from 'node:crypto';

// CHANGE: 2026-10-02 — create a Razorpay TEST order for the /demo cart scaffold (SP-1).
// WHY: this route is the server-authoritative pricing boundary. The client posts product ids
// and quantities ONLY; every money figure below is derived from lib/demo/catalog.ts.
//
// SECURITY INVARIANTS
//  - The request body's amount fields are NEVER read. computeTotals() ignores anything but
//    {id, qty}, and drops ids that are not in the catalog, so a client cannot invent a price.
//  - assertTestKeys() runs before anything else, so this route cannot create a LIVE order even
//    if the environment is misconfigured.
//  - No email, no geo lookup, no conversion tracking, no visitor write. This scaffold touches
//    nothing else in the system.
//
// PRODUCTION DATABASE: .env MONGODB_URI points at the live Atlas cluster and next dev reads
// it (AGENTS.md). The Razorpay order is created EITHER WAY so a local run gets a genuine
// end-to-end checkout, but the `demo_orders` document is written ONLY when the request is not
// from an ignored IP — that is the isIgnoredRequest() gate the rest of the codebase uses.

export const runtime = 'nodejs';
export const maxDuration = 60;

// Mirrors the pattern in app/api/email/submit/route.ts.
const RATE_LIMIT = Number(process.env.DEMO_ORDER_RATE_LIMIT || 20);
const RATE_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now < entry.resetAt) {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap) if (val.resetAt < now) rateLimitMap.delete(key);
  }
  return { limited: false, retryAfter: 0 };
}

export async function POST(request: Request) {
  // 1. Test-mode guard first. Nothing else runs if /demo is not configured for test mode.
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
  const { limited, retryAfter } = isRateLimited(ip);
  if (limited) {
    return NextResponse.json(
      { ok: false, error: 'Too many test orders. Wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  // 3. Parse + sanitise. computeTotals drops unknown ids and clamps quantities itself, so a
  //    hostile body cannot produce a negative, fractional or astronomical amount.
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
  if (rawItems.length > 50) {
    return NextResponse.json({ ok: false, error: 'Too many distinct items.' }, { status: 400 });
  }

  // 4. REPRICE SERVER-SIDE. This is the whole point of the route.
  const totals = computeTotals(rawItems);
  if (totals.lines.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'None of those items are in the catalog.' },
      { status: 400 },
    );
  }
  const amountPaise = totals.totalPaise;

  // 5. Create the Razorpay order (always, so a local run is genuinely end-to-end).
  const orderId = `demo_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
  let razorpayOrder;
  try {
    razorpayOrder = await createOrder({
      amountPaise,
      receipt: orderId,
      notes: { source: 'demo-cart', testMode: 'true' },
    });
  } catch (err) {
    // Surface the reason, but never key material — createOrder() never puts any in its errors.
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Could not create the test order.' },
      { status: 502 },
    );
  }

  // 6. Persist, unless this is an ignored (local/loopback) request.
  const persist = !isIgnoredRequest(request);
  if (persist) {
    try {
      const db = await getDb();
      await db.collection('demo_orders').insertOne({
        orderId,
        razorpayOrderId: razorpayOrder.id,
        amountPaise,
        currency: 'INR',
        items: totals.lines.map((l) => ({ id: l.id, qty: l.qty, unitPaise: l.unitPaise })),
        subtotalPaise: totals.subtotalPaise,
        taxPaise: totals.taxPaise,
        status: 'created',
        testMode: true,
        ip,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
    } catch {
      // A persistence failure must NOT block a test payment. The verify route degrades to
      // signature-only verification, which is still sound.
    }
  }

  // 7. Respond. `amount` is the server's figure — the client must pass it to Razorpay UNCHANGED.
  return NextResponse.json({
    ok: true,
    orderId,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: getPublishableKeyId(),
    testMode: true,
    persisted: persist,
  });
}