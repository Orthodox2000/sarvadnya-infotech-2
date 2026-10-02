// CHANGE: 2026-10-02 — tiny in-memory rate limiter shared by the cart order + verify routes.
// WHY: both public /api/cart routes must shed load without depending on Redis/Upstash. This
// is the same fixed-window map pattern as the email + demo routes, extracted so the two cart
// routes cannot drift into different rate-limit behaviour.
//
// IMPORTANT: no "/demo" literal — the demo-independence guard scans lib/.

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