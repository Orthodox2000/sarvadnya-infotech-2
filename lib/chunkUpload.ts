import { put, del, list, get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import path from 'path';

const MAX_CHUNK_SIZE = 3 * 1024 * 1024;
const MAX_CHUNKS = 200;

function isBlobUrl(url: string): boolean {
  return url.includes('public.blob.vercel-storage.com') || url.includes('blob.vercel-storage.com');
}

async function safeDel(url: string): Promise<void> {
  try {
    await del(url);
  } catch (err) {
    console.warn('Failed to delete blob:', url, err);
  }
}

async function* readParts(urls: string[]): AsyncGenerator<Uint8Array> {
  for (const url of urls) {
    const result = await get(url, { access: 'public' });
    if (!result || !result.stream) {
      throw new Error(`Failed to read uploaded part: ${url}`);
    }
    const reader = result.stream.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }
}

function streamFromGenerator<T>(generator: AsyncGenerator<T>): ReadableStream<T> {
  return new ReadableStream<T>({
    async pull(controller) {
      const { done, value } = await generator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    async cancel() {
      await generator.return?.(undefined);
    },
  });
}

export async function handleChunkedUpload(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const assetType = ((formData.get('type') as string) || 'asset').toLowerCase();
    const assetName = ((formData.get('name') as string) || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const oldUrl = formData.get('oldUrl') as string | null;
    const totalChunks = Math.max(1, Number(formData.get('totalChunks')) || 1);
    const ext = path.extname(file.name).toLowerCase() || '.png';
    const finalName = `sarvadnya-${assetType}-${assetName}-${Date.now()}${ext}`;

    if (totalChunks > MAX_CHUNKS) {
      return NextResponse.json({ error: 'File is too large to upload' }, { status: 400 });
    }

    if (totalChunks <= 1) {
      const blob = await put(finalName, file, { access: 'public', addRandomSuffix: false });
      if (oldUrl && isBlobUrl(oldUrl)) await safeDel(oldUrl);
      return NextResponse.json({ message: 'File uploaded successfully', url: blob.url });
    }

    if (file.size > MAX_CHUNK_SIZE) {
      return NextResponse.json({ error: 'Upload chunk exceeds size limit' }, { status: 400 });
    }

    const uploadId =
      (formData.get('uploadId') as string) ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const chunkIndex = Number(formData.get('chunkIndex')) || 0;

    if (chunkIndex < 0 || chunkIndex >= totalChunks) {
      return NextResponse.json({ error: 'Invalid chunk index' }, { status: 400 });
    }

    const chunkPrefix = `sarvadnya-uploads/_chunks/${uploadId}/`;
    const chunkName = `${chunkPrefix}part-${String(chunkIndex).padStart(5, '0')}${ext}`;

    await put(chunkName, file, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    if (chunkIndex < totalChunks - 1) {
      return NextResponse.json({ received: chunkIndex, pending: true });
    }

    const { blobs } = await list({ prefix: chunkPrefix });
    const parts = blobs
      .filter((b) => b.pathname.startsWith(chunkPrefix))
      .sort((a, b) => a.pathname.localeCompare(b.pathname));

    if (parts.length !== totalChunks) {
      throw new Error(`Expected ${totalChunks} chunks, received ${parts.length}.`);
    }

    const partUrls = parts.map((p) => p.url);
    const blob = await put(finalName, streamFromGenerator(readParts(partUrls)), {
      access: 'public',
      addRandomSuffix: false,
    });

    await del(partUrls).catch((err) => console.warn('Failed to clean up parts:', err));
    if (oldUrl && isBlobUrl(oldUrl)) await safeDel(oldUrl);

    return NextResponse.json({ message: 'File uploaded successfully', url: blob.url });
  } catch (error) {
    console.error('Critical upload error:', error);
    return NextResponse.json(
      { error: 'Cloud storage upload failed. Please check your credentials.' },
      { status: 500 }
    );
  }
}
