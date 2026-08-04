import { NextResponse } from 'next/server';
import { saveTssRenewal } from '@/lib/mongodb-utils';
import { sendEmailDirect } from '@/lib/email-queue';

function sanitize(str: string) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().substring(0, 500);
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    const data = {
      serialNumber: sanitize(rawData.serialNumber),
      name: sanitize(rawData.name),
      email: sanitize(rawData.email),
      source: sanitize(rawData.source) || 'website'
    };

    if (!data.serialNumber || !data.name || !data.email) {
      return NextResponse.json({ error: 'Serial number, name, and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const result = await saveTssRenewal(data);
    const renewalId = result.insertedId.toString();

    // Send the internal TSS-renewal email copy DIRECTLY (inline). Recipients are
    // opt-in via the "TSS Renewal" receiver option in /admin/email-config — no
    // receiver configured means no email (the request is still saved).
    const send = await sendEmailDirect({
      jobKey: `tss-renewal-${renewalId}`,
      formType: 'tss-renewal',
      destination: 'tss-renewal',
      submission: {
        name: data.name,
        email: data.email,
        contact: '',
        service: `TSS Serial No: ${data.serialNumber}`,
        description: `TSS renewal requested from ${data.source || 'website'}`,
        formType: 'tss-renewal',
        destination: 'tss-renewal',
      },
    });

    return NextResponse.json({
      message: 'Renewal request submitted successfully',
      emailSent: send.sent,
    });
  } catch (error) {
    console.error('TSS Renewal API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
