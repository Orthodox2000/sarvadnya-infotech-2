import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;

function base64Decode(str: string): string {
  try { return Buffer.from(str, 'base64url').toString('utf-8'); } catch { return ''; }
}

function verifyAdminToken(token: string): boolean {
  try {
    const masterKey = process.env.ADMIN_ACCESS_KEY;
    if (!masterKey) return false;
    const payload = JSON.parse(base64Decode(token));
    return payload.s === masterKey && Date.now() - payload.t < 86400000;
  } catch { return false; }
}

function isAdminRequest(request: NextRequest): boolean {
  const masterKey = process.env.ADMIN_ACCESS_KEY;
  if (!masterKey) return true;

  const headerKey = request.headers.get('x-admin-key');
  if (headerKey === masterKey) return true;

  const cookieKey = request.cookies.get('admin_key')?.value;
  if (cookieKey === masterKey) return true;

  const token = request.cookies.get('__admin_token')?.value;
  if (token && verifyAdminToken(token)) return true;

  return false;
}

export function proxy(request: NextRequest) {
  const start = performance.now();
  const { pathname } = request.nextUrl;

  // --- Admin route protection ---
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!isAdminRequest(request)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } });
      }
      // For page routes, redirect to login (or let the page handle it)
    }
  }

  const response = NextResponse.next();

  // --- Security Headers ---
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // --- Rate limiting for non-admin API routes ---
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'anonymous';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry && now < entry.resetAt) {
      entry.count++;
      if (entry.count > RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Too many requests, please slow down.' },
          { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
        );
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    }

    // Cleanup stale entries
    if (rateLimitMap.size > 1000) {
      const threshold = Date.now();
      for (const [key, val] of rateLimitMap) {
        if (val.resetAt < threshold) rateLimitMap.delete(key);
      }
    }
  }

  // --- Content-Type validation for write API operations ---
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 });
    }
  }

  // Response time header
  response.headers.set('X-Response-Time', `${(performance.now() - start).toFixed(1)}ms`);

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/:path*'],
};
