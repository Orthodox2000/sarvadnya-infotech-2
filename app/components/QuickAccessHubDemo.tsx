'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  {
    title: "Tally Products",
    subtitle: "Core Ecosystem",
    description: "Official TallyPrime editions and managed cloud infrastructure for modern businesses.",
    icon: (
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-5 1h1m4 0h1m-5 4h1m4 0h1" />
    ),
    links: [
      { label: "Silver", href: "/products#compare" },
      { label: "Gold", href: "/products#compare" },
      { label: "Server", href: "/products#compare" },
      { label: "AWS Cloud", href: "/cloud" },
      { label: "Win Cloud", href: "/cloud" },
      { label: "Backup", href: "/cloud" }
    ]
  },
  {
    title: "Custom Modules",
    subtitle: "Verticals",
    description: "Industry-specific extensions designed to automate unique business workflows.",
    icon: (
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
    links: [
      { label: "C&F", href: "/modules" },
      { label: "Society", href: "/modules" },
      { label: "Transport", href: "/modules" },
      { label: "Garment", href: "/modules" },
      { label: "Sales", href: "/modules" },
      { label: "Excel Tool", href: "/modules" }
    ]
  },
  {
    title: "Professional Services",
    subtitle: "Support",
    description: "Certified expert assistance, TDL development, and specialized corporate training.",
    icon: (
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    links: [
      { label: "TSS", href: "/services/tss" },
      { label: "AMC", href: "/services/amc" },
      { label: "Training", href: "/services/corporate-training" },
      { label: "TDL", href: "/services/tdl" },
      { label: "Mobile", href: "/services/mobile-app-biz" },
      { label: "WhatsApp", href: "/services/tally-on-whatsapp" }
    ]
  },
  {
    title: "Learning Center",
    subtitle: "Resources",
    description: "Educational content, interactive webinars, and tutorials to master TallyPrime.",
    icon: (
      <path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    )
  }
];

export default function QuickAccessHubDemo() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Minimalist Professional Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-slate-100 pb-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-3">
              Solutions Directory
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
              Quick Access <span className="text-slate-400">Hub</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Navigate the complete Sarvadnya ecosystem. A unified dashboard designed for professional business management.
            </p>
          </div>
          <Link 
            href="/contact"
            className="hidden md:inline-flex h-12 px-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Get Expert Help
          </Link>
        </div>

        {/* Minimalist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div 
              key={i}
              className="group flex flex-col transition-all duration-300"
            >
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-indigo-600 group-hover:-translate-y-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {cat.icon}
                </svg>
              </div>

              <div className="space-y-1 mb-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600/60">
                  {cat.subtitle}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {cat.title}
                </h3>
              </div>

              <p className="text-slate-500 text-xs leading-relaxed mb-8 font-medium opacity-80">
                {cat.description}
              </p>

              {cat.links && (
                <div className="mt-auto space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {cat.links.map((link, li) => (
                      <Link 
                        key={li} 
                        href={link.href}
                        className="flex items-center justify-center h-10 rounded-xl bg-slate-50/50 border border-slate-100 text-[10px] font-bold text-slate-600 transition-all duration-200 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 text-center"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {!cat.links && (
                <div className="mt-auto flex flex-col gap-2">
                  <Link 
                    href="/tutorials"
                    className="flex items-center justify-center h-10 rounded-xl bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-indigo-700"
                  >
                    Launch Learning
                  </Link>
                  <Link 
                    href="/news"
                    className="flex items-center justify-center h-10 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 transition-all hover:bg-slate-100"
                  >
                    View Updates
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Professional Footer CTA */}
        <div className="mt-20">
          <div className="relative rounded-[3rem] p-10 md:p-14 bg-slate-50 border border-slate-100 overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tighter">
                  Consult with Certified Tally Experts
                </h3>
                <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                  Join 5000+ businesses who have optimized their operations with our custom Tally solutions. We don't just sell software; we build partnerships.
                </p>
              </div>
              <Link 
                href="/contact"
                className="inline-flex h-14 px-12 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100"
              >
                Book Consultation
              </Link>
            </div>
            
            {/* Subtle Accent Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}

