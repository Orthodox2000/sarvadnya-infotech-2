// CHANGE: 2026-10-09 — Defensive Date coercion.
//
// The production DB was re-imported from a JSON dump (commits 54ae9c3 / b81bc6f)
// that serialised BSON Dates as ISO *strings*. Code that assumed a real `Date`
// and called `.getTime()` on a stored value then threw, e.g.:
//
//   TypeError: c.expireAt.getTime is not a function
//     at lib/visitors.ts:389 (lookupGeo) -> /api/identify
//
// `toDateMs` accepts Date | number | string (or anything else) and always returns
// a number or NaN — so a legacy/malformed value can never crash a route again.
// Dependency-free (no Mongo/React/next) so plain `node` can test it.
export function toDateMs(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'string') {
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : NaN;
  }
  return NaN;
}
