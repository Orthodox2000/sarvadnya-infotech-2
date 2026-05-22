import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldUrl = formData.get('oldUrl') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Extract metadata hints for naming
    const assetType = formData.get('type') as string || 'asset';
    const assetName = (formData.get('name') as string || 'file').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const ext = path.extname(file.name).toLowerCase();
    
    // Generate descriptive filename
    const fileName = `${assetType}-${assetName}-${Date.now()}${ext}`;

    // 1. Delete old file if provided (Cleanup)
    if (oldUrl && oldUrl.includes('public.blob.vercel-storage.com')) {
      try {
        await del(oldUrl);
      } catch (delErr) {
        console.warn('Failed to delete old blob:', delErr);
      }
    }

    // 2. Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      url: blob.url
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to upload file to cloud storage' }, { status: 500 });
  }
}
