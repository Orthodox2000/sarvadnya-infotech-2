import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldUrl = formData.get('oldUrl') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Cleanup old file if it exists and is in the uploads directory
    if (oldUrl && oldUrl.startsWith('/uploads/')) {
      try {
        const oldFileName = oldUrl.replace('/uploads/', '');
        const oldFilePath = path.join(uploadDir, oldFileName);
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn('Failed to delete old file:', err);
        // Continue even if deletion fails (e.g. file already gone)
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Sanitize filename and add timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      url: publicUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
