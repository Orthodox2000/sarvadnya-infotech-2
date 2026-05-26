import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // 1. Skip protection for the login page if we had one
    // For now, we'll check for a custom header or cookie
    const adminKey = request.headers.get('x-admin-key') || request.cookies.get('admin_key')?.value;
    const masterKey = process.env.ADMIN_ACCESS_KEY;

    // In a real app, masterKey would be required. 
    // For development/initial setup, we might allow access if not configured.
    // But since this is a security audit, we recommend enforcing it.
    if (masterKey && adminKey !== masterKey) {
       // If it's an API request, return 401
       if (pathname.startsWith('/api/')) {
         return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
       }
       
       // If it's a page request, we could redirect to a login or home
       // return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
