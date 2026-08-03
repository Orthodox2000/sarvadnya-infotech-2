import { NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/email-queue';
import { isRequestAuthorized } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function handle(request: Request) {
  // Defense-in-depth: the proxy normally guards /api/admin, but the send path
  // re-verifies credentials so a misconfigured proxy can never trigger emails.
  if (!isRequestAuthorized(request)) {
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
