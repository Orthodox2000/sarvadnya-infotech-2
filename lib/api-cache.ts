// CHANGE: 2026-11-20 — single source of truth for public, read-only API CDN caching.
// Vercel's Edge CDN serves repeat hits at 0 ms Active CPU; s-maxage is the shared-cache TTL
// and stale-while-revalidate lets a stale copy answer while the function refreshes it in the
// background. This is duplicated in next.config.js (the global /api/:path* rule sets no-store,
// followed by exact-path allowlist rules that override it) so caching holds regardless of
// which layer wins header precedence.
//
// NEVER apply this to a route that reads cookies/auth, returns user-specific data, or mutates.
// Excluded on purpose: /api/health (live monitoring), /api/email/diagnostic (already no-store),
// /api/auth/*, /api/chats/*, /api/cart/*, /api/identify, /api/careers (root — uses find({}) and
// exposes hidden draft jobs).
export const PUBLIC_API_CACHE = 'public, s-maxage=3600, stale-while-revalidate=86400';

// CHANGE: 2026-11-24 — modules change rarely; give them a longer shared-cache window to cut CPU.
// 6 hours is the default freshness target; stale-while-revalidate keeps responses fast during
// refresh. Manual/admin updates must call POST /api/revalidate (REVALIDATE_SECRET) to invalidate
// the 'modules' tag and module paths immediately.
export const PUBLIC_MODULES_API_CACHE = 'public, s-maxage=21600, stale-while-revalidate=86400';
