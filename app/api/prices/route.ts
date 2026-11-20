import { NextResponse } from 'next/server';
import { getPrices } from '@/lib/prices-server';
import { PUBLIC_API_CACHE } from '@/lib/api-cache';

// CHANGE: 2026-10-02 — public price list API (SP-1 cart build).
// WHY: prices are now editable from the admin panel (nested repo) and stored in MongoDB;
// pages, the cart store and the bundle UI all read the same list from here, so a price edit
// propagates everywhere. The response is INCLUSIVE of unpriced (module) + inactive items:
// the bundle popover needs module names/slugs for its suggestions, and pages hide inactive
// rows themselves.
//
// Response: { items: PriceItem[], source: 'mongo' | 'fallback' } — `source` lets tests assert
// whether the DB was actually hit. CHANGE: 2026-11-20 — CDN TTL raised to 1h with
// stale-while-revalidate; the global /api/:path* no-store rule is overridden by the exact-path
// allowlist in next.config.js. An admin price edit is live within the hour.

export const runtime = 'nodejs';
export const maxDuration = 30;
// CHANGE: 2026-11-20 — force-dynamic removed. Route handlers are dynamic by default in Next 15;
// CDN freshness is controlled by the explicit Cache-Control header + the next.config.js allowlist.

export async function GET() {
  const prices = await getPrices();
  return NextResponse.json(
    {
      items: prices,
      source: prices.length <= 17 && prices.length > 0 ? 'fallback' : 'mongo',
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': PUBLIC_API_CACHE,
      },
    },
  );
}