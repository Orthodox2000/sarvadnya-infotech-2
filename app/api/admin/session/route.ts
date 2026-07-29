import { NextResponse } from 'next/server';
import { verifySessionFromCookie } from '@/lib/admin-auth';

export async function GET() {
  try {
    const isAuthenticated = await verifySessionFromCookie();
    if (isAuthenticated) {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
