'use client';

import { useState } from 'react';
import HeroPolygonLeft from './hero-polygon-left'
import HeroPolygonRight from './hero-polygon-right'
import Link from 'next/link'
import QuickSupportModal from './QuickSupportModal';

export default function SplitScreenHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex min-h-[calc(100svh-7rem)] w-full items-stretch justify-start bg-[#fbf5ec]">
      <QuickSupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <section className="relative min-h-[calc(100svh-7rem)] w-full overflow-hidden border-b border-slate-200 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="relative min-h-[26rem] sm:min-h-[30rem] md:min-h-[calc(100svh-7rem)] flex flex-col items-center justify-center text-center px-6">
          <HeroPolygonLeft />
          <HeroPolygonRight />

          <div className="relative z-20 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#7338a0] sm:text-[0.8rem]">
              Certified Tally Partner
            </p>
            <h1 className="mt-4 font-sans text-[2rem] font-black leading-[1.1] text-[#0f0529] sm:text-[3rem] md:text-[4rem] tracking-tight">
              Tally Excellence & <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Priority Support
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[0.85rem] leading-relaxed text-[#4a2574]/80 sm:text-[1rem] md:text-[1.1rem]">
              Stop waiting for help. Experience the "Never Deny Service" difference with instant priority support and specialized industry modules tailored for your growth.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products#compare"
                className="group relative flex h-12 items-center justify-center overflow-hidden rounded-full bg-[#7338a0] px-10 text-xs font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Compare Features</span>
                <div className="absolute inset-0 z-0 translate-y-full bg-[#4a2574] transition-transform group-hover:translate-y-0" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex h-12 items-center justify-center rounded-full border border-[#7338a0]/20 bg-white px-10 text-xs font-bold text-[#7338a0] transition-all hover:bg-[#fbf5ec] active:scale-95"
              >
                Request Callback
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
