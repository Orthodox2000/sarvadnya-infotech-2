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
    qualification: '',
    skills: '',
    experience: '',
    experienceDetails: '',
    message: '',
    agreeTerms: false,
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
        qualification: user.qualification || prev.qualification || '',
        skills: user.skills || prev.skills || '',
        experience: user.experience || prev.experience || '',
        experienceDetails: user.experienceDetails || prev.experienceDetails || '',
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
    if (!formData.agreeTerms) {
      setError('Please agree to Terms & Conditions');
      return;
    }
    let resumeUrlField = '';
    let resumeNameField = 'resume.pdf';

    if (user && user.resumeUrl && !resume) {
      resumeUrlField = user.resumeUrl;
      resumeNameField = user.resumeName || 'resume.pdf';
    } else {
      if (!resume) {
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
      data.append('qualification', formData.qualification);
      data.append('skills', formData.skills);
      data.append('experience', formData.experience);
      data.append('experienceDetails', formData.experienceDetails);
      data.append('message', formData.message);
      data.append('agreeTerms', formData.agreeTerms ? 'true' : 'false');

      if (!resumeUrlField && resume) {
        const { url } = await uploadFileChunked({
          file: resume,
          type: 'resume',
          name: 'resume',
          endpoint: '/api/upload/chunk',
        });
        data.append('resumeUrl', url);
        data.append('resumeName', resume.name);
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
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-[#006569]/40 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-xl my-8" onClick={e => e.stopPropagation()}>
        <div className="bg-[#006569] p-6 text-white relative">
          <button className="absolute top-4 right-4 text-white/80" onClick={onClose}>✕</button>
          <h2 className="text-xl font-black">Apply Now — {job.title}</h2>
          <p className="text-xs mt-1 opacity-90">Review and confirm your details</p>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-black mb-2">Application Sent!</h3>
              <p className="text-sm text-slate-600">Thank you for your interest.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name *</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone *</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qualification</label>
                  <input value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" placeholder="e.g. BCA, BSc, MBA" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skills</label>
                <input value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" placeholder="e.g. Excel, Tally, Digital Marketing" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience (Years) *</label>
                  <input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience Details</label>
                  <input value={formData.experienceDetails} onChange={e => setFormData({...formData, experienceDetails: e.target.value})} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" placeholder="Previous role/company" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover Note</label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={2} className="w-full rounded-xl border border-[#E5F4F4] px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resume (PDF) *</label>
                {user?.resumeUrl && !resume ? (
                  <div className="text-xs text-slate-600 p-2 border border-[#E5F4F4] rounded-lg">
                    Using saved resume: <a href={user.resumeUrl} target="_blank" className="text-[#006569] underline">{user.resumeName || 'resume.pdf'}</a>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="ml-2 text-[#006569] underline">Replace</button>
                    <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </div>
                ) : (
                  <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileChange} className="w-full text-sm" required={!user?.resumeUrl} />
                )}
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="agreeTerms" checked={formData.agreeTerms} onChange={e => setFormData({...formData, agreeTerms: e.target.checked})} className="mt-1" required />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600">I agree to the Terms & Conditions and Privacy Policy</label>
              </div>
              {error && <div className="text-xs text-red-600">{error}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full min-h-11 rounded-xl bg-[#006569] text-white text-xs font-black uppercase tracking-widest">
                {isSubmitting ? 'Submitting...' : 'Apply Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}