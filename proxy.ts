import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;

export function proxy(request: NextRequest) {
  const start = performance.now();
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminKey = request.headers.get('x-admin-key') || request.cookies.get('admin_key')?.value;
    const masterKey = process.env.ADMIN_ACCESS_KEY;
    if (masterKey && adminKey !== masterKey) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
      }
    }
  }

  const response = NextResponse.next();

  // Rate limiting for API routes
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

    if (rateLimitMap.size > 1000) {
      const threshold = Date.now();
      for (const [key, val] of rateLimitMap) {
        if (val.resetAt < threshold) rateLimitMap.delete(key);
      }
    }
  }

  // Cache headers for GET API routes
  // if (pathname.startsWith('/api/') && request.method === 'GET') {
  //   response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  // }

  // Response time header
  response.headers.set('X-Response-Time', `${(performance.now() - start).toFixed(1)}ms`);

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/:path*'],
};
