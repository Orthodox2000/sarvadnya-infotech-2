'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeroPolygonLeft from './hero-polygon-left'
import HeroPolygonRight from './hero-polygon-right'
import QuickSupportModal from './QuickSupportModal';

export default function SplitScreenLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <div className="hero-glass-panel pointer-events-auto w-full max-w-[15.5rem] rounded-[22px] p-3 text-white shadow-[0_20px_60px_rgba(15,23,42,0.28)] lg:max-w-[16.5rem] lg:p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-100/90">
                Quick Support
              </p>
              <h2 className="mt-1.5 text-lg font-semibold leading-tight">
                Request a callback
              </h2>
              <p className="mt-1 text-[11px] leading-[1.15rem] text-violet-50/95"> 
                Share your details and our team will call you back with the right service path.
              </p>

              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  className="hero-glass-input w-full rounded-[16px] px-3 py-2 text-xs text-white placeholder:text-white/72 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="hero-glass-input w-full rounded-[16px] px-3 py-2 text-xs text-white placeholder:text-white/72 focus:outline-none"
                />
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-[16px] bg-white/24 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm transition-colors duration-200 hover:bg-white/30"
                >
                  Send Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
