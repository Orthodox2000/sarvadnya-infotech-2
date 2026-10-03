import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCareersUser, getCareersUsersCollection } from '@/lib/careers-auth';
import { storeResume } from '@/lib/careers-storage';
import { uploadToMega } from '@/lib/mega';
import { isIgnoredRequest } from '@/lib/visitors';

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Request blocked' }, { status: 403 });
    }
    
    const user = await getCurrentCareersUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    const oldUrl = formData.get('oldUrl') as string | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Resume must be PDF' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const users = await getCareersUsersCollection();
    
    const megaEnabled = process.env.MEGA_ENABLED === 'true' || process.env.MEGA_ENABLED === '1';
    let resumeUrl = '';
    
    if (megaEnabled) {
      try {
        resumeUrl = await uploadToMega(buffer, file.name, 'careers-resumes');
      } catch (err) {
        console.warn('Mega upload failed, falling back to Blob:', err);
        resumeUrl = await storeResume(buffer, file.name, oldUrl);
      }
    } else {
      resumeUrl = await storeResume(buffer, file.name, oldUrl);
    }
    
    await users.updateOne(
      { _id: user._id },
      { $set: { resumeUrl, resumeName: file.name, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ resumeUrl, resumeName: file.name });
  } catch (err) {
    console.error('Resume upload error:', err);
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentCareersUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const users = await getCareersUsersCollection();
    await users.updateOne(
      { _id: user._id },
      { $set: { resumeUrl: undefined, resumeName: undefined, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resume delete error:', err);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
