// CHANGE: 2026-10-02 — server-side price reads (SP-1 cart).
// WHY: /api/prices and the /api/cart/* routes need the LIVE price list from MongoDB, but a
// Mongo outage or an empty collection must never blank a priced page or break checkout —
// so every read falls back to the built-in catalogue (identical numbers, never blank).
//
// This module is SERVER-ONLY: it imports mongodb-utils, so client components must not
// import it. Clients read the same data through GET /api/prices.

import { getDb } from './mongodb-utils';
import { PRICES_FALLBACK, computePayablePaise } from './prices-catalog.mjs';
import type { PriceItem } from './prices-catalog.mjs';

/** Shape stored in MongoDB (MongoDate updatedAt). */
interface PriceDoc extends Omit<PriceItem, 'updatedAt'> {
  updatedAt?: Date | string | null;
}

/** Robustly coerce a Mongo doc into a PriceItem. Bad row → recompute the payable, drop the doc
 *  entirely when the slug is unusable. Never throws. */
function toPriceItem(d: Record<string, unknown>): PriceItem | null {
  const slug = typeof d.slug === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(d.slug) ? d.slug : null;
  if (!slug) return null;
  const basePaise = typeof d.basePaise === 'number' && Number.isSafeInteger(d.basePaise) && d.basePaise >= 0 ? d.basePaise : 0;
  const gstPct = typeof d.gstPct === 'number' && Number.isInteger(d.gstPct) && d.gstPct >= 0 && d.gstPct <= 100 ? d.gstPct : 0;
  const discountPaise = typeof d.discountPaise === 'number' && Number.isSafeInteger(d.discountPaise) && d.discountPaise >= 0 ? d.discountPaise : 0;
  return {
    slug,
    name: typeof d.name === 'string' && d.name ? d.name : slug,
    category: typeof d.category === 'string' && d.category ? d.category : 'others',
    validity: typeof d.validity === 'string' && d.validity ? d.validity : undefined,
    basePaise,
    gstPct,
    discountPaise,
    payablePaise: computePayablePaise(basePaise, gstPct, discountPaise),
    pairsWith: Array.isArray(d.pairsWith) ? d.pairsWith.filter((x): x is string => typeof x === 'string') : [],
    addonSlugs: Array.isArray(d.addonSlugs) ? d.addonSlugs.filter((x): x is string => typeof x === 'string') : [],
    moduleSlugs: Array.isArray(d.moduleSlugs) ? d.moduleSlugs.filter((x): x is string => typeof x === 'string') : [],
    priceStatus: d.priceStatus === 'priced' || d.priceStatus === 'unpriced' || d.priceStatus === 'inactive' ? d.priceStatus : 'inactive',
    discountLabel: typeof d.discountLabel === 'string' && d.discountLabel ? d.discountLabel : undefined,
    sortOrder: typeof d.sortOrder === 'number' && Number.isInteger(d.sortOrder) ? d.sortOrder : 0,
    ...(d.updatedAt ? { updatedAt: d.updatedAt instanceof Date ? d.updatedAt.toISOString() : String(d.updatedAt) } : {}),
  };
}

export async function getPrices(): Promise<PriceItem[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<PriceDoc>('prices')
      .find({})
      .sort({ category: 1, sortOrder: 1, slug: 1 })
      .limit(400)
      .toArray();
    if (!docs.length) return PRICES_FALLBACK as unknown as PriceItem[];
    const mapped = docs.map((d) => toPriceItem(d as unknown as Record<string, unknown>)).filter((x): x is PriceItem => x !== null);
    return mapped.length ? mapped : (PRICES_FALLBACK as unknown as PriceItem[]);
  } catch {
    return PRICES_FALLBACK as unknown as PriceItem[];
  }
}

export async function getPriceBySlug(slug: string): Promise<PriceItem | null> {
  if (!slug) return null;
  const all = await getPrices();
  return all.find((p) => p.slug === slug) ?? null;
}