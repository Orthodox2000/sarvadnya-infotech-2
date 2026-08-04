import { NextResponse } from 'next/server';
import { saveProblemReport } from '@/lib/mongodb-utils';
import { sendEmailDirect } from '@/lib/email-queue';

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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
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

    const result = await saveProblemReport(data);

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
      },
    });

    return NextResponse.json({ message: 'Problem report submitted successfully' });
  } catch (error) {
    console.error('Problem Report API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
