// CHANGE: 2026-10-02 — TypeScript declaration for lib/prices-catalog.mjs (SP-1 cart).
// WHY: TS cannot infer types for a .mjs import; this companion file (the same pattern as
// lib/email-autoreply.d.mts) types the pure-ESM catalogue for Next.js while the Node seed /
// test scripts import the .mjs directly.

export type PriceStatus = 'priced' | 'unpriced' | 'inactive';

export interface PriceItem {
  slug: string;
  name: string;
  category: string;
  validity?: string;
  /** Integer paise BEFORE GST and discounts. */
  basePaise: number;
  /** GST percent (0..100). Applied to base; rounded half-up. */
  gstPct: number;
  /** Integer paise taken off the (base + GST) figure. 0 for most rows. */
  discountPaise: number;
  /** Derived: base + round(base·gst/100) − discount. This is what the cart charges. */
  payablePaise: number;
  /** Slugs of the Amazon-style "frequently paired" items offered by Buy Now. */
  pairsWith: string[];
  /** Addon ids from lib/addons.ts, suggested after an add. */
  addonSlugs: string[];
  /** Module slugs from the same catalogue, suggested after an add (not purchasable yet). */
  moduleSlugs: string[];
  priceStatus: PriceStatus;
  /** Marketing discount label shown next to the struck price, e.g. "10% OFF". */
  discountLabel?: string;
  sortOrder: number;
  updatedAt?: string | null;
}

export function computePayablePaise(basePaise: number, gstPct: number, discountPaise: number): number;
export const PRICES_FALLBACK: PriceItem[];
export function getFallbackPriceItem(slug: string): PriceItem | null;
export function isKnownSlug(slug: string): boolean;