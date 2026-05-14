import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract data
    const jobId = formData.get('jobId');
    const jobTitle = formData.get('jobTitle');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const experience = formData.get('experience');
    const message = formData.get('message');
    const resume = formData.get('resume') as File;

    if (!resume || resume.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid resume format. PDF required.' }, { status: 400 });
    }

    // Log the application (In a real app, you'd save to DB and upload file to S3/Cloudinary)
    console.log('--- New Job Application ---');
    console.log('Job:', jobTitle, `(${jobId})`);
    console.log('Applicant:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Experience:', experience);
    console.log('Resume Name:', resume.name);
    console.log('Resume Size:', resume.size, 'bytes');
    console.log('---------------------------');

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ message: 'Application submitted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Application Error:', error);
    return NextResponse.json({ error: 'Failed to process application.' }, { status: 500 });
  }
}
