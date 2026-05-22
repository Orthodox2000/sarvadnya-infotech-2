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
    const ext = path.extname(file.name).toLowerCase() || '.png';
    
    // Generate descriptive filename: {type}-{name}-{timestamp}{ext}
    const fileName = `sarvadnya-${assetType}-${assetName}-${Date.now()}${ext}`;

    // 1. Delete old file if provided and it's a Vercel Blob (Cleanup)
    if (oldUrl && (oldUrl.includes('public.blob.vercel-storage.com') || oldUrl.includes('blob.vercel-storage.com'))) {
      try {
        await del(oldUrl);
      } catch (delErr) {
        console.warn('Failed to delete old blob:', delErr);
        // Continue even if delete fails to ensure new upload works
      }
    }

    // 2. Upload to Vercel Blob with strict public access
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false, // Maintain our custom name exactly as generated
    });

    return NextResponse.json({ 
      message: 'File uploaded and synced to cloud storage', 
      url: blob.url
    });
  } catch (error) {
    console.error('Critical upload error:', error);
    return NextResponse.json({ error: 'Cloud storage upload failed. Please check your credentials.' }, { status: 500 });
  }
}
