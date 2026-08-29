import { NextResponse } from 'next/server';
import { saveSubmission } from '@/lib/mongodb-utils';
import { isValidEmail } from '@/lib/email';
import { sendEmailDirect } from '@/lib/email-queue';
import { getDestinationFromPath } from '@/lib/form-destinations';
import {
  getRequestMeta,
  lookupGeo,
  isValidSessionId,
  markConversion,
  visitorLog,
} from '@/lib/visitors';
import type { GeoInfo } from '@/lib/visitors';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RATE_LIMIT = Number(process.env.EMAIL_RATE_LIMIT || 30);
const RATE_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Basic tag removal
    .trim()
    .substring(0, 2000); // Length limit
}

function sanitizeJobKey(value: unknown): string {
  return String(value || '')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .substring(0, 120);
}

function sanitizeDestination(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 40);
}

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'anonymous'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetAt) {
    entry.count++;
    if (entry.count > RATE_LIMIT) return true;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }

  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  return false;
}

function entryResetAt(ip: string): number {
  return rateLimitMap.get(ip)?.resetAt || Date.now();
}

// Resolve the page destination for a submission. An explicit `destination` in
// the body wins; otherwise the Referer (same-origin form pages send the full
// URL) is mapped through the route → destination table. No match = legacy
// behavior (save only, no email).
function resolveDestination(rawData: any, request: Request): string {
  const explicit = sanitizeDestination(rawData?.destination);
  if (explicit) return explicit;
  try {
    const referer = request.headers.get('referer');
    if (referer) {
      const pathname = new URL(referer).pathname;
      const fromPath = getDestinationFromPath(pathname);
      if (fromPath) return fromPath;
    }
  } catch {
    // ignore unparseable referer
  }
  return '';
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests, please slow down.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((entryResetAt(ip) - Date.now()) / 1000)) } }
    );
  }

  try {
    const rawData = await request.json();

    // Data Sanitization
    const destination = resolveDestination(rawData, request);
    const data = {
      name: sanitize(rawData.name),
      email: sanitize(rawData.email),
      contact: sanitize(rawData.contact),
      service: sanitize(rawData.service),
      formType: sanitize(rawData.formType),
      description: sanitize(rawData.description),
      ...(destination ? { destination } : {}),
    };

    // Basic validation
    if (!data.name || !data.email || !data.contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // CHANGE: 2026-08-18 — Removed GPC gating. Full IP, geo always collected.
    // Passive lead enrichment: capture IP, UA, geo (cache-first) and session id.
    const meta = getRequestMeta(request);
    const sessionId = isValidSessionId(rawData.sessionId) ? String(rawData.sessionId) : '';
    const { geo } = await lookupGeo(meta.ip);
    const submissionData = {
      ...data,
      ip: meta.ip,
      userAgent: meta.userAgent || undefined,
      geo,
      ...(sessionId ? { sessionId } : {}),
    };
    if (sessionId) await markConversion(sessionId);
    visitorLog('debug', 'submission enriched', {
      session: sessionId.slice(0, 8),
      country: geo?.country ?? null,
    });

    // Always persist the submission first so no enquiry is ever lost.
    const result = await saveSubmission(submissionData);
    const submissionId = result.insertedId.toString();

    // No destination (unknown page) → keep the legacy save-only behavior.
    if (!destination) {
      return NextResponse.json({ message: 'Submission successful', saved: true });
    }

    // Per-page routing with exactly-once dedupe: the client supplies a stable
    // requestId per form, so a retried POST re-uses the same jobKey and can
    // never fire a second email. Server fallback is the submission _id.
    const jobKey = sanitizeJobKey(rawData.requestId) || submissionId;
    const send = await sendEmailDirect({
      jobKey,
      formType: data.formType,
      destination,
      // Enquiry forms sometimes submit a phone number as the email field. Keep
      // it in the saved record, but only surface a valid email to the sender
      // (a bad replyTo would otherwise fail the Resend call).
      submission: {
        ...submissionData,
        email: isValidEmail(submissionData.email) ? submissionData.email : '',
      },
    });

    return NextResponse.json({
      message: 'Submission successful',
      ok: true,
      saved: true,
      sent: send.sent,
      deduped: send.deduped,
      jobId: send.jobKey,
    });
  } catch (error) {
    console.error('Submission API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
