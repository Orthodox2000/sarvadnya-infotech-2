'use client';

import { useState, useEffect } from 'react';

interface QuickSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSupportModal({ isOpen, onClose }: QuickSupportModalProps) {
  // We no longer want to disable body scroll because it's a small panel now
  useEffect(() => {
    // Scroll handling removed as it's not a full-screen modal anymore
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-6 z-[1001] w-[calc(100%-3rem)] max-w-sm animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
      <div 
        className="relative overflow-hidden w-full rounded-[2rem] p-6 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.15)] border border-slate-100 bg-white/95 backdrop-blur-md pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-50 rounded-full blur-3xl opacity-60 -ml-12 -mb-12" />

        <button 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-[20] w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close panel"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#7338a0] animate-pulse"></span>
            AI Assistant
          </div>
          <h2 className="font-sans text-xl font-black leading-tight tracking-tight text-[#0f0529]">
            Ask Our <span className="text-[#7338a0]">AI Expert</span>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
            How can I help you with Tally today?
          </p>

          <form className="mt-6 space-y-3">
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/10 focus:border-[#7338a0] transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/10 focus:border-[#7338a0] transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <textarea
                placeholder="Describe your query..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/10 focus:border-[#7338a0] resize-none transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 rounded-xl bg-[#7338a0] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#7338a0]/20 transition-all duration-300 hover:bg-[#4a2574] hover:scale-[1.02] active:scale-[0.98]"
            >
              Send Request
            </button>
          </form>
          
          <p className="mt-4 text-center text-[8px] text-slate-400 font-medium">
            🔒 Secure Response within 15 mins
          </p>
        </div>
      </div>
    </div>
  );
}
