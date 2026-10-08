'use client';

import { useState, useEffect, useRef } from 'react';
import { Job } from '@/lib/jobs';
import { submitApplication } from '@/app/actions/careers';
import { uploadFileChunked } from '@/lib/uploadClient';

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  user?: any;
}

export default function QuickApplyModal({ isOpen, onClose, job, user }: QuickApplyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
      setIsSuccess(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload resume in PDF format only.');
        setResume(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB.');
        setResume(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setResume(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let resumeToUse = resume;
    let resumeUrlField = '';
    let resumeNameField = resumeToUse?.name || 'resume.pdf';

    if (user && user.resumeUrl && !resumeToUse) {
      resumeUrlField = user.resumeUrl;
      resumeNameField = user.resumeName || 'resume.pdf';
    } else {
      if (!resumeToUse) {
        setError('Please upload your resume.');
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('jobId', job.id);
      data.append('jobTitle', job.title);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('experience', formData.experience);
      data.append('message', formData.message);

      if (!resumeUrlField && resumeToUse) {
        const { url } = await uploadFileChunked({
          file: resumeToUse,
          type: 'resume',
          name: 'resume',
          endpoint: '/api/upload/chunk',
        });
        data.append('resumeUrl', url);
        data.append('resumeName', resumeToUse.name);
      } else {
        data.append('resumeUrl', resumeUrlField);
        data.append('resumeName', resumeNameField);
      }

      const result = await submitApplication(data);
      if (result.error) throw new Error(result.error);

      setIsSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-[#006569]/40 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-xl bg-white rounded-[2rem] overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="bg-[#006569] p-6 text-white">
          <button className="absolute top-4 right-4 text-white/80" onClick={onClose}>✕</button>
          <h2 className="text-xl font-black">Apply Now — {job.title}</h2>
          <p className="text-xs mt-1 opacity-90">Quick apply with your profile details</p>
        </div>
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-black mb-2">Application Sent!</h3>
              <p className="text-sm text-slate-600">Thank you for your interest.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience (Years)*</label>
                <input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover Note (Optional)</label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={2} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resume (PDF)*</label>
                {user?.resumeUrl && !resume ? (
                  <div className="text-xs text-slate-600">
                    Using saved resume: <a href={user.resumeUrl} target="_blank" className="text-[#006569] underline">{user.resumeName || 'resume.pdf'}</a>
                    <button type="button" onClick={() => setResume(null)} className="ml-2 text-red-600">Replace</button>
                  </div>
                ) : (
                  <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileChange} className="w-full text-sm" required />
                )}
              </div>
              {error && <div className="text-xs text-red-600">{error}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full min-h-11 rounded-xl bg-[#006569] text-white text-xs font-black uppercase tracking-widest">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}