import { NextResponse } from 'next/server';
import { saveTssRenewal } from '@/lib/mongodb-utils';

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

    await saveTssRenewal(data);

    return NextResponse.json({ message: 'Renewal request submitted successfully' });
  } catch (error) {
    console.error('TSS Renewal API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
