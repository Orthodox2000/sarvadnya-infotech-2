// CHANGE: 2026-10-02 — pure cart maths for the /demo cart scaffold (SP-1).
// WHY: client-side totals are attacker-controlled, so the pricing rules must be
// unit-testable with plain `node` and reusable by the server route WITHOUT importing any
// client code. This file therefore has NO React, NO IO and NO `process.env` — it is pure.
//
// Money is INTEGER PAISE everywhere. Never a float in rupees: 0.1 + 0.2 is a real class of
// payment bug, and Razorpay's Orders API takes paise anyway.
//
// Every function is IMMUTABLE (returns a new array) so it can back React state directly,
// and every function is DEFENSIVE about its inputs: `items` arrives from `localStorage` and
// `order/route.ts` receives a JSON body, so ids can be junk and quantities can be anything.

import { getProduct, type CatalogProduct } from './catalog.ts';

/** Upper bound on a single line's quantity. Stops a tampered localStorage qty of 1e9
 *  from producing a nonsense order amount. Deliberate addition beyond the plan spec. */
export const MAX_QTY = 99;

export interface CartItem {
  id: string;
  qty: number;
}

export interface CartLine {
  id: string;
  product: CatalogProduct;
  qty: number;
  /** Integer paise. */
  unitPaise: number;
  taxPct: number;
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
}

export interface CartTotals {
  lines: CartLine[];
  /** Integer paise. */
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
  /** Total UNITS across all lines (not the number of distinct lines) — what a cart badge shows. */
  itemCount: number;
}

/** Coerce anything into a usable quantity: integer, 1..MAX_QTY. Junk becomes 1. */
export function sanitizeQty(qty: unknown): number {
  const n = typeof qty === 'number' ? qty : Number(qty);
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(n)));
}

/** Normalise an unknown `items` value into a clean CartItem[], dropping unknown ids.
 *  Used at every entry point so no downstream code has to re-check. */
export function sanitizeItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  const out: CartItem[] = [];
  const seen = new Set<string>();
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue;
    const id = (raw as { id?: unknown }).id;
    if (typeof id !== 'string') continue;
    if (!getProduct(id)) continue; // unknown id: dropped, never priced
    if (seen.has(id)) continue; // duplicate rows collapse; addItem increments instead
    seen.add(id);
    out.push({ id, qty: sanitizeQty((raw as { qty?: unknown }).qty) });
  }
  return out;
}

/** Add `qty` of `id`. Increments an existing row rather than adding a duplicate.
 *  Unknown ids are dropped (cart unchanged). */
export function addItem(items: CartItem[], id: string, qty = 1): CartItem[] {
  if (!getProduct(id)) return sanitizeItems(items);
  const clean = sanitizeItems(items);
  const existing = clean.find((i) => i.id === id);
  if (!existing) return [...clean, { id, qty: sanitizeQty(qty) }];
  return clean.map((i) => (i.id === id ? { ...i, qty: sanitizeQty(i.qty + sanitizeQty(qty)) } : i));
}

/** Set an absolute quantity. Clamped to 1..MAX_QTY. Use removeItem to delete a line. */
export function setQty(items: CartItem[], id: string, qty: number): CartItem[] {
  const clean = sanitizeItems(items);
  if (!getProduct(id)) return clean;
  return clean.map((i) => (i.id === id ? { ...i, qty: sanitizeQty(qty) } : i));
}

/** Remove a line entirely. */
export function removeItem(items: CartItem[], id: string): CartItem[] {
  return sanitizeItems(items).filter((i) => i.id !== id);
}

/** Reset to an empty cart. */
export function clearCart(): CartItem[] {
  return [];
}

/** GST on a line, rounded HALF UP to whole paise.
 *  `subtotalPaise * taxPct` stays well inside Number.MAX_SAFE_INTEGER (an ₹18,000 line at
 *  18% is 32,400,000), so this division is exact enough that rounding is the only loss. */
function taxFor(subtotalPaise: number, taxPct: number): number {
  if (taxPct <= 0) return 0;
  return Math.round((subtotalPaise * taxPct) / 100);
}

/**
 * Resolve items against the catalog and derive every total.
 *
 * This is the SERVER-AUTHORITATIVE calculation: the order route calls it with the client's
 * ids+quantities and IGNORES any amount the client sent. Unknown ids are dropped, so a
 * client cannot invent a price by inventing an id.
 */
export function computeTotals(items: unknown): CartTotals {
  const clean = sanitizeItems(items);
  const lines: CartLine[] = [];
  let subtotalPaise = 0;
  let taxPaise = 0;
  let itemCount = 0;

  for (const item of clean) {
    const product = getProduct(item.id);
    if (!product) continue; // belt-and-braces; sanitizeItems already dropped these
    const unitPaise = Math.round(product.pricePaise);
    const lineSubtotal = unitPaise * item.qty;
    const lineTax = taxFor(lineSubtotal, product.taxPct);
    lines.push({
      id: item.id,
      product,
      qty: item.qty,
      unitPaise,
      taxPct: product.taxPct,
      subtotalPaise: lineSubtotal,
      taxPaise: lineTax,
      totalPaise: lineSubtotal + lineTax,
    });
    subtotalPaise += lineSubtotal;
    taxPaise += lineTax;
    itemCount += item.qty;
  }

  return { lines, subtotalPaise, taxPaise, totalPaise: subtotalPaise + taxPaise, itemCount };
}