'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'core':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-5 1h1m4 0h1m-5 4h1m4 0h1" />
        </svg>
      );
    case 'cloud':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case 'custom':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'support':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    default:
      return null;
  }
};

interface QuickAccessLink {
  label: string;
  href: string;
}

interface QuickAccessTheme {
  accent: string;
  bg: string;
  text: string;
  hoverBg: string;
}

interface QuickAccessCategory {
  title: string;
  description: string;
  iconName: string;
  theme: QuickAccessTheme;
  links: QuickAccessLink[];
}

export default function QuickAccessHub() {
  const categories: QuickAccessCategory[] = [
    {
      title: "Core Services",
      description: "Fundamental Tally solutions to streamline your accounting and business processes.",
      iconName: "core",
      theme: { accent: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600", hoverBg: "hover:bg-blue-600" },
      links: [
        { label: "Tally Prime", href: "/products/tally-prime" },
        { label: "AMC", href: "/services/amc" },
        { label: "Training", href: "/services/corporate-training" },
        { label: "TSS", href: "/services/tss" }
      ]
    },
    {
      title: "Cloud Access",
      description: "Anytime, anywhere secure access to your Tally data with our robust cloud hosting.",
      iconName: "cloud",
      theme: { accent: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600", hoverBg: "hover:bg-indigo-600" },
      links: [
        { label: "Cloud Hosting", href: "/cloud" },
        { label: "Mobile App", href: "/services/mobile-app-biz" },
        { label: "Remote Access", href: "/cloud#remote" },
        { label: "Data Security", href: "/cloud#security" }
      ]
    },
    {
      title: "Custom Modules",
      description: "Tailored TDL solutions and vertical specific modules built for your unique industry.",
      iconName: "custom",
      theme: { accent: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-600", hoverBg: "hover:bg-purple-600" },
      links: [
        { label: "Logistics", href: "/modules#logistics" },
        { label: "Retail", href: "/modules#retail" },
        { label: "Housing", href: "/modules#housing" },
        { label: "Import Utility", href: "/modules#excel" }
      ]
    },
    {
      title: "Expert Support",
      description: "Priority technical assistance and troubleshooting from our certified experts.",
      iconName: "support",
      theme: { accent: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", hoverBg: "hover:bg-emerald-600" },
      links: [
        { label: "Priority Help", href: "/contact" },
        { label: "WhatsApp", href: "https://wa.me/919876543210" },
        { label: "TDL Support", href: "/services/tdl" },
        { label: "GST Help", href: "/services/amc#gst" }
      ]
    }
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null;

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
                  {getIcon(cat.iconName)}
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
