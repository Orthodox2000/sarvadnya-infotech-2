'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  {
    title: "Tally Core",
    description: "Official TallyPrime solutions for every business size.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-5 1h1m4 0h1m-5 4h1m4 0h1" />
      </svg>
    ),
    links: [
      { label: "TallyPrime Silver", href: "/products#compare" },
      { label: "TallyPrime Gold", href: "/products#compare" },
      { label: "TallyPrime Server", href: "/products#compare" }
    ],
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Cloud",
    description: "Secure AWS, Windows & Specialized backup solutions.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    links: [
      { label: "AWS Cloud", href: "/products#cloud" },
      { label: "Windows Cloud", href: "/products#cloud" },
      { label: "NoSky Backup", href: "/services#nosky-backup" }
    ],
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Custom Modules",
    description: "Tailored logic for C&F, Transport, Garments, etc.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    links: [
      { label: "C&F Agency", href: "/products#modules" },
      { label: "Transport", href: "/products#modules" },
      { label: "Housing", href: "/products#modules" },
      { label: "Gas Agency", href: "/products#modules" },
      { label: "Garments", href: "/products#modules" },
      { label: "Excel Tool", href: "/products#modules" }
    ],
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Support",
    description: "Certified troubleshooting and expert maintenance.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    links: [
      { label: "AMC Plans", href: "/services#amc" },
      { label: "TSS Renew", href: "/services#amc" },
      { label: "Help Desk", href: "/contact" },
      { label: "Training", href: "/contact" }
    ],
    color: "bg-purple-50 text-purple-600"
  }
];

export default function QuickReference() {
  return (
    <section className="w-full bg-[var(--background-color)] py-12 md:py-16 px-6 border-b border-[var(--primary-color)]/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-12 text-left">
          <h2 className="text-2xl md:text-3xl font-black md:font-bold text-[var(--heading-color)] mb-2 md:mb-3 tracking-tight">Quick Access Hub</h2>
          <p className="text-sm md:text-base text-[var(--para-color)] opacity-70 max-w-2xl">
            Explore our complete ecosystem of Tally solutions and professional services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className="flex flex-col bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--primary-color)]/5 hover:border-[var(--primary-color)]/20 transition-all duration-300 h-full group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl ${cat.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-sm md:text-[15px] font-black md:font-semibold text-[var(--heading-color)] uppercase tracking-tight md:tracking-normal">{cat.title}</h3>
                </div>
                
                <p className="text-[12px] md:text-[13px] text-[var(--para-color)] opacity-60 mb-6 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                {cat.links.map((link, li) => (
                  <Link 
                    key={li} 
                    href={link.href}
                    className="flex items-center justify-center h-9 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl bg-[var(--background-color)] text-[10px] md:text-[11px] font-black md:font-medium text-[var(--heading-light-color)] uppercase md:capitalize tracking-wider md:tracking-normal hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300 border border-[var(--primary-color)]/5 hover:border-transparent text-center shadow-sm active:scale-95"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
