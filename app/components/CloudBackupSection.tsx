'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CloudBackupSection = () => {
  const features = [
    {
      title: "AWS Cloud Infrastructure",
      desc: "Leverage the power of Amazon Web Services for 100% uptime and global scalability.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-5 1h1m4 0h1m-5 4h1m4 0h1" />
        </svg>
      ),
      tag: "Scalable"
    },
    {
      title: "NoSky Performance",
      desc: "Optimized Tally hosting on NoSky for lightning-fast speeds and zero latency.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      tag: "High Speed"
    },
    {
      title: "Automated Backups",
      desc: "Scheduled, encrypted backups with TallyDrive ensuring zero data loss, ever.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        </svg>
      ),
      tag: "Secure"
    }
  ];

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="space-y-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] block mb-4">
                Enterprise Ecosystem
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-6">
                Reliable Cloud & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] to-[#00ABE4]">Zero-Loss Backup</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Modernize your TallyPrime experience with our certified cloud solutions. From Official AWS hosting to automated TallyDrive backups, we keep your business running 24/7.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {features.map((f, i) => (
                <div key={i} className="group flex gap-6 p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#0371a3] shadow-sm group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{f.title}</h3>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#E9F1FA] text-[#0371a3] tracking-widest">{f.tag}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/cloud"
                className="inline-flex h-14 px-10 items-center justify-center rounded-2xl bg-[#131921] text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
              >
                Explore Cloud Solutions
              </Link>
            </div>
          </div>

          {/* Right Side: Visual Mosaic */}
          <div className="relative">
            <div className="relative aspect-square w-full max-w-[540px] mx-auto">
              
              {/* Main Cloud Server Image (Intelligent Fit) */}
              <div className="absolute top-0 left-[5%] w-[85%] h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] z-20 transform -rotate-3 hover:rotate-0 transition-all duration-700 bg-white">
                 <Image 
                   src="/hero/dedicated-to-cloud-hosting.jpg" 
                   alt="Backdrop" 
                   fill 
                   className="object-cover opacity-20 blur-xl scale-110"
                 />
                 <div className="absolute inset-8">
                    <Image 
                      src="/hero/dedicated-to-cloud-hosting.jpg" 
                      alt="Dedicated Cloud Hosting" 
                      fill 
                      className="object-contain"
                    />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                 <div className="absolute bottom-8 left-8">
                    <p className="text-white font-black text-xl tracking-tight">Dedicated Server</p>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Enterprise Ready</p>
                 </div>
              </div>

              {/* AWS Satellite */}
              <div className="absolute -top-4 -right-4 w-[40%] aspect-square rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl z-30 bg-white p-6 transform rotate-6 hover:rotate-0 transition-transform duration-700">
                <Image 
                  src="/hero/AWS.png" 
                  alt="Amazon Web Services" 
                  fill 
                  className="object-contain p-8"
                />
              </div>

              {/* NoSky Satellite */}
              <div className="absolute -bottom-8 right-8 w-[45%] h-[25%] rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl z-30 bg-[#131921] p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-700 flex items-center justify-center">
                 <div className="relative w-full h-full">
                    <Image 
                      src="/hero/brand-nosky-1779439419186.webp" 
                      alt="NoSky Cloud" 
                      fill 
                      className="object-contain"
                    />
                 </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#0371a3]/10 via-[#00ABE4]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CloudBackupSection;
