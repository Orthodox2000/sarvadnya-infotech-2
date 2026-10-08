// CHANGE: 2026-10-08 — shared per-IP rate limiter for public write routes.
// WHY: /api/tss-renewal, /api/problem-reports and /api/upload/chunk had NO per-IP limit
// while every other public write route (email/submit, contact, cart/order…) carried one —
// they save to the production DB, send real Resend emails and write blobs respectively.
// Implementation moved verbatim from lib/cart/rate-limit.ts (same fixed-window map pattern
// the email/demo/cart routes all use) so every write route shares ONE code path and the
// cart routes cannot drift from the rest — lib/cart/rate-limit.ts now re-exports from here.
//
// IMPORTANT: comments in this file must stay `//`-style — the demo-independence guard
// strips line comments before matching, but keep prose clear of route literals anyway.

export interface RateLimitResult {
  limited: boolean;
  /** Seconds until the window resets; 0 when not limited. */
  retryAfter: number;
}

export interface RateLimiter {
  check(ip: string): RateLimitResult;
  /** Exposed for tests to observe/inspect state. */
  size(): number;
}

/**
 * Fixed-window limiter: `limit` requests per `windowMs` per distinct key (raw IP).
 * Memory-bounded: stale entries are evicted opportunistically when the map grows large.
 */
export function createRateLimiter(limit: number, windowMs: number, maxEntries = 5000): RateLimiter {
  const map = new Map<string, { count: number; resetAt: number }>();

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      const entry = map.get(ip);
      if (entry && now < entry.resetAt) {
        entry.count++;
        if (entry.count > limit) {
          return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
        }
      } else {
        map.set(ip, { count: 1, resetAt: now + windowMs });
      }
      if (map.size > maxEntries) {
        for (const [key, val] of map) if (val.resetAt < now) map.delete(key);
      }
      return { limited: false, retryAfter: 0 };
    },
    size(): number {
      return map.size;
    },
  };
}
