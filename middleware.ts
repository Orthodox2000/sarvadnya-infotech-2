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

export function middleware(request: NextRequest) {
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
  matcher: ['/api/:path*'],
};
