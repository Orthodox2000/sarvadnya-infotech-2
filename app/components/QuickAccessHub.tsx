'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithCache } from "@/lib/client-api";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'core':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-5 1h1m4 0h1m-5 4h1m4 0h1" />
        </svg>
      );
    case 'cloud':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case 'custom':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'support':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'education':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.083 0 01.665-6.479L12 14z" />
        </svg>
      );
    case 'global':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'consultancy':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'whatsapp':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
  border: string;
}

interface QuickAccessCategory {
  title: string;
  description: string;
  iconName: string;
  theme: QuickAccessTheme;
  links: QuickAccessLink[];
}

export default function QuickAccessHub({ 
  initialData, 
  initialModules, 
  initialSettings 
}: { 
  initialData?: QuickAccessCategory[], 
  initialModules?: any[],
  initialSettings?: any
}) {
  const [settings, setSettings] = useState<any>(initialSettings || null);
  const [dynamicModules, setDynamicModules] = useState<any[]>(initialModules || []);
  const [dbCategories, setDbCategories] = useState<QuickAccessCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData && !initialModules && !initialSettings);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        },
        { threshold: 0.1 }
    );

    const section = document.getElementById('quick-access-hub');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (initialData && initialModules && initialSettings) return;
    const fetchData = async () => {
      try {
        const [settingsData, modulesData, catData] = await Promise.all([
          fetchWithCache('/api/settings'),
          fetchWithCache('/api/modules'),
          fetchWithCache('/api/content?section=home_quick_access')
        ]);
        
        if (settingsData && !settingsData.error) setSettings(settingsData);
        if (Array.isArray(modulesData)) setDynamicModules(modulesData);
        if (Array.isArray(catData) && catData.length > 0) setDbCategories(catData);
      } catch (err) {
        console.error('Failed to fetch data for QuickAccessHub:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialData, initialModules, initialSettings]);

  const formatPhoneDisplay = (phone: string) => {
      const cleaned = phone.trim();
      if (cleaned.startsWith('+')) return cleaned;
      if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
      if (cleaned.length === 10) return `+91${cleaned}`;
      return cleaned;
  };

  const supportPhone = settings?.support_phone || "9821309060";
  const whatsappPhone = settings?.whatsapp_phone || supportPhone;

  const defaultCategories: QuickAccessCategory[] = [
    {
      title: "Core Services",
      description: "Fundamental Tally solutions to streamline accounting.",
      iconName: "core",
      theme: { accent: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600", hoverBg: "hover:bg-blue-600", border: "border-blue-100" },
      links: [
        { label: "Tally Prime", href: "/products/tally-prime" },
        { label: "AMC", href: "/services/amc" },
        { label: "Training", href: "/services/corporate-training" },
        { label: "TSS", href: "/services/tss" }
      ]
    },
    {
      title: "Cloud Access",
      description: "Anytime secure access to your Tally data.",
      iconName: "cloud",
      theme: { accent: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600", hoverBg: "hover:bg-indigo-600", border: "border-indigo-100" },
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
      theme: { accent: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-600", hoverBg: "hover:bg-purple-600", border: "border-purple-100" },
      links: dynamicModules.length > 0 
        ? dynamicModules.map(m => ({ label: m.title, href: `/modules?id=${m._id}` }))
        : [
            { label: "Logistics & Transport", href: "/modules#logistics" },
            { label: "Retail & Garment", href: "/modules#retail" },
            { label: "Housing Societies", href: "/modules#housing" },
            { label: "Excel to Tally Tool", href: "/modules#excel" },
            { label: "C&F Agencies", href: "/modules#cf" },
            { label: "Sales Commission", href: "/modules#sales" }
          ]
    },
    {
      title: "Technical Support",
      description: "Priority technical assistance and troubleshooting.",
      iconName: "support",
      theme: { accent: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", hoverBg: "hover:bg-emerald-600", border: "border-emerald-100" },
      links: [
        { label: "Priority Help", href: "/contact" },
        { label: "WhatsApp", href: `https://wa.me/${whatsappPhone.replace(/\D/g, '')}` },
        { label: "TDL Support", href: "/services/tdl" },
        { label: "GST Help", href: "/services/amc#gst" }
      ]
    }
  ];

  const categories = dbCategories.length > 0 ? dbCategories : defaultCategories;

  if (loading) return <div className="w-full h-96 bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <section id="quick-access-hub" className="w-full bg-white py-16 md:py-24 px-5 border-y border-[#E9F1FA]">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Header - Compact */}
        <div className={`flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-[#E9F1FA] pb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-xl text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] block mb-2">
              Solutions Directory
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter mb-2 leading-tight">
              Quick Access <span className="text-[#0371a3]/50">Hub</span>
            </h2>
            <p className="text-[13px] text-slate-500 font-bold leading-relaxed max-w-lg opacity-80">
              Complete Sarvadnya ecosystem. A unified dashboard designed for professional business management and instant technical support.
            </p>
          </div>
          <Link 
            href="/contact"
            className="inline-flex h-12 px-10 items-center justify-center rounded-full bg-[#0371a3] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#00ABE4] transition-all active:scale-95 shadow-xl shadow-[#0371a3]/20"
          >
            Get Professional Help Now
          </Link>
        </div>

        {/* Custom Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Column 1: Core & Cloud (Stacked vertical lists) */}
          <div className={`flex flex-col gap-6 md:col-span-1 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {categories.slice(0, 2).map((cat, idx) => (
              <div key={idx} className="group flex flex-col bg-white rounded-[2rem] p-8 border border-[#E9F1FA] hover:shadow-2xl hover:shadow-[#0371a3]/5 transition-all duration-500 relative overflow-hidden h-full hover:bg-[#f0f9ff]">
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-[#0371a3]`} />
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#E9F1FA] text-[#0371a3] transition-colors duration-500 group-hover:scale-110`}>
                    {getIcon(cat.iconName)}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{cat.title}</h3>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed mb-8 font-bold opacity-70">{cat.description}</p>
                
                <div className="flex flex-col gap-2 mt-auto">
                  {cat.links.map((link, li) => (
                    <Link key={li} href={link.href} className="flex items-center justify-between group/link px-5 py-4 rounded-2xl bg-white border border-[#E9F1FA] text-[13px] font-black text-slate-800 hover:text-white hover:bg-[#0371a3] hover:border-[#0371a3] transition-all duration-300 shadow-sm">
                      <span className="truncate mr-4">{link.label}</span>
                      <svg className="w-5 h-5 opacity-0 group-hover/link:opacity-100 transition-opacity -translate-x-2 group-hover/link:translate-x-0 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Custom Modules (Full Height Stack) */}
          <div className={`md:col-span-1 h-full transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {categories[2] && (
              <div className="group flex flex-col bg-white rounded-[2.5rem] p-8 border border-[#E9F1FA] hover:shadow-2xl hover:shadow-[#0371a3]/10 transition-all duration-500 relative overflow-hidden h-full min-h-[500px] hover:bg-[#f0f9ff]">
                <div className={`absolute top-0 left-0 w-full h-2 bg-[#0371a3]`} />
                <div className="flex flex-col items-center text-center mb-10 shrink-0 pt-2">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center bg-[#E9F1FA] text-[#0371a3] shadow-inner mb-6 transition-transform duration-500 group-hover:scale-110`}>
                    {getIcon(categories[2].iconName)}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter mb-3 leading-none">{categories[2].title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-bold opacity-70 px-3">{categories[2].description}</p>
                </div>
                
                <div className="flex-1 space-y-3 pb-8">
                  {categories[2].links.map((link, li) => (
                    <Link key={li} href={link.href} className="flex items-center justify-between group/link px-6 py-5 rounded-2xl bg-white border border-[#E9F1FA] text-[13px] font-black text-slate-800 hover:text-white hover:bg-[#0371a3] hover:border-[#0371a3] transition-all duration-300 shadow-sm">
                      <span className="truncate mr-4">{link.label}</span>
                      <svg className="w-5 h-5 opacity-0 group-hover/link:opacity-100 transition-opacity -translate-x-2 group-hover/link:translate-x-0 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-auto pt-8 border-t border-[#E9F1FA] text-center shrink-0">
                  <Link href="/modules" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] hover:text-[#00ABE4] transition-colors inline-flex items-center gap-2">
                    Explore All Industrial Modules 
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Expert Support (Full Height Stack) */}
          <div className={`md:col-span-1 h-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {categories[3] && (
              <div className="group flex flex-col bg-white rounded-[2rem] p-8 border border-[#E9F1FA] hover:shadow-2xl hover:shadow-[#0371a3]/5 transition-all duration-500 relative overflow-hidden h-full min-h-[500px] hover:bg-[#f0f9ff]">
                <div className={`absolute top-0 right-0 w-2 h-full bg-[#0371a3]`} />
                <div className="flex items-center gap-5 mb-8 shrink-0">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-[#E9F1FA] text-[#0371a3] transition-colors duration-500 group-hover:rotate-12`}>
                    {getIcon(categories[3].iconName)}
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1.5">{categories[3].title}</h3>
                    <p className="text-[11px] text-[#0371a3] font-black uppercase tracking-widest">Priority Access</p>
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-8 font-bold opacity-70 shrink-0">{categories[3].description}</p>
                
                <div className="flex-1 space-y-3 pb-8">
                  {categories[3].links.map((link, li) => (
                    <Link key={li} href={link.href} className="flex items-center justify-between group/link px-6 py-5 rounded-2xl bg-white border border-[#E9F1FA] text-[13px] font-black text-slate-800 hover:text-white hover:bg-[#0371a3] hover:border-[#0371a3] transition-all duration-300 shadow-sm">
                      <span className="truncate mr-4">{link.label}</span>
                      <svg className="w-5 h-5 opacity-0 group-hover/link:opacity-100 transition-opacity -translate-x-2 group-hover/link:translate-x-0 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto shrink-0">
                  <div className="bg-[#f0f9ff] rounded-[1.5rem] p-6 border border-[#0371a3]/10 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#E9F1FA]/50 rounded-full blur-2xl" />
                    <p className="text-[10px] font-black text-[#0371a3] uppercase tracking-widest mb-2.5 relative z-10">Instant Callback</p>
                    <p className="text-2xl font-black text-slate-900 mb-5 relative z-10">{formatPhoneDisplay(supportPhone.split(',')[0])}</p>
                    <Link href="/contact" className="inline-block px-10 py-3 rounded-full bg-[#0371a3] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00ABE4] transition-all hover:scale-105 shadow-xl shadow-[#0371a3]/20 relative z-10">
                      Request Call Now
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Extra Sections */}
        {categories.length > 4 && (
          <div className={`mt-16 pt-12 border-t border-[#E9F1FA] transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Extended Business Capabilities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(4).map((cat, i) => (
                <div key={i} className="group p-6 bg-white rounded-[1.5rem] border border-[#E9F1FA] hover:shadow-xl transition-all duration-500 flex flex-col gap-4 hover:bg-[#f0f9ff]">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#E9F1FA] border border-[#E9F1FA] shadow-sm text-[#0371a3] group-hover:scale-110 transition-transform`}>{getIcon(cat.iconName)}</div>
                     <span className="text-base font-black text-slate-900 tracking-tight">{cat.title}</span>
                  </div>
                  <div className="space-y-2">
                    {cat.links.slice(0, 3).map((link, li) => (
                      <Link key={li} href={link.href} className="flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-[#0371a3] transition-colors">
                        {link.label}
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
