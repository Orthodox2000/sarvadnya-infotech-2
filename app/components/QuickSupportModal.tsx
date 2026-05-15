'use client';

import { useState, useEffect } from 'react';

interface QuickSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSupportModal({ isOpen, onClose }: QuickSupportModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="hero-glass-panel hero-glass-panel-mobile w-full max-w-md rounded-[32px] p-6 text-white shadow-[0_32px_80px_rgba(15,23,42,0.4)] relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(180deg, rgba(42, 22, 92, 0.95), rgba(69, 31, 128, 0.9))' }}
      >
        <button 
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-100/90">
          Priority Access
        </p>
        <h2 className="mt-2 font-sans text-2xl font-bold leading-tight">
          Quick Support Request
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-violet-50/80">
          Share your details and our certified experts will call you back within 15 minutes.
        </p>

        <form className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="hero-glass-input w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="hero-glass-input w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className="hero-glass-input w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Service Needed</label>
              <input
                type="text"
                placeholder="e.g. TallyPrime Upgrade"
                className="hero-glass-input w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-violet-200/70 ml-1">Brief Description</label>
            <textarea
              placeholder="How can we help you today?"
              rows={3}
              className="hero-glass-input w-full resize-none rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[var(--primary-color,#7338a0)] shadow-xl transition-all duration-300 hover:bg-violet-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Send Request Now
          </button>
        </form>
        
        <p className="mt-6 text-center text-[10px] text-white/40">
          By submitting, you agree to our privacy policy.
        </p>
      </div>
    </div>
  );
}
