import { NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/email-queue';
import { isRequestAuthorized } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Vercel cron jobs do not support custom headers in vercel.json, so the
// scheduler cannot send x-admin-key. Vercel authenticates cron invocations
// with `Authorization: Bearer <CRON_SECRET>`, and always adds the
// `x-vercel-cron-schedule` header + `vercel-cron/*` user-agent. When
// CRON_SECRET is configured it is the hard gate; otherwise the scheduler
// signature is accepted so the drain still runs.
function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    return request.headers.get('authorization') === `Bearer ${cronSecret}`;
  }
  return (
    request.headers.get('x-vercel-cron-schedule') !== null &&
    (request.headers.get('user-agent') || '').startsWith('vercel-cron/')
  );
}

async function handle(request: Request) {
  // Defense-in-depth: the proxy normally guards /api/admin, but the send path
  // re-verifies credentials so a misconfigured proxy can never trigger emails.
  // Accepts the admin session (panel/tests) or a genuine Vercel cron call.
  if (!isRequestAuthorized(request) && !isCronAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized Access' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawBatch = Number(searchParams.get('batch') || '10');
  const batch = Number.isFinite(rawBatch) ? rawBatch : 10;

  try {
    const result = await processEmailQueue({ batch });
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('Email queue process error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
