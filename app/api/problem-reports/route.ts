import { NextResponse } from 'next/server';
import { saveProblemReport } from '@/lib/mongodb-utils';

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

    await saveProblemReport(data);

    return NextResponse.json({ message: 'Problem report submitted successfully' });
  } catch (error) {
    console.error('Problem Report API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
