// CHANGE: 2026-10-02 — INR / paise formatting for the /demo cart scaffold (SP-1).
// WHY: every value in the cart domain is INTEGER PAISE, but people read rupees. Formatting
// lives in one place so the cart UI, the checkout page and the order summary can never
// disagree about what a number looks like. Follows the repo's existing `Intl.NumberFormat`
// + `en-IN` convention (see lib/seo.ts, app/components/JobAccordion.tsx).

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

/** Format integer paise as rupees, e.g. 1800000 → "₹18,000.00". */
export function formatINR(paise: number): string {
  if (!Number.isFinite(paise)) return INR.format(0);
  return INR.format(Math.round(paise) / 100);
}

/**
 * Format a rupee amount that is NOT in paise. Rounds to whole paise first so a float input
 * cannot leak binary-fraction noise ("₹1,799.9999999999998") into the UI.
 */
export function formatINRFromRupees(rupees: number): string {
  if (!Number.isFinite(rupees)) return INR.format(0);
  return formatINR(Math.round(rupees * 100));
}

/** Whole-rupee format for compact chrome (cart badge totals, order list). e.g. "₹18,000". */
export function formatINRWhole(paise: number): string {
  if (!Number.isFinite(paise)) return INR_WHOLE.format(0);
  return INR_WHOLE.format(Math.round(paise) / 100);
}