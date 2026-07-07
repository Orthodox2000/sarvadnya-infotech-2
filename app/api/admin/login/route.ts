import { NextResponse } from 'next/server';
import { validateCredentials, createSession, setSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const sessionId = createSession();
    await setSessionCookie(sessionId);
    return NextResponse.json({ success: true, message: 'Logged in', sessionId });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
