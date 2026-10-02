// CHANGE: 2026-10-02 — typed facade over the pure-ESM price catalogue (SP-1 cart).
// WHY: the catalogue lives in lib/prices-catalog.mjs so the seed script and Node tests can
// import it directly; this file adds the TypeScript conveniences the app needs on top of it:
//   - resolvePriceItem(): live-DB item with a FALLBACK guarantee — a page row can never go
//     blank because a DB document is missing or renamed.
//   - priceRowView(): derives the exact display strings the silver/gold/tss pages render
//     today ("22,500 / 4,050 / 26,550/- / You save 1,062/-"), so the pages and the cart are
//     the same numbers by construction.
//   - validatePriceItem(): the one validator shared by the admin API (nested repo) and the
//     test suite. Money invariants are enforced here, not in the route.
//
// THIS MODULE IS PURE (no React, no IO, no next imports). Client components import it for
// display derivation; server code imports it via lib/prices-server.ts for the Mongo read.

import {
  computePayablePaise,
  getFallbackPriceItem,
  type PriceItem,
  type PriceStatus,
} from './prices-catalog.mjs';

export type { PriceItem, PriceStatus } from './prices-catalog.mjs';
export { computePayablePaise, getFallbackPriceItem } from './prices-catalog.mjs';

/** Slugs that are safe to sell right now (priced + active). Inactive items are excluded
 *  by the caller; `priced` is the only sellable status. */
export function isSellable(item: PriceItem): boolean {
  return item?.priceStatus === 'priced' && item.payablePaise > 0;
}

/**
 * Resolve a row slug against the LIVE price list, falling back to the built-in catalogue.
 * When the live list has the slug (even as inactive) the live doc wins — so an admin
 * "inactive" flag hides the row; the fallback only fires when the slug is absent entirely
 * (pre-seed or renamed). Returns null only for slugs unknown to the fallback too.
 */
export function resolvePriceItem(slug: string, live: readonly PriceItem[] | null | undefined): PriceItem | null {
  if (slug) {
    const found = live?.find((p) => p.slug === slug);
    if (found) return found;
  }
  return getFallbackPriceItem(slug);
}

/** en-IN "22,500" (no symbol). Works for whole-rupee prices; shows paise when present. */
const rupeePlain = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** Integer paise → whole-rupee display string ("2655000" → "22,500"). */
export function formatRupeesPlain(paise: number): string {
  if (!Number.isFinite(paise)) return '0';
  return rupeePlain.format(Math.round(paise) / 100);
}

/** The exact row shape the silver / gold pages render. */
export interface PriceRowView {
  product: string;
  validity: string;
  base: string;
  gst: string;
  total: string;
  strike?: string;
  discount?: string;
  save?: string;
}

/**
 * Derive the pages' display strings from a PriceItem.
 * base = "22,500", gst = "4,050", total = "26,550/-", and for discounted rows
 * strike = base + GST ("9,558"), discount = the stored label ("10% OFF") and
 * save = "You save 1,062/-". String-for-string identical to the hardcoded rows they replace.
 */
