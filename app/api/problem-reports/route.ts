import { NextResponse } from 'next/server';
import { saveProblemReport } from '@/lib/mongodb-utils';
import { sendEmailDirect } from '@/lib/email-queue';
import { isValidEmail } from '@/lib/email';
// CHANGE: 2026-10-08 — per-IP rate limit. This route writes to the production
// `problem_reports` collection AND sends a real internal email, but unlike
// /api/email/submit and /api/contact it had no limiter at all.
import { createRateLimiter } from '@/lib/rate-limit';
import {
  getRequestMeta,
  lookupGeo,
  isValidSessionId,
  markConversion,
  isIgnoredRequest,
  visitorLog,
  maskIp,
  getClientIp,
} from '@/lib/visitors';
import type { GeoInfo } from '@/lib/visitors';

const rateLimiter = createRateLimiter(Number(process.env.PROBLEM_REPORT_RATE_LIMIT || 20), 60_000);

const allowedIssueTypes = new Set([
  'broken-link',
  'form-issue',
  'content-mismatch',
  'layout-issue',
  'login-issue',
  'other'
]);

function sanitize(str: string, maxLength = 2000) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().substring(0, maxLength);
}

function normalizeIssueType(value: string) {
  const safeValue = sanitize(value, 80);
  return allowedIssueTypes.has(safeValue) ? safeValue : 'other';
}

export async function POST(request: Request) {
  const limit = rateLimiter.check(getClientIp(request));
  if (limit.limited) {
    return NextResponse.json(
      { error: 'Too many requests, please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }
  try {
    const rawData = await request.json();

    const data = {
      name: sanitize(rawData.name, 120),
      email: sanitize(rawData.email, 160),
      contact: sanitize(rawData.contact, 40),
      pageUrl: sanitize(rawData.pageUrl, 500),
      issueType: normalizeIssueType(rawData.issueType),
      description: sanitize(rawData.description, 4000),
      status: 'open'
    };

    if (!data.name || !data.email || !data.description) {
      return NextResponse.json({ error: 'Name, email, and issue details are required' }, { status: 400 });
    }

    if (!isValidEmail(data.email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // Passive enrichment: IP, UA, geo (cache-first) + browsing session id.
    const meta = getRequestMeta(request);

    // CHANGE: 2026-09-30 — Ignore-list gate. Writes to the PRODUCTION
    // `problem_reports` collection and sends a REAL email. Dev tests otherwise created
    // genuine support-ticket records in prod.
    if (isIgnoredRequest(request)) {
      visitorLog('warn', 'ignored ip — report not saved, no email sent', { ip: maskIp(meta.ip) });
      return NextResponse.json({ message: 'Problem report submitted successfully', saved: false, ignored: true });
    }

    const sessionId = isValidSessionId(rawData.sessionId) ? String(rawData.sessionId) : '';
    let geo: GeoInfo | null = null;
    if (meta.secGpc !== true) {
      const lookup = await lookupGeo(meta.ip);
      geo = lookup.geo;
    }
    if (sessionId) await markConversion(sessionId);

    const enriched = {
      ...data,
      ip: meta.secGpc ? undefined : meta.ip,
      userAgent: meta.userAgent || undefined,
      geo,
      ...(sessionId ? { sessionId } : {}),
    };

    const result = await saveProblemReport(enriched);

    // Route an internal copy to the admin-configured "Report a Problem"
    // destination receiver (opt-in via the admin email config → DB). No
    // configured recipient = saved + visible in the admin panel, no email.
    const insertedId = result.insertedId?.toString?.() || crypto.randomUUID();
    await sendEmailDirect({
      jobKey: `problem-report-${insertedId}`,
      formType: 'general',
      destination: 'report-problem',
      submission: {
        name: data.name,
        email: data.email,
        contact: data.contact,
        service: data.issueType,
        description: data.pageUrl ? `${data.pageUrl}\n\n${data.description}` : data.description,
        ip: enriched.ip,
        userAgent: enriched.userAgent,
        geo,
        ...(sessionId ? { sessionId } : {}),
      },
    });

    return NextResponse.json({ message: 'Problem report submitted successfully' });
  } catch (error) {
    console.error('Problem Report API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
