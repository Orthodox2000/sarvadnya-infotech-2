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
const GONE_PREFIXES = ['/wp-includes/', '/wp-content/', '/wp-admin/', '/wp-json/', '/2021/', '/category/'];

// CHANGE: 2026-09-17 — any dated WordPress post URL starts with /YYYY/ (e.g. /2021/02/…).
const DATED_POST_RE = /\/\d{4}\//;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
};
