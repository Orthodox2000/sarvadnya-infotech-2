// CHANGE: 2026-10-08 — implementation moved to @/lib/rate-limit (shared with the
// tss-renewal, problem-reports and upload/chunk write routes) so the cart routes and the
// rest of the public write surface use ONE limiter implementation. Re-exported here so
// existing `@/lib/cart/rate-limit` imports keep working unchanged.

export { createRateLimiter } from '../rate-limit';
export type { RateLimiter, RateLimitResult } from '../rate-limit';
