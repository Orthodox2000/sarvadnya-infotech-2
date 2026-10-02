// CHANGE: 2026-10-02 — INR / paise formatting for the real site cart (SP-1 cart build).
// WHY: every value in the cart domain is INTEGER PAISE, but people read rupees. This mirrors
// lib/demo/format.ts (en-IN, Intl.NumberFormat) with the addition of the plain whole-rupee
// format the pricing pages use ("22,500", not "₹18,000.00").
//
// IMPORTANT: this file must never contain the literal "/demo" — the demo-independence guard
// (scripts/check-demo-independence.mjs) scans lib/ for it.

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INR_WHOLE = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const PLAIN = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** Format integer paise as rupees, e.g. 1800000 → "₹18,000.00". */
export function formatINR(paise: number): string {
  if (!Number.isFinite(paise)) return INR.format(0);
  return INR.format(Math.round(paise) / 100);
}

/** Whole-rupee format for compact chrome (cart badge totals). e.g. "₹18,000". */
export function formatINRWhole(paise: number): string {
  if (!Number.isFinite(paise)) return INR_WHOLE.format(0);
  return INR_WHOLE.format(Math.round(paise) / 100);
}

/** Plain en-IN number without a symbol: 2655000 → "26,550". Shows paise only when nonzero. */
export function formatPlain(paise: number): string {
  if (!Number.isFinite(paise)) return '0';
  return PLAIN.format(Math.round(paise) / 100);
}

/** Page-style "26,550/-". */
export function formatPlainSlash(paise: number): string {
  return `${formatPlain(paise)}/-`;
}

/** Delta display for a discounted line: "+ ₹X,XXX" for GST, "− ₹X,XXX" for discounts. */
export function formatSigned(paise: number, plus = false): string {
  if (paise === 0) return formatINR(0);
  const sign = paise < 0 ? '− ' : plus ? '+ ' : '− ';
  return `${sign}${formatINR(Math.abs(paise))}`;
}