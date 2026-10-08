import { NextResponse } from 'next/server';
import { handleChunkedUpload } from '@/lib/chunkUpload';
// CHANGE: 2026-10-08 — per-IP rate limit. This is the public (unauthenticated) blob
// upload endpoint used by the career resume flow — a limiter caps storage/CPU abuse
// the same way every other public write route already does. Window is generous
// (60/min default) because one large file legitimately sends many sequential chunks.
import { createRateLimiter } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/visitors';

export const runtime = 'nodejs';
export const maxDuration = 60;

const rateLimiter = createRateLimiter(Number(process.env.UPLOAD_RATE_LIMIT || 60), 60_000);

export async function POST(request: Request) {
  const limit = rateLimiter.check(getClientIp(request));
  if (limit.limited) {
    return NextResponse.json(
      { error: 'Too many requests, please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }
  return handleChunkedUpload(request);
}
