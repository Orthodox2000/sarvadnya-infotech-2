'use client';

import { useState } from 'react';
import { Job } from '@/lib/jobs';

interface OpeningCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function OpeningCard({ job, onApply }: OpeningCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isNew = (postedAt: string) => {
    const postDate = new Date(postedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const formattedDate = job.postedAt
    ? new Date(job.postedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div
      className="group relative bg-white border border-[#E5F4F4] rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-[#006569]/30 transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle border glow effect */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#006569]/0 via-[#006569]/10 to-[#006569]/0 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#006569]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {isNew(job.postedAt) && (
            <span className="px-2 py-0.5 bg-[#006569] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm shadow-[#006569]/20 group-hover:shadow-md group-hover:shadow-[#006569]/30 transition-all duration-300 group-hover:scale-105">
              New
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-full bg-[#F5F4ED] text-[#006569] text-[9px] font-black uppercase tracking-widest border border-[#E5F4F4] group-hover:bg-[#E5F4F4] group-hover:border-[#006569]/20 transition-all duration-300 group-hover:scale-105">
            {job.department}
          </span>
        </div>

        <h3 className="text-base md:text-lg font-black text-slate-900 group-hover:text-[#006569] transition-colors duration-300">
          {job.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1 group-hover:text-slate-500 transition-colors duration-300">
            {job.location}
          </span>
          <span className="flex items-center gap-1 group-hover:text-slate-500 transition-colors duration-300">
            {job.type}
          </span>
          <span className="flex items-center gap-1 group-hover:text-slate-500 transition-colors duration-300">
            Posted: {formattedDate}
          </span>
        </div>

        <p className="mt-3 text-xs md:text-sm text-slate-500 leading-relaxed font-bold opacity-80 group-hover:opacity-90 transition-opacity duration-300">
          {job.shortDescription}
        </p>

        <button
          onClick={() => onApply(job)}
          className="group/btn relative mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest bg-[#006569] text-white shadow-lg shadow-[#006569]/15 hover:shadow-xl hover:shadow-[#006569]/25 hover:scale-[1.02] active:scale-[0.995] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#006569]/30 focus:ring-offset-1"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Apply Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isHovered ? 'translate-x-0.5' : ''}`}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#006569] to-[#005559] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
