import { NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const adminKey = process.env.ADMIN_ACCESS_KEY;

    if (!adminKey) {
      return NextResponse.json({ error: 'Admin API key not configured on server' }, { status: 500 });
    }

    if (!key || key !== adminKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    await setAdminCookie();
    return NextResponse.json({ success: true, message: 'Admin session set' });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
