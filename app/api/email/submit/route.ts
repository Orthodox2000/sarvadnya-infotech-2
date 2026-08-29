import { NextResponse } from 'next/server';
import { saveSubmission } from '@/lib/mongodb-utils';
import { isValidEmail } from '@/lib/email';
import { sendEmailDirect } from '@/lib/email-queue';
import {
  getRequestMeta,
  lookupGeo,
  isValidSessionId,
  markConversion,
  lookupReverseDns,
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

    // CHANGE: 2026-08-18 — Removed GPC gating. Full IP, geo, UTM always collected.
    // Passive lead enrichment: capture IP, UA, geo (cache-first), UTM params,
    // and the browsing session id so the lead can be tied back to its visitor record.
    const meta = getRequestMeta(request);
    const sessionId = isValidSessionId(rawData.sessionId) ? String(rawData.sessionId) : '';
    const { geo } = await lookupGeo(meta.ip);

    // CHANGE: 2026-08-18 — Capture UTM params passed from client for campaign tracking.
    const utmParams = rawData.utmParams && typeof rawData.utmParams === 'object' ? {
      source: String(rawData.utmParams.source || '').slice(0, 100) || undefined,
      medium: String(rawData.utmParams.medium || '').slice(0, 100) || undefined,
      campaign: String(rawData.utmParams.campaign || '').slice(0, 200) || undefined,
      term: String(rawData.utmParams.term || '').slice(0, 200) || undefined,
      content: String(rawData.utmParams.content || '').slice(0, 200) || undefined,
    } : undefined;

    const submissionData = {
      ...data,
      ip: meta.ip,
      userAgent: meta.userAgent || undefined,
      geo,
      ...(sessionId ? { sessionId } : {}),
      ...(utmParams && Object.keys(utmParams).length > 0 ? { utmParams } : {}),
    };
    if (sessionId) await markConversion(sessionId);
    visitorLog('debug', 'submission enriched', {
      session: sessionId.slice(0, 8),
      country: geo?.country ?? null,
    });

    // Always persist the submission first so no enquiry is ever lost
    const result = await saveSubmission(submissionData);
    const submissionId = result.insertedId.toString();

    // CHANGE: 2026-08-18 — Background reverse DNS lookup (non-blocking, best-effort).
    lookupReverseDns(meta.ip)
      .then((rdns) => {
        if (rdns) {
          const { getDb } = require('@/lib/mongodb-utils');
          getDb().then((db: any) =>
            db.collection('form_submissions').updateOne(
              { _id: result.insertedId },
              { $set: { reverseDns: rdns } }
            )
          ).catch(() => {});
        }
      })
      .catch(() => {});

    // Idempotency key: the modal generates one requestId per open, so a retried
    // POST re-uses the same jobKey and can never fire a second email → exactly
    // one send per submission. Server fallback is the submission _id.
    const jobKey = sanitizeJobKey(rawData.requestId) || submissionId;

    // Send the internal email copy DIRECTLY (inline) on submission. No queue,
    // no cron, no background worker — Vercel's 2-cron/day limit cannot affect
    // delivery. Dedupe is enforced by the unique jobKey claim in the ledger.
    const send = await sendEmailDirect({
      jobKey,
      formType: data.formType,
      destination,
      submission: submissionData,
    });

    return NextResponse.json({
      ok: true,
      saved: true,
      sent: send.sent,
      deduped: send.deduped,
      jobId: jobKey,
    });
  } catch (err) {
    console.error('Email submit API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
