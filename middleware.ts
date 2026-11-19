import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Origins allowed to call the public API routes from another host.
// The cPanel-hosted static frontend origin goes here at deploy time, e.g.
// FRONTEND_ALLOWED_ORIGINS=https://sarvadnya.in,https://www.sarvadnyainfotech.com
const FRONTEND_ALLOWED_ORIGINS = ('https://en.sarvadnyainfotech.com')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Same-site default so the Vercel deployment can always call itself.
// CHANGE: 2026-08-27 — added new canonical domain (+ www) for /api/* CORS; kept .vercel.app.
const DEFAULT_ALLOWED_ORIGINS = [
  'https://sarvadnya-infotech.vercel.app',
  'https://sarvadnyainfotech.com',
  'https://www.sarvadnyainfotech.com',
];

const ALLOWED_ORIGINS = new Set([...DEFAULT_ALLOWED_ORIGINS, ...FRONTEND_ALLOWED_ORIGINS]);

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Headers': 'Content-Type, x-request-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Localhost is allowed for local preview testing of the static export
// (e.g. `npx serve out`). Any port counts as local.
function isLocalhost(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

// CHANGE: 2026-09-07 — canonicalize www → apex (SITE_URL is the bare domain) so Google indexes one host.
const CANONICAL_HOST = 'sarvadnyainfotech.com';
const WWW_HOST = 'www.sarvadnyainfotech.com';

// CHANGE: 2026-09-16 — Deleted old-WordPress/WooCommerce URLs: 410 Gone so Google stops crawling them
// (consumes crawl budget and inflates the GSC "Pages to index" count vs the real 54 pages).
// CHANGE: 2026-09-17 — audit additions: WP default junk (hello-world/sample-blog), the
// default /category/ archive prefix, and any /YYYY/…/ dated post URL (permalink structure was
// /%year%/%monthnum%/%day%/%postname%/) → all 410.
const GONE_PATHS = new Set([
  '/shop/bumper+stickers', '/shop/gallery-boards', '/shop/framed-prints',
  '/shop/all-mouse-pads', '/shop/cool+stickers',
  '/product', '/product/', '/feed', '/feed/', '/automobile-industries', '/automobile-industries/',
  '/author/admin/feed', '/author/admin/feed/',
  '/hello-world', '/hello-world/', '/sample-blog', '/sample-blog/',
  '/category/uncategorized', '/category/uncategorized/',
]);
// CHANGE: 2026-10-27 — `/author/` added: Search Console still lists `/author/admin/` (a
// WordPress author-archive artifact; it redirected to a 404 because nothing matches it here).
// Any /author/* URL is WP noise on this stack, so 410 is the correct answer rather than a redirect.
const GONE_PREFIXES = ['/wp-includes/', '/wp-content/', '/wp-admin/', '/wp-json/', '/2021/', '/category/', '/author/'];

// CHANGE: 2026-09-17 — any dated WordPress post URL starts with /YYYY/ (e.g. /2021/02/…).
const DATED_POST_RE = /\/\d{4}\//;

// CHANGE: 2026-10-06 — SP-4 security hardening: this deployment is the public frontend
// and has NO admin surface (app/admin + app/api/admin were removed; two stray admin
// routes added in error by 1112177 were deleted the same day). Segment-exact check so
// any future stray /admin or /api/admin route 404s instead of shipping unauthenticated —
// proxy.ts's full guard is dormant (Next 15 reads this file, AGENTS §10) and the admin
// panel lives in sarvadnya-advanced behind ITS own guard. Segment-exact (not prefix):
// '/administrator' and '/api/administrator' are legit public paths and must pass.
function isAdminPath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/api/admin' ||
    pathname.startsWith('/api/admin/')
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // CHANGE: 2026-10-06 — SP-4 admin block runs first: 404, not 401/403 — the surface
  // must look absent rather than "protected".
  if (isAdminPath(pathname)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 404 });
  }

  // CHANGE: 2026-09-16 — dead legacy-WordPress artifacts return 410 before any redirect/CORS logic.
  if (
    GONE_PATHS.has(pathname) ||
    GONE_PREFIXES.some((p) => pathname.startsWith(p)) ||
    DATED_POST_RE.test(pathname) ||
    (pathname === '/' && request.nextUrl.searchParams.has('et_core_page_resource'))
  ) {
    return new NextResponse(null, { status: 410 });
  }

  if (request.nextUrl.hostname === WWW_HOST && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL(pathname + search, `https://${CANONICAL_HOST}`), 301);
  }

  // CHANGE: 2026-09-22 — retire the legacy /modules?id=* deep-link URL. All internal links now use
  // /modules#fragment anchors and the page ignores the `id` param, so 301ing Googlebot's old ?id=
  // crawl to the clean URL stops /modules?id=… from being re-recorded as an
  // "Alternative page with proper canonical tag". Other params (utm_*, et_core_page_resource) are
  // preserved so campaign attribution is untouched.
  if (pathname === '/modules' && request.nextUrl.searchParams.has('id')) {
    return NextResponse.redirect(new URL(pathname, request.nextUrl.origin), 301);
  }

  const origin = request.headers.get('origin');
  const allowed = origin !== null && (ALLOWED_ORIGINS.has(origin) || isLocalhost(origin));

  if (request.method === 'OPTIONS') {
    const headers: Record<string, string> = { ...CORS_HEADERS, Vary: 'Origin' };
    if (allowed && origin) headers['Access-Control-Allow-Origin'] = origin;
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  if (allowed && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }
  return response;
}

// CHANGE: 2026-11-19 — VERCEL FLUID CPU / EDGE COST FIX.
// WHY: the old catch-all `'/((?!_next/static|_next/image|favicon\\.ico).*)'` invoked this
// Edge middleware for EVERY request that was not an _next static/image file — including
// every logo, hero PNG, 4 MB team video, brochure PDF, font and llms.txt in /public,
// plus every other _next/* request. Middleware is the only Edge function in this repo
// (all 11 API routes that need it are explicitly `runtime = 'nodejs'`, and Next 15's
// remaining default IS nodejs; `proxy.ts` is inert — Next 15.5.29 has only
// MIDDLEWARE_FILENAME, verified in node_modules/next/dist/lib/constants.js). Every one
// of those asset hits was billed as Fluid CPU in iad1 for logic that can only ever
// apply to documents and /api routes.
// FIX: exclude all _next/* internals, favicon and any path ending in a real static
// file extension. The extension list is explicit (not `.*\.[a-z0-9]+$`) so document
// slugs that legitimately contain a dot — e.g. /news/tallyprime-7.2 — still pass
// through and keep getting the www 301 / legacy 410 / admin 404 behaviour.
// NOTE: a spot check must still include '/', '/api/*', '/admin', '/news/tallyprime-7.2',
// '/housing society.png' (excluded), '/videos/team-diwali-2026.mp4' (excluded).
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/|favicon\\.ico|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mov|m4v|ogv|pdf|css|js|mjs|map|txt|html|json|xml|csv)$).*)',
  ],
};
