// CHANGE: 2026-10-02 — pure cart maths for the real site cart (SP-1 cart build).
// WHY: client-side totals are attacker-controlled, so the pricing rules must be unit-testable
// with plain `node` AND reusable by the server route (app/api/cart/order/route.ts) WITHOUT
// importing any client code. No React, no IO, no `process.env` here — it is pure, exactly like
// its sibling lib/demo/cart.ts.
//
// DIFFERENCE FROM THE CARTS THAT CAME BEFORE: prices live in MongoDB (editable from the admin
// panel, nested repo), so the math takes a `known: ReadonlyMap<string, PriceItem>` resolver
// instead of importing a static catalogue. The caller decides which items exist and what they
// cost — the order route builds that map from the LIVE prices collection, the browser builds
// it from GET /api/prices.
//
// Money is INTEGER PAISE everywhere (see lib/demo/cart.ts for why pushing floats is the real
// class of payment bug). Every function is IMMUTABLE and DEFENSIVE: items arrive from
// localStorage and JSON bodies, so quantities can be junk and slugs can be invented.
//
// IMPORTANT: no "/demo" literal — the demo-independence guard scans lib/.

import type { PriceItem } from '../prices-catalog.mjs';

/** Upper bound on a single line's quantity. Stops a tampered localStorage qty of 1e9. */
export const MAX_QTY = 99;

/** Maximum distinct lines an order may carry (order routes reject beyond this). */
export const MAX_CART_LINES = 50;

export interface CartItem {
  /** A price-catalogue slug, e.g. "tallyprime-silver". */
  slug: string;
  qty: number;
}

export interface CartLine {
  slug: string;
  item: PriceItem;
  qty: number;
  /** What one unit costs to pay (payablePaise). */
  unitPaise: number;
  /** Line "Base" = basePaise × qty (pre-GST, pre-discount). */
  subtotalPaise: number;
  gstPaise: number;
  discountPaise: number;
  /** What the customer actually pays for the line = payablePaise × qty. */
  totalPaise: number;
}

export interface CartTotals {
  lines: CartLine[];
  /** Σ base × qty. */
  subtotalPaise: number;
  /** Σ line GST. */
  gstPaise: number;
  /** Σ line discounts. Shown as a deduction, may be 0. */
  discountPaise: number;
  /** charged to Razorpay = subtotal + gst − discount. */
  totalPaise: number;
  /** Total UNITS across all lines (what the cart badge shows). */
  itemCount: number;
}

/** Coerce anything into a usable quantity: integer, 1..MAX_QTY. Junk becomes 1. */
export function sanitizeQty(qty: unknown): number {
  const n = typeof qty === 'number' ? qty : Number(qty);
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(n)));
}

/** Normalise an unknown `items` value into a clean CartItem[], dropping duplicates and any
 *  slug that is not present in `known`. Used at every entry point. */
export function sanitizeItems(items: unknown, known: ReadonlyMap<string, PriceItem>): CartItem[] {
  if (!Array.isArray(items)) return [];
  const out: CartItem[] = [];
  const seen = new Set<string>();
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue;
    const slug = (raw as { slug?: unknown }).slug;
    if (typeof slug !== 'string') continue;
    if (!known.has(slug)) continue; // unknown slug: dropped, never priced
    if (seen.has(slug)) continue; // duplicate rows collapse; addItem increments instead
    seen.add(slug);
    out.push({ slug, qty: sanitizeQty((raw as { qty?: unknown }).qty) });
  }
  return out;
}

/** Add `qty` of a slug. Increments an existing row rather than duplicating. */
export function addItem(items: CartItem[], slug: string, qty = 1, known: ReadonlyMap<string, PriceItem>): CartItem[] {
  if (!known.has(slug)) return sanitizeItems(items, known);
  const clean = sanitizeItems(items, known);
  const existing = clean.find((i) => i.slug === slug);
  if (!existing) return [...clean, { slug, qty: sanitizeQty(qty) }];
  return clean.map((i) => (i.slug === slug ? { ...i, qty: sanitizeQty(i.qty + sanitizeQty(qty)) } : i));
}

/** Set an absolute quantity. Clamped to 1..MAX_QTY. Use removeItem to delete a line. */
export function setQty(items: CartItem[], slug: string, qty: number, known: ReadonlyMap<string, PriceItem>): CartItem[] {
  const clean = sanitizeItems(items, known);
  if (!known.has(slug)) return clean;
  return clean.map((i) => (i.slug === slug ? { ...i, qty: sanitizeQty(qty) } : i));
}

/** Remove a line entirely. */
export function removeItem(items: CartItem[], slug: string, known: ReadonlyMap<string, PriceItem>): CartItem[] {
  return sanitizeItems(items, known).filter((i) => i.slug !== slug);
}

/** Reset to an empty cart. */
export function clearCart(): CartItem[] {
  return [];
}

/** GST on a line, rounded HALF UP to whole paise — the site's 18% rows never drift by a paisa. */
function taxFor(subtotalPaise: number, taxPct: number): number {
  if (taxPct <= 0) return 0;
  return Math.round((subtotalPaise * taxPct) / 100);
}

/** Only sellable rows are priced; unpriced (modules) / inactive lines are excluded entirely. */
function isSellableForTotals(item: PriceItem): boolean {
  return item.priceStatus === 'priced' && item.payablePaise > 0;
}

/**
 * Resolve items against a price map and derive every total.
 *
 * SERVER-AUTHORITATIVE: app/api/cart/order calls this with the client's slugs+quantities and
 * IGNORES any money the client sent. Non-sellable slugs are dropped from the totals, so a
 * module can never be charged for or sneak a ₹0 line into a money total.
 */
export function computeTotals(items: unknown, known: ReadonlyMap<string, PriceItem>): CartTotals {
  const clean = sanitizeItems(items, known);
  const lines: CartLine[] = [];
  let subtotalPaise = 0;
  let gstPaise = 0;
  let discountPaise = 0;
  let itemCount = 0;

  for (const item of clean) {
    const price = known.get(item.slug);
    if (!price || !isSellableForTotals(price)) continue;
    const unitPaise = Math.round(price.payablePaise);
    const lineSubtotal = price.basePaise * item.qty;
    const lineGst = taxFor(lineSubtotal, price.gstPct);
    const lineDiscount = Math.min(price.discountPaise, price.basePaise + lineGst) * item.qty;
    const lineTotal = unitPaise * item.qty;
    lines.push({
      slug: item.slug,
      item: price,
      qty: item.qty,
      unitPaise,
      subtotalPaise: lineSubtotal,
      gstPaise: lineGst,
      discountPaise: lineDiscount,
      totalPaise: lineTotal,
    });
    subtotalPaise += lineSubtotal;
    gstPaise += lineGst;
    discountPaise += lineDiscount;
    itemCount += item.qty;
  }

  return { lines, subtotalPaise, gstPaise, discountPaise, totalPaise: subtotalPaise + gstPaise - discountPaise, itemCount };
}

/** Build a slug → PriceItem map from a list (last doc wins). */
export function toPriceMap(prices: readonly PriceItem[]): ReadonlyMap<string, PriceItem> {
  const map = new Map<string, PriceItem>();
  for (const p of prices) map.set(p.slug, p);
  return map;
}