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
// CHANGE: 2026-11-25 — HIGH-TRAFFIC / HANDS-OFF WINDOW. The owner will not be editing content
// for several weeks, so all public read APIs now use a 6-hour shared cache (was 1 hour) with
// a 24-hour stale-while-revalidate tail. This is the single biggest lever against Fluid Active
// CPU: cached hits are served at the edge with 0 ms function CPU. After the hands-off window,
// restore the 1-hour value if fast admin propagation is needed again.
export const PUBLIC_API_CACHE = 'public, s-maxage=21600, stale-while-revalidate=86400';

// CHANGE: 2026-11-24 — modules change rarely; give them a longer shared-cache window to cut CPU.
// 6 hours is the default freshness target; stale-while-revalidate keeps responses fast during
// refresh. Manual/admin updates must call POST /api/revalidate (REVALIDATE_SECRET) to invalidate
// the 'modules' tag and module paths immediately.
export const PUBLIC_MODULES_API_CACHE = 'public, s-maxage=86400, stale-while-revalidate=86400';

// CHANGE: 2026-11-25 — /api/tutorials was 23 invocations / 3.4 s Active CPU in the 7-day
// Vercel report because it was the one public read API with NO cache (0% hit) and three
// client components fetched it on mount. The client fetches are now gated on Sara opening.
// TTL was 5 minutes to respect the 2026-11-21 "admin video looked absent" complaint, but the
// owner has confirmed NO content updates for several weeks, so it is now 6 hours to match the
// other public feeds. Restore 300 s when frequent admin edits resume.
export const PUBLIC_TUTORIALS_API_CACHE = 'public, s-maxage=21600, stale-while-revalidate=86400';

// CHANGE: 2026-11-26 — /api/social-links backs the copy/paste email templates.
// Short freshness on purpose: an admin social-link edit must show up in the next
// copy within ~5 minutes, while repeat hits still cost 0 ms at the edge. Keep in
// sync with next.config.js PUBLIC_SOCIAL_LINKS_API_CACHE.
export const PUBLIC_SOCIAL_LINKS_API_CACHE = 'public, s-maxage=300, stale-while-revalidate=86400';
