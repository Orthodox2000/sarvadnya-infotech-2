'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  {
    title: "Tally Core",
    description: "Official TallyPrime solutions for diverse business needs.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-5 1h1m4 0h1m-5 4h1m4 0h1" />
      </svg>
    ),
    links: [
      { label: "Silver", href: "/products#compare" },
      { label: "Gold", href: "/products#compare" },
      { label: "Server", href: "/products#compare" },
      { label: "Renewal", href: "/products#tss" }
    ],
    theme: {
      bg: "bg-indigo-50",
      accent: "bg-indigo-500",
      text: "text-indigo-600",
      hoverBg: "hover:bg-indigo-600",
      hoverBorder: "hover:border-indigo-200"
    }
  },
  {
    title: "Cloud & Data",
    description: "Secure hosting and automated cloud backup services.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    links: [
      { label: "AWS Tally", href: "/products#cloud" },
      { label: "Windows", href: "/products#cloud" },
      { label: "NoSky", href: "/services#nosky-backup" },
      { label: "Recovery", href: "/contact" }
    ],
    theme: {
      bg: "bg-blue-50",
      accent: "bg-blue-500",
      text: "text-blue-600",
      hoverBg: "hover:bg-blue-600",
      hoverBorder: "hover:border-blue-200"
    }
  },
  {
    title: "Customization",
    description: "Tailored vertical modules for specific industries.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    links: [
      { label: "C&F Agency", href: "/products#modules" },
      { label: "Transport", href: "/products#modules" },
      { label: "Society", href: "/products#modules" },
      { label: "Garment", href: "/products#modules" },
      { label: "Sales", href: "/products#modules" },
      { label: "Excel Tool", href: "/products#modules" }
    ],
    theme: {
      bg: "bg-emerald-50",
      accent: "bg-emerald-500",
      text: "text-emerald-600",
      hoverBg: "hover:bg-emerald-600",
      hoverBorder: "hover:border-emerald-200"
    }
  },
  {
    title: "Support",
    description: "Certified expert technical help and staff training.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    links: [
      { label: "AMC Plan", href: "/services/amc" },
      { label: "Staff Training", href: "/contact" },
      { label: "Mobile App", href: "/services#biz-analyst" },
      { label: "WhatsApp", href: "/services#whatsapp" }
    ],
    theme: {
      bg: "bg-purple-50",
      accent: "bg-purple-500",
      text: "text-purple-600",
      hoverBg: "hover:bg-purple-600",
      hoverBorder: "hover:border-purple-200"
    }
  }
];

export default function QuickAccessHub() {
  return (
    <section className="w-full bg-slate-50 py-10 md:py-14 px-4 overflow-hidden border-y border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-center md:text-left px-2">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#0f0529] tracking-tight">
              Quick Access <span className="text-indigo-600">Hub</span>
            </h2>
            <p className="text-[13px] md:text-sm text-slate-500 font-medium opacity-80">
              Complete Tally ecosystem in one compact view.
            </p>
          </div>
          <Link 
            href="/contact" 
            className="h-10 px-6 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
          >
            Get Free Consultation
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={`group flex flex-col bg-white rounded-2xl p-5 border border-slate-200 hover:border-transparent hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden`}
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 w-full h-1 ${cat.theme.accent}`} />

              {/* Outer Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.theme.bg} ${cat.theme.text} transition-colors duration-300`}>
                  {cat.icon}
                </div>
                <h3 className="text-[15px] font-bold text-[#0f0529] tracking-tight">{cat.title}</h3>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-medium opacity-70 px-0.5">
                {cat.description}
              </p>

              {/* Inner Card Container */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  {cat.links.map((link, li) => (
                    <Link 
                      key={li} 
                      href={link.href}
                      className={`flex items-center justify-center h-8 px-2 rounded-md bg-white text-[10px] font-bold text-slate-600 hover:text-white ${cat.theme.hoverBg} border border-slate-200 shadow-sm transition-all duration-200 text-center truncate`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
