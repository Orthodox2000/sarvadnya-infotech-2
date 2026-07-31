const CHUNK_SIZE = 2 * 1024 * 1024;
const DIRECT_UPLOAD_LIMIT = 3 * 1024 * 1024;

export interface UploadFileOptions {
  file: File;
  type?: string;
  name?: string;
  oldUrl?: string;
  endpoint?: string;
  onProgress?: (loadedBytes: number, totalBytes: number) => void;
}

export interface UploadResult {
  url: string;
  message?: string;
}

export async function uploadFileChunked(options: UploadFileOptions): Promise<UploadResult> {
  const {
    file,
    type,
    name,
    oldUrl,
    endpoint = '/api/admin/upload/chunk',
    onProgress,
  } = options;

  const appendMeta = (fd: FormData) => {
    if (type) fd.append('type', type);
    if (name) fd.append('name', name);
    if (oldUrl) fd.append('oldUrl', oldUrl);
  };

  if (file.size <= DIRECT_UPLOAD_LIMIT) {
    const fd = new FormData();
    fd.append('file', file);
    appendMeta(fd);

    const res = await fetch(endpoint, { method: 'POST', body: fd });
    const data = (await res.json().catch(() => ({}))) as UploadResult & { error?: string };
    if (!res.ok || data.error) throw new Error(data.error || 'Upload failed. Please try again.');
    onProgress?.(file.size, file.size);
    return data;
  }

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const fd = new FormData();
    fd.append('file', chunk, file.name);
    fd.append('uploadId', uploadId);
    fd.append('chunkIndex', String(i));
    fd.append('totalChunks', String(totalChunks));
    appendMeta(fd);

    const res = await fetch(endpoint, { method: 'POST', body: fd });
    const data = (await res.json().catch(() => ({}))) as UploadResult & {
      error?: string;
      pending?: boolean;
    };
    if (!res.ok || data.error)
      throw new Error(data.error || `Upload failed on chunk ${i + 1} of ${totalChunks}.`);
    onProgress?.(end, file.size);
    if (data.url) return data;
  }

  throw new Error('Upload did not complete. Please try again.');
}
