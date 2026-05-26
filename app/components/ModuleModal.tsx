'use client';

import { Module } from '@/lib/modules';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onEnquire: (module: Module) => void;
}

export default function ModuleModal({ isOpen, onClose, module, onEnquire }: ModuleModalProps) {
  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-sky-50 text-[#0371a3] text-[10px] font-black uppercase tracking-widest rounded-full border border-sky-100 mb-4">
            {module.category}
          </span>
          <h3 className="text-2xl md:text-4xl font-black mb-4 text-slate-900">{module.title}</h3>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base border-l-4 border-[#0371a3] pl-6 italic font-medium">
            {module.fullDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0371a3] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ABE4]"></span>
              Core Features
            </h4>
            <ul className="space-y-3">
              {module.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <svg className="w-4 h-4 text-[#0371a3] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Business Benefits
            </h4>
            <ul className="space-y-3">
              {module.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <svg className="w-4 h-4 text-[#00ABE4] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onEnquire(module)}
            className="flex-1 py-4 bg-[#0371a3] text-white rounded-2xl font-bold hover:bg-[#00ABE4] transition-all shadow-lg shadow-sky-900/10 flex items-center justify-center gap-2"
          >
            Request Free Demo
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
          <button 
            className="flex-1 py-4 border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
