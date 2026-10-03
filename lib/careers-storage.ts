import { put, del } from '@vercel/blob';

export const MEGA_ENABLED = process.env.MEGA_ENABLED === 'true' || process.env.MEGA_ENABLED === '1';

export async function storeResume(buffer: Buffer, fileName: string, oldUrl?: string | null): Promise<string> {
  try {
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalName = `careers/resumes/${timestamp}-${safeName}`;
    
    const blob = await put(finalName, buffer, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    if (oldUrl) {
      try {
        await del(oldUrl);
      } catch (err) {
        console.warn('Failed to delete old resume blob:', err);
      }
    }
    
    return blob.url;
  } catch (err) {
    console.error('Failed to store resume in Blob:', err);
    throw new Error('Failed to upload resume to storage.');
  }
}
