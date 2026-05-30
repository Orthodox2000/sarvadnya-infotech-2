'use client';

import { useState, useEffect, useRef } from 'react';
import { Job } from '@/lib/jobs';
import { submitApplication } from '@/app/actions/careers';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function JobApplicationModal({ 
  isOpen, 
  onClose, 
  job
}: JobApplicationModalProps) {
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
    if (!resume) {
      setError('Please upload your resume.');
      return;
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
      data.append('resume', resume);

      const result = await submitApplication(data);

      if (result.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-[#0371a3]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-white rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_rgba(3,113,163,0.3)] relative animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div className="bg-[#0371a3] p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ABE4] rounded-full blur-[60px] opacity-40 -mr-16 -mt-16" />
          
          <button 
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-[20]"
            onClick={onClose}
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-sky-100 mb-2 md:mb-3 border border-white/10">
              Apply Now
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">{job.title}</h2>
            <p className="mt-1 md:mt-2 text-[10px] md:text-xs text-sky-100/70 leading-relaxed font-bold">
              Join our team at Sarvadnya Infotech. Fill in your details below.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-10 bg-white max-h-[75vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 md:py-12 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner border border-emerald-200">
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">Application Sent!</h3>
              <p className="text-slate-500 text-xs md:text-sm font-bold opacity-80">Thank you for your interest. Our HR team will review your profile and get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sm:space-y-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Jane Doe"
                    className="w-full rounded-2xl bg-[#f0f9ff]/50 border border-[#E9F1FA] px-5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] transition-all font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@example.com"
                    className="w-full rounded-2xl bg-[#f0f9ff]/50 border border-[#E9F1FA] px-5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 00000 00000"
                    className="w-full rounded-2xl bg-[#f0f9ff]/50 border border-[#E9F1FA] px-5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] transition-all font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Experience (Years) *</label>
                  <input
                    required
                    type="text"
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: e.target.value})}
                    placeholder="e.g. 2 years"
                    className="w-full rounded-2xl bg-[#f0f9ff]/50 border border-[#E9F1FA] px-5 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resume (PDF only) *</label>
                <div 
                  className={`relative border-2 border-dashed rounded-[1.5rem] p-5 md:p-6 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer
                  ${resume ? 'border-emerald-200 bg-emerald-50/30' : 'border-[#E9F1FA] bg-[#f0f9ff]/30 hover:border-[#00ABE4]/50 hover:bg-[#f0f9ff]/50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  {resume ? (
                    <div className="flex flex-col items-center gap-1.5 text-emerald-600">
                      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] font-black truncate max-w-[250px] uppercase tracking-widest">{resume.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E9F1FA]">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Click to upload PDF resume</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cover Note (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us why you're a great fit..."
                  rows={2}
                  className="w-full rounded-2xl bg-[#f0f9ff]/50 border border-[#E9F1FA] px-5 py-3.5 sm:py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] transition-all font-bold resize-none"
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 border border-rose-100">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-12 sm:h-14 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#0371a3]/20 hover:bg-[#00ABE4] transition-all flex items-center justify-center gap-3 overflow-hidden active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Application</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        <div className="px-10 pb-6 bg-white">
          <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-widest opacity-60">
            Secure recruitment portal • v1.1.251
          </p>
        </div>
      </div>
    </div>
  );
}
