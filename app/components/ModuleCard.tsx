'use client';

import { Module } from '@/lib/modules';
import Image from 'next/image';

interface ModuleCardProps {
  module: Module;
  onViewDetails: (module: Module) => void;
  onEnquire: (module: Module) => void;
}

export default function ModuleCard({ module, onViewDetails, onEnquire }: ModuleCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={module.image}
          alt={module.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
            {module.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black text-[#0f0529] mb-2 group-hover:text-[#7338a0] transition-colors">
          {module.title}
        </h3>
        <p className="text-slate-600 text-[13px] leading-relaxed mb-5 line-clamp-3">
          {module.shortDescription}
        </p>

        {/* Action Links */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <a
            href={module.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-700 text-[10px] font-bold hover:bg-[#7338a0] hover:text-white transition-all border border-slate-100"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Watch Video
          </a>
          <a
            href={module.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-700 text-[10px] font-bold hover:bg-[#7338a0] hover:text-white transition-all border border-slate-100"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Brochure
          </a>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => onViewDetails(module)}
            className="flex-1 py-2.5 bg-[#0f0529] text-white text-[11px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-indigo-100"
          >
            Explore Details
          </button>
          <button
            onClick={() => onEnquire(module)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-[#7338a0] hover:bg-slate-50 transition-all"
            title="Enquire Now"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
