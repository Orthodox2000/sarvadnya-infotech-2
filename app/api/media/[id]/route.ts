import { NextResponse } from 'next/server';
import { getMedia } from '@/lib/mongodb-utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await getMedia(id);

    if (!media) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const buffer = Buffer.from(media.data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': media.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving media:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
