import { NextResponse } from 'next/server';
import { saveSubmission } from '@/lib/mongodb-utils';

function sanitize(str: string) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Basic tag removal
    .trim()
    .substring(0, 2000); // Length limit
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // Data Sanitization
    const data = {
      name: sanitize(rawData.name),
      email: sanitize(rawData.email),
      contact: sanitize(rawData.contact),
      service: sanitize(rawData.service),
      formType: sanitize(rawData.formType),
      description: sanitize(rawData.description)
    };
    
    // Basic validation
    if (!data.name || !data.email || !data.contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await saveSubmission(data);

    return NextResponse.json({ message: 'Submission successful' });
  } catch (error) {
    console.error('Submission API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
