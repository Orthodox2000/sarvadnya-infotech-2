import { NextResponse } from 'next/server';
import { clearCareersSession } from '@/lib/careers-auth';

export async function POST() {
  await clearCareersSession();
  return NextResponse.json({ success: true });
}
