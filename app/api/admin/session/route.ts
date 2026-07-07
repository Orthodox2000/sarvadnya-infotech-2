import { NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/admin-auth';

export async function GET() {
  try {
    const sessionId = await getSessionFromCookie();
    if (sessionId) {
      return NextResponse.json({ authenticated: true, sessionId });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
