'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import QuickSupportModal from '../components/QuickSupportModal';

export default function DemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative h-[60dvh] md:h-[80dvh] w-full overflow-hidden bg-white">
      <QuickSupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Background Image Container */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 aspect-[16/9] w-full max-w-4xl h-1/2 md:h-[50dvh] z-0">
        <Image
          src="/sa.png"
          alt="Sarvadnya Alternative Background"
          fill
          className="object-cover opacity-90"
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col items-center max-md:justify-start max-md:pt-3 md:justify-center px-6 text-center">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 md:h-[30dvh] md:flex md:flex-col md:justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0f0529]/60">
            Certified Tally Partner
          </p>
          
          <h1 className="mt-2 md:mt-4 font-sans text-[36px] md:text-[50px] lg:text-[60px] font-black leading-[1.05] text-[#0f0529] tracking-tight">
            Experience <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              Tally Excellence
            </span>
          </h1>
          
          <p className="mt-3 md:mt-4 mx-auto max-w-2xl text-[10px] md:text-sm leading-relaxed text-slate-600">
            Stop waiting for help. Experience the "Never Deny Service" difference with instant priority support and specialized industry modules.
          </p>

          <div className="mt-4 md:mt-6 flex justify-center">
            <Link
              href="/products#compare"
              className="group relative flex h-10 md:h-12 items-center justify-center overflow-hidden rounded-full bg-[#7338a0] px-8 md:px-10 text-[10px] md:text-xs font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Compare Features</span>
              <div className="absolute inset-0 z-0 translate-y-full bg-[#4a2574] transition-transform group-hover:translate-y-0" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </main>
  );
}
