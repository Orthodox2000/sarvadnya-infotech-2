import { NextResponse } from 'next/server';
import { getSessionFromCookie, destroySession, clearSessionCookie } from '@/lib/admin-auth';

export async function POST() {
  try {
    const sessionId = await getSessionFromCookie();
    if (sessionId) {
      destroySession(sessionId);
    }
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: 'Logged out' });
  } catch {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
