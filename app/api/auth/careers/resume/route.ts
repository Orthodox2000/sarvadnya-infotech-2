import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCareersUser, getCareersUsersCollection } from '@/lib/careers-auth';
import { storeResume, MEGA_ENABLED } from '@/lib/careers-storage';
import { uploadToMega } from '@/lib/mega';
import { isIgnoredRequest } from '@/lib/visitors';
import { del } from '@vercel/blob';

// CHANGE: 2026-10-17 — helpers for the "already uploaded to Blob" resume flow that
// ResumeManager uses (see the POST handler note below).
const isOwnBlobUrl = (url: string): boolean => {
  try {
    return new URL(url).hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
};

const fileNameFromUrl = (url: string): string => {
  try {
    const last = new URL(url).pathname.split('/').pop();
    return last ? decodeURIComponent(last) : 'resume.pdf';
  } catch {
    return 'resume.pdf';
  }
};

const safeDeleteBlob = async (url: string): Promise<void> => {
  // Never delete anything outside our own Blob store.
  if (!isOwnBlobUrl(url)) return;
  try {
    await del(url);
  } catch (err) {
    console.warn('Failed to delete old resume blob:', err);
  }
};

// Mega when configured, Blob otherwise (with a Blob fallback if Mega throws).
async function persistResume(buffer: Buffer, fileName: string, oldUrl?: string | null): Promise<string> {
  if (MEGA_ENABLED) {
    try {
      const url = await uploadToMega(buffer, fileName, 'careers-resumes');
      if (oldUrl && oldUrl !== url) await safeDeleteBlob(oldUrl);
      return url;
    } catch (err) {
      console.warn('Mega upload failed, falling back to Blob:', err);
    }
  }
  return storeResume(buffer, fileName, oldUrl);
}

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
    // CHANGE: 2026-10-17 — ResumeManager uploads the PDF via the public chunked endpoint
    // (/api/upload/chunk, required because Vercel rejects bodies >4.5MB) and then posts the
    // resulting `resumeUrl` back here. This route only read a `resume` File, so that flow
    // failed with "No file uploaded" and the resume was never saved. Accept BOTH shapes.
    const file = formData.get('resume') as File | null;
    const providedUrl = String(formData.get('resumeUrl') || '').trim();
    const providedName = String(formData.get('resumeName') || '').trim();
    const oldUrl = (formData.get('oldUrl') as string | null) || '';

    let resumeUrl = '';
    let resumeName = '';

    if (file && file.size > 0) {
      // Direct-upload path (small files / back-compat).
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Resume must be PDF' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      resumeName = file.name;
      resumeUrl = await persistResume(buffer, file.name, oldUrl);
    } else if (providedUrl) {
      // Pre-uploaded path (ResumeManager). Only accept a reference into OUR Blob store.
      if (!isOwnBlobUrl(providedUrl)) {
        return NextResponse.json({ error: 'Invalid file reference' }, { status: 400 });
      }
      resumeUrl = providedUrl;
      resumeName = providedName || fileNameFromUrl(providedUrl);
      if (MEGA_ENABLED) {
        try {
          const resp = await fetch(resumeUrl);
          if (!resp.ok) throw new Error(`Blob read failed (${resp.status})`);
          const buffer = Buffer.from(await resp.arrayBuffer());
          const megaUrl = await uploadToMega(buffer, resumeName, 'careers-resumes');
          await safeDeleteBlob(resumeUrl);
          resumeUrl = megaUrl;
        } catch (err) {
          console.warn('Mega forward failed, keeping Blob URL:', err);
        }
      }
      if (oldUrl && oldUrl !== resumeUrl) await safeDeleteBlob(oldUrl);
    } else {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const users = await getCareersUsersCollection();
    await users.updateOne(
      { _id: user._id },
      { $set: { resumeUrl, resumeName, updatedAt: new Date() } }
    );

    return NextResponse.json({ resumeUrl, resumeName });
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
