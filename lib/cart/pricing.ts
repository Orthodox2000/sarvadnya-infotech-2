// CHANGE: 2026-10-02 — server-side repricing for the real cart (SP-1 cart build).
// WHY: the /api/cart/order route must re-derive every money figure from the LIVE prices
// collection, not from anything the client sent. This module wraps that lookup + the pure
// math and reports REJECTIONS with human names, so the route can answer "400 — X cannot be
// added yet" instead of silently dropping lines.
//
// IMPORTANT: no "/demo" literal — the demo-independence guard scans lib/.

import { computeTotals, sanitizeItems, toPriceMap, type CartItem, type CartTotals } from './math';
import { getPrices } from '../prices-server';
import type { PriceItem } from '../prices-catalog.mjs';

export interface RejectedLine {
  slug: string;
  name: string;
  reason: 'unknown' | 'unpriced' | 'inactive';
}

export interface RepriceResult {
  /** Cleaned, sellable lines + totals (server-authoritative). */
  totals: CartTotals;
  /** Requested lines that cannot be bought. Empty when the order is clean. */
  rejected: RejectedLine[];
  /** All-catalogue map (incl. unpriced/inactive) for slug lookups. */
  all: ReadonlyMap<string, PriceItem>;
}

/**
 * Load the live price list once and resolve an unknown `items` body against it.
 *
 * - Unknown slugs (not in Mongo, not in the fallback catalogue) → rejected 'unknown'.
 * - Known but unpriced (modules) / inactive → rejected with that reason + display name.
 * - Everything else is repriced from the catalogue and returned as totals.
 */
export async function repriceOrderItems(rawItems: unknown): Promise<RepriceResult> {
  const prices = await getPrices();
  const all = toPriceMap(prices);

  const input = Array.isArray(rawItems) ? rawItems : [];
  const requested: CartItem[] = sanitizeItems(input, all);
  const rejected: RejectedLine[] = [];
  const sellable: CartItem[] = [];
  const seen = new Set<string>();

  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const slug = (raw as { slug?: unknown }).slug;
    if (typeof slug !== 'string' || seen.has(slug)) continue;
    seen.add(slug);
    const price = all.get(slug);
    if (!price) {
      rejected.push({ slug, name: slug, reason: 'unknown' });
    } else if (price.priceStatus === 'inactive') {
      rejected.push({ slug, name: price.name, reason: 'inactive' });
    } else if (price.priceStatus !== 'priced') {
      rejected.push({ slug, name: price.name, reason: 'unpriced' });
    }
  }

  for (const item of requested) {
    const price = all.get(item.slug);
    if (price && price.priceStatus === 'priced') sellable.push(item);
  }

  const totals = computeTotals(sellable, all);
  return { totals, rejected, all };
}