'use client';

import { useState, useRef } from 'react';
import { uploadFileChunked } from '@/lib/uploadClient';

interface ResumeManagerProps {
  user: any;
  onUpdate?: (user: any) => void;
}

// CHANGE: 2026-10-05 — the resume success banner was `emerald-*`, a colour family retired from the
// brand (AGENTS.md §7, "do not reintroduce" green/emerald/hex greens). Switched to teal so no green
// survives on the redesigned /careers page, where this component now also appears inline.
export function ResumeManager({ user, onUpdate }: ResumeManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    setError(null);
    setSuccess(null);

    if (file.type !== 'application/pdf') {
      setError('Please upload resume in PDF format only.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const { url } = await uploadFileChunked({
        file,
        type: 'resume',
        name: 'career-resume',
        endpoint: '/api/upload/chunk',
        onProgress: (percent) => {
          setProgress(Math.min(95, 10 + percent * 0.85));
        },
      });

      clearInterval(progressInterval);
      setProgress(95);

      const formData = new FormData();
      formData.append('resumeUrl', url);
      formData.append('resumeName', file.name);
      formData.append('oldUrl', user.resumeUrl || '');

      const response = await fetch('/api/auth/careers/resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload resume');
      }

      setProgress(100);
      setSuccess('Resume uploaded successfully!');

      if (onUpdate) {
        onUpdate({ ...user, resumeUrl: result.resumeUrl, resumeName: result.resumeName });
      }

      setTimeout(() => {
        setProgress(0);
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
      setProgress(0);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your resume?')) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/careers/resume', {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setSuccess('Resume deleted successfully');

      if (onUpdate) {
        onUpdate({ ...user, resumeUrl: undefined, resumeName: undefined });
      }

      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Resume</h4>
      </div>

      {user.resumeUrl ? (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <a
            href={user.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#006569] font-bold hover:underline truncate max-w-[200px] flex items-center gap-1.5 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {user.resumeName || 'View Resume'}
          </a>
          <button
            onClick={handleDelete}
            disabled={uploading}
            className="text-[10px] text-slate-400 hover:text-red-500 font-bold disabled:opacity-50 transition-colors duration-200 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Remove
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 mb-3">No resume uploaded</p>
      )}

      {/* Progress bar */}
      {uploading && progress > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
            <span className="font-semibold">Uploading...</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#006569] to-[#005559] h-1.5 transition-all duration-300 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {success && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E5F4F4] border border-[#B8DEDE] text-[#006569] text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-in zoom-in-50 duration-500"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}

      {/* Drag and drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-300 group ${
          dragActive
            ? 'border-[#006569] bg-[#006569]/5 scale-[1.01]'
            : 'border-[#E5F4F4] bg-[#F5F4ED]/30 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/60'
        } ${uploading ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div
            className={`p-2 rounded-full transition-all duration-300 ${
              dragActive
                ? 'bg-[#006569] text-white scale-110 shadow-lg shadow-[#006569]/20'
                : 'bg-white text-[#006569] group-hover:bg-[#006569] group-hover:text-white shadow-sm'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700">
              {uploading
                ? 'Uploading your resume...'
                : dragActive
                  ? 'Drop your resume here'
                  : user.resumeUrl
                    ? 'Update your resume'
                    : 'Upload your resume'}
            </p>
            <p className="text-[10px] text-slate-400">Drag & drop or click to browse • PDF only • Max 5MB</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2 animate-in fade-in slide-in-from-top-1 duration-300">{error}</p>
      )}
    </div>
  );
}
