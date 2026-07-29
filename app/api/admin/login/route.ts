import { NextResponse } from 'next/server';
import { validateCredentials, createToken, setSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = createToken();
    await setSessionCookie(token);
    return NextResponse.json({ success: true, message: 'Logged in' });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
