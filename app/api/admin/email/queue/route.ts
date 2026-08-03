import { NextResponse } from 'next/server';
import { getEmailQueueStats, getRecentEmailJobs } from '@/lib/email-queue';
import { isRequestAuthorized } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized Access' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const [stats, recent] = await Promise.all([getEmailQueueStats(), getRecentEmailJobs(12)]);
    return NextResponse.json(
      { stats, recent },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('Email queue stats error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
