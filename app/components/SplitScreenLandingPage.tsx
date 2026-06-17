'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeroPolygonLeft from './hero-polygon-left'
import HeroPolygonRight from './hero-polygon-right'
import QuickSupportModal from './QuickSupportModal';

export default function SplitScreenLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  return (
    <main className="flex min-h-[calc(100svh-7rem)] w-full items-stretch justify-start">
      <QuickSupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <section className="relative min-h-[calc(100svh-7rem)] w-full overflow-hidden border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">        
        <div className="relative min-h-[26rem] sm:min-h-[30rem] md:min-h-[calc(100svh-7rem)]">
          <HeroPolygonLeft />
          <HeroPolygonRight />

          <div className="relative z-20 flex min-h-[26rem] w-full items-center justify-center px-5 py-6 text-center sm:min-h-[30rem] sm:px-8 sm:py-8 sm:text-left md:min-h-[calc(100svh-7rem)] md:w-[52%] md:justify-start">
            <div className="hero-glass-panel hero-text-panel-mobile max-w-sm rounded-[22px] p-4 text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] min-[601px]:border-0 min-[601px]:bg-transparent min-[601px]:p-0 min-[601px]:shadow-none min-[601px]:[backdrop-filter:none] min-[601px]:[-webkit-backdrop-filter:none]">
              <p className="text-[0.78rem] font-medium uppercase tracking-[0.2em] text-violet-200 sm:text-sm">
                Sarvadnya Infotech
              </p>
              <h1 className="mt-3 font-sans text-[1.55rem] font-bold leading-[1.02] text-white sm:mt-4 sm:text-[2.25rem] md:text-[2.9rem]">
                Never Deny Service Call Policy for every customer who needs us.    
              </h1>
              <p className="mt-3 text-[0.84rem] leading-5 text-violet-100 sm:mt-4 sm:text-[0.95rem] sm:leading-6 md:text-base md:leading-7">
                Fast support for tally, billing, AMC, training, and on-site troubleshooting.
                If your business needs help, we respond first and sort the issue without turning the call away.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-full bg-white/18 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] ring-1 ring-white/35 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Request Callback
              </Link>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden items-center justify-end pr-5 md:flex md:w-[36%] lg:pr-8">
            <div className="relative overflow-hidden pointer-events-auto w-full max-w-[15.5rem] rounded-[2.5rem] p-5 text-slate-900 shadow-[0_32px_80px_rgba(15,23,42,0.12)] lg:max-w-[17.5rem] bg-white border border-slate-100 group transition-all duration-500 hover:-translate-y-2">
              {/* Animated Background Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#7338a0] animate-pulse"></span>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Quick Support
                  </p>
                </div>
                <h2 className="text-xl font-black leading-tight tracking-tight mb-2 text-[#0f0529]">
                  Request a <span className="text-[#7338a0]">callback</span>
                </h2>
                <p className="text-[11px] leading-relaxed text-slate-500 mb-5 font-medium"> 
                  Share your details and our team will call you back within 15 minutes.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/10 focus:border-[#7338a0] transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value.replace(/[^0-9+]/g, '')})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7338a0]/10 focus:border-[#7338a0] transition-all shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => {
                       if (!formData.name || !formData.phone) {
                         alert('Please enter your name and phone number.');
                         return;
                       }
                       // Here you would typically send the request
                       alert('Thank you! We will call you back shortly.');
                       setFormData({ name: '', phone: '' });
                    }}
                    className="flex w-full items-center justify-center rounded-2xl bg-[#7338a0] px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#7338a0]/20 transition-all duration-300 hover:bg-[#4a2574] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Send Request
                  </button>
                </div>
                
                <p className="mt-4 text-center text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                  Priority Response Guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
