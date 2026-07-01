'use client';

import { useState } from 'react';
import { Job } from '@/lib/jobs';

interface JobAccordionProps {
  job: Job;
  onApply: (job: Job) => void;
}

export default function JobAccordion({ job, onApply }: JobAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if job is "new" (posted within 7 days)
  const isNew = (postedAt: string) => {
    const postDate = new Date(postedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const formattedDate = job.postedAt ? new Date(job.postedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Recently';

  return (
    <div 
      className={`group border rounded-[2rem] transition-all duration-500 overflow-hidden ${
        isOpen ? 'border-[#316852]/30 bg-[#f0f9ff]/50 shadow-2xl' : 'border-[#E9F1FA] bg-white hover:border-[#316852]/40 hover:shadow-xl'
      }`}
    >
      {/* Header - Always Visible */}
      <div 
        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {isNew(job.postedAt) && (
              <span className="px-2.5 py-0.5 bg-[#316852] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                New
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-[#f0f9ff] text-[#316852] text-[9px] font-black uppercase tracking-widest border border-[#E9F1FA]">
              {job.department}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-[#316852] transition-colors tracking-tight">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-4 mt-3 text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#316852]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#316852]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {job.type}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#316852]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Posted: {formattedDate}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-2xl font-bold opacity-80">
            {job.shortDescription}
          </p>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="mt-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#316852] hover:text-[#316852] transition-colors"
          >
            {isOpen ? 'Show Less' : 'Learn More'}
            <svg className={`w-3.5 h-3.5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button 
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#316852] text-white hover:bg-[#316852] transition-all shadow-lg shadow-[#316852]/20 hover:scale-105 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
          >
            Apply Now
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[2000px] border-t border-[#E9F1FA]' : 'max-h-0'}`}>
        <div className="p-8 md:p-10 space-y-10 bg-white">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#316852] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#316852] animate-pulse"></span>
              About the Role
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base font-bold opacity-90 whitespace-pre-wrap">
              {job.aboutRole || job.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#316852] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#316852]"></span>
                What We're Looking For
              </h4>
              <ul className="space-y-4">
                {job.lookingFor ? (
                  job.lookingFor.split('\n').filter(line => line.trim()).map((req, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-sm text-slate-600 font-bold opacity-90">
                      <svg className="w-5 h-5 text-[#316852] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      {req}
                    </li>
                  ))
                ) : (
                  (job.requirements || []).map((req, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-sm text-slate-600 font-bold opacity-90">
                      <svg className="w-5 h-5 text-[#316852] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      {req}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#316852] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#316852]"></span>
                Why Join Us?
              </h4>
              <ul className="space-y-4">
                {job.whyJoinUs ? (
                  job.whyJoinUs.split('\n').filter(line => line.trim()).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-sm text-slate-600 font-bold opacity-90">
                      <svg className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {benefit}
                    </li>
                  ))
                ) : (
                  (job.benefits || []).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-sm text-slate-600 font-bold opacity-90">
                      <svg className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {benefit}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-[#E9F1FA] flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Resume must be in PDF format
            </div>
            <button 
              className="bg-[#316852] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#316852] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#316852]/20"
              onClick={() => onApply(job)}
            >
              Start Your Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
