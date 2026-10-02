import { NextResponse } from 'next/server';
import { getPrices } from '@/lib/prices-server';

// CHANGE: 2026-10-02 — public price list API (SP-1 cart build).
// WHY: prices are now editable from the admin panel (nested repo) and stored in MongoDB;
// pages, the cart store and the bundle UI all read the same list from here, so a price edit
// propagates everywhere. The response is INCLUSIVE of unpriced (module) + inactive items:
// the bundle popover needs module names/slugs for its suggestions, and pages hide inactive
// rows themselves.
//
// Response: { items: PriceItem[], source: 'mongo' | 'fallback' } — `source` lets tests assert
// whether the DB was actually hit. Cache is deliberately short (60s CDN, 300s stale-while-
// revalidate) so an admin edit shows up on the live site within a minute without hammering
// Atlas on every page view.

export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

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
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
      },
    },
  );
}