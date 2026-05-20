import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb-utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Image}`;

    // Store in a dedicated assets collection
    const col = await getCollection('site_assets');
    const result = await col.insertOne({
      name: file.name,
      type: file.type,
      data: dataUrl,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      url: dataUrl, // Returning dataUrl for immediate use
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
