import { NextResponse } from 'next/server';
import { getCurrentCareersUser } from '@/lib/careers-auth';

export async function GET() {
  const user = await getCurrentCareersUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
