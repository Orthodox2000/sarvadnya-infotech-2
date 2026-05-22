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
      className={`group border rounded-2xl transition-all duration-300 ${
        isOpen ? 'border-[#7338a0] bg-slate-50/50 shadow-xl' : 'border-slate-200 bg-white hover:border-[#7338a0]/30 hover:shadow-md'
      }`}
    >
      {/* Header - Always Visible */}
      <div 
        className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isNew(job.postedAt) && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                New
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {job.department}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-[#0f0529] group-hover:text-[#7338a0] transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {job.type}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Posted: {formattedDate}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
            {job.shortDescription}
          </p>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="mt-4 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-[#7338a0] hover:text-[#4a2574] transition-colors"
          >
            {isOpen ? 'Show Less' : 'Learn More'}
            <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest bg-slate-100 text-[#0f0529] hover:bg-[#7338a0] hover:text-white transition-all shadow-sm"
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
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] border-t border-black/5' : 'max-h-0'}`}>
        <div className="p-6 md:p-8 space-y-8 bg-white/50">
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#7338a0] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7338a0]"></span>
              About the Role
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {job.aboutRole || job.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#7338a0] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7338a0]"></span>
                What We're Looking For
              </h4>
              <ul className="space-y-3">
                {job.lookingFor ? (
                  job.lookingFor.split('\n').filter(line => line.trim()).map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      {req}
                    </li>
                  ))
                ) : (
                  (job.requirements || []).map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      {req}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#7338a0] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7338a0]"></span>
                Why Join Us?
              </h4>
              <ul className="space-y-3">
                {job.whyJoinUs ? (
                  job.whyJoinUs.split('\n').filter(line => line.trim()).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {benefit}
                    </li>
                  ))
                ) : (
                  (job.benefits || []).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {benefit}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-xs text-slate-400 font-medium italic">
              * Please have your resume ready in PDF format before applying.
            </div>
            <button 
              className="bg-[#0f0529] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
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
