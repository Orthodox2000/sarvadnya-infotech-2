import { NextResponse, after } from 'next/server';
import { saveSubmission } from '@/lib/mongodb-utils';
import { isValidEmail } from '@/lib/email';
import { enqueueEmailJob, processEmailQueue } from '@/lib/email-queue';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Set EMAIL_DISABLE_BACKGROUND=1 to skip the post-response queue drain
// (used by automated tests for deterministic queue-state assertions).
const BACKGROUND_ENABLED = process.env.EMAIL_DISABLE_BACKGROUND !== '1';

const RATE_LIMIT = Number(process.env.EMAIL_RATE_LIMIT || 30);
const RATE_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 2000);
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
    const destination = sanitizeDestination(rawData.destination);
    const data = {
      name: sanitize(rawData.name),
      email: sanitize(rawData.email),
      contact: sanitize(rawData.contact),
      service: sanitize(rawData.service),
      description: sanitize(rawData.description),
      formType: sanitize(rawData.formType),
      ...(destination ? { destination } : {}),
    };

    // Basic validation
    if (!data.name || !data.email || !data.contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isValidEmail(data.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Always persist the submission first so no enquiry is ever lost
    const result = await saveSubmission(data);
    const submissionId = result.insertedId.toString();

    // Idempotency key: the modal generates one requestId per open, so a retried
    // POST re-uses the same jobKey and can never create a second job → exactly
    // one email per submission. Server fallback is the submission _id.
    const jobKey = sanitizeJobKey(rawData.requestId) || submissionId;

    const enqueued = await enqueueEmailJob({
      jobKey,
      formType: data.formType,
      destination,
      submission: data,
    });

    // Drain the queue in the background after the response is sent. The public
    // route itself never calls Resend synchronously — it only enqueues.
    if (BACKGROUND_ENABLED && enqueued.enqueued) {
      after(async () => {
        try {
          await processEmailQueue({ batch: 10 });
        } catch (err) {
          console.error('Background email queue drain error:', err);
        }
      });
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      queued: enqueued.enqueued,
      jobId: jobKey,
    });
  } catch (err) {
    console.error('Email submit API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
