import { NextResponse } from 'next/server';
import { saveMedia } from '@/lib/mongodb-utils';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const contentType = file.type;
    const name = file.name;

    const result = await saveMedia(name, base64Data, contentType);

    // Return the URL to access this image
    const imageUrl = `/api/media/${result.insertedId}`;

    return NextResponse.json({ 
      message: 'File uploaded to MongoDB', 
      url: imageUrl,
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error uploading to MongoDB:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