export function priceRowView(item: PriceItem): PriceRowView {
  const basePaise = Math.max(0, item.basePaise);
  const gstPaise = Math.round((basePaise * item.gstPct) / 100);
  const discounted = item.discountPaise > 0;
  return {
    product: item.name,
    validity: item.validity ?? '',
    base: formatRupeesPlain(basePaise),
    gst: formatRupeesPlain(gstPaise),
    total: `${formatRupeesPlain(item.payablePaise)}/-`,
    ...(discounted
      ? {
          strike: formatRupeesPlain(basePaise + gstPaise),
          discount: item.discountLabel ?? 'Special price',
          save: `You save ${formatRupeesPlain(item.discountPaise)}/-`,
        }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// Validation — shared by the admin API and the test suite.
// ---------------------------------------------------------------------------

export interface PriceValidationResult {
  ok: boolean;
  /** field → human-readable problem. Empty when ok. */
  errors: Record<string, string>;
  /** The cleaned item when ok. */
  value?: PriceItem;
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const STATUSES: readonly PriceStatus[] = ['priced', 'unpriced', 'inactive'];

/**
 * Validate and normalise a price document. `knownSlugs` (all catalogue slugs, including
 * fallback) is used to check pairsWith/addonSlugs/moduleSlugs references and slug renames.
 */
export function validatePriceItem(raw: unknown, knownSlugs: ReadonlySet<string>): PriceValidationResult {
  const errors: Record<string, string> = {};
  const src = (raw ?? {}) as Record<string, unknown>;

  const slug = typeof src.slug === 'string' ? src.slug.trim() : '';
  if (!SLUG_RE.test(slug)) errors.slug = 'Slug must be 1-64 chars: lowercase letters, digits and hyphens.';

  const name = typeof src.name === 'string' ? src.name.trim() : '';
  if (!name) errors.name = 'Name is required.';
  else if (name.length > 160) errors.name = 'Name must be 160 characters or fewer.';

  const category = typeof src.category === 'string' ? src.category.trim() : '';
  if (!category) errors.category = 'Category is required.';

  const priceStatus = STATUSES.includes(src.priceStatus as PriceStatus) ? (src.priceStatus as PriceStatus) : '';
  if (!priceStatus) errors.priceStatus = 'Status must be priced, unpriced or inactive.';

  // Allow unpriced structure rows to be all-zero; anything sellable must have sane money.
  const basePaise = typeof src.basePaise === 'number' && Number.isSafeInteger(src.basePaise) ? src.basePaise : NaN;
  const gstPct = typeof src.gstPct === 'number' && Number.isInteger(src.gstPct) ? src.gstPct : NaN;
  const discountPaise = typeof src.discountPaise === 'number' && Number.isSafeInteger(src.discountPaise) ? src.discountPaise : NaN;

  if (!Number.isSafeInteger(basePaise) || basePaise < 0) errors.basePaise = 'Base price must be a non-negative whole number of paise.';
  if (!Number.isInteger(gstPct) || gstPct < 0 || gstPct > 100) errors.gstPct = 'GST must be a whole percent between 0 and 100.';
  if (!Number.isSafeInteger(discountPaise) || discountPaise < 0) errors.discountPaise = 'Discount must be a non-negative whole number of paise.';
  if (Number.isSafeInteger(basePaise) && Number.isSafeInteger(discountPaise) && discountPaise > basePaise + Math.round((basePaise * (Number.isInteger(gstPct) ? gstPct : 0)) / 100)) {
    errors.discountPaise = 'Discount cannot exceed the pre-discount total (base + GST).';
  }

  // payablePaise, when supplied, must equal the derivation — the admin UI computes and
  // sends it, and a mismatch means the UI and the server disagree about the money.
  const payablePaise =
    Number.isSafeInteger(basePaise) && Number.isInteger(gstPct) && Number.isSafeInteger(discountPaise)
      ? computePayablePaise(basePaise, gstPct, discountPaise)
      : NaN;
  const suppliedPayable = typeof src.payablePaise === 'number' ? src.payablePaise : payablePaise;
  if (Number.isFinite(payablePaise) && suppliedPayable !== payablePaise) {
    errors.payablePaise = 'Payable must equal base + GST − discount.';
  }
  if (priceStatus === 'unpriced' && (basePaise !== 0 || gstPct !== 0 || discountPaise !== 0)) {
    errors.priceStatus = 'Unpriced items must have zero base, GST and discount.';
  }

  const pairsWith = Array.isArray(src.pairsWith) ? src.pairsWith.filter((x): x is string => typeof x === 'string') : [];
  if (pairsWith.some((s) => s === slug)) errors.pairsWith = 'An item cannot be paired with itself.';
  if (pairsWith.some((s) => knownSlugs.size > 0 && !knownSlugs.has(s))) {
    errors.pairsWith = 'pairsWith references a slug that does not exist.';
  }
  const addonSlugs = Array.isArray(src.addonSlugs) ? src.addonSlugs.filter((x): x is string => typeof x === 'string') : [];
  const moduleSlugs = Array.isArray(src.moduleSlugs) ? src.moduleSlugs.filter((x): x is string => typeof x === 'string') : [];

  const validity = typeof src.validity === 'string' ? src.validity.trim() || undefined : undefined;
  const discountLabel = typeof src.discountLabel === 'string' ? src.discountLabel.trim() || undefined : undefined;
  if (discountLabel && discountLabel.length > 20) errors.discountLabel = 'Discount label must be 20 characters or fewer.';

  const sortOrder = typeof src.sortOrder === 'number' && Number.isInteger(src.sortOrder) && src.sortOrder >= 0 ? src.sortOrder : 0;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const value: PriceItem = {
    slug,
    name,
    category,
    validity,
    basePaise,
    gstPct,
    discountPaise,
    payablePaise: Number.isFinite(payablePaise) ? payablePaise : 0,
    pairsWith,
    addonSlugs,
    moduleSlugs,
    priceStatus: priceStatus as PriceStatus,
    discountLabel,
    sortOrder,
    updatedAt: new Date().toISOString(),
  };
  return { ok: true, errors, value };
}