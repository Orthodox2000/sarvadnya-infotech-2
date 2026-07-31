import { handleChunkedUpload } from '@/lib/chunkUpload';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  return handleChunkedUpload(request);
}
