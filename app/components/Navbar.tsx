'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchWithCache, prefetchData } from "@/lib/client-api";
import SearchBar from "./SearchBar";

export type SiteSettings = {
  support_phone: string;
  support_email: string;
  office_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  facebook_handle: string;
  instagram_handle: string;
  linkedin_handle: string;
  map_iframe_url: string;
};

export default function Navbar({ initialSettings }: { initialSettings?: any }) {
  const [settings, setSettings] = useState<any>(initialSettings || null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!initialSettings) fetchSettings();
    // Prefetch common data to improve perceived speed and reduce background error rate
    prefetchData('/api/modules');
    prefetchData('/api/content?section=home_hero');
    prefetchData('/api/content?section=home_stats');
  }, [initialSettings]);

  const fetchSettings = async () => {
    try {
      const data = await fetchWithCache('/api/settings');
      if (data && !data.error) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch navbar settings:', err);
    }
  };

    const formatPhoneDisplay = (phone: string) => {
        const cleaned = phone.trim();
        if (cleaned.startsWith('+')) return cleaned;
        if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
        if (cleaned.length === 10) return `+91${cleaned}`;
        return cleaned;
    };

    const supportPhone = settings?.support_phone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || "9821309060";

  const navLinks: { label: string; href: string }[] = [];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Careers', href: '/admin/careers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Modules', href: '/admin/modules', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { label: 'Learning', href: '/admin/learning', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'FAQ', href: '/admin/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Reviews', href: '/admin/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { label: 'News', href: '/admin/news', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: 'Partners', href: '/admin/partners', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Settings', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    // { label: 'Theme Palette', href: '/admin/palette', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a1 1 0 010 2H5v12a2 2 0 002 2h12a2 2 0 002-2V5h-4a1 1 0 010-2h4a2 2 0 012 2v12a4 4 0 01-4 4H7z' },
  ];

  return (
    <header className="relative z-[1000] w-full border-b border-white/5 bg-[#131921] shadow-sm">
      <nav className="mx-auto flex h-12 lg:h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 lg:gap-3 group transition-transform hover:scale-[1.02]"
        >
          <div className="relative block w-20 lg:w-32 h-7 lg:h-12 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
            <Image
              src="/TallyCertificate.png"
              alt="Sarvadnya Infotech logo"
              fill
              sizes="(max-width: 768px) 80px, 128px"
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
          <div className="flex items-center">
            <div className="hidden sm:block w-5 h-5 lg:w-7 lg:h-7 rounded-md overflow-hidden shrink-0 bg-white/10 group-hover:scale-110 transition-transform shadow-sm border border-white/10">
              <Image
                src="/logo.png"
                alt="Sarvadnya Logo"
                width={28}
                height={28}
                className="object-contain w-full h-full brightness-0 invert"
              />
            </div>
            <div className="flex flex-col ml-1 sm:ml-1.5 lg:ml-2 leading-none">
              <span className="text-[11px] lg:text-[15px] font-bold tracking-tight text-white">
                Sarvadnya
              </span>
              <span className="text-[7px] lg:text-[10px] font-medium uppercase tracking-[0.2em] text-sky-400">
                Infotech LLP
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <div className="hidden lg:block">
            <SearchBar />
          </div>
          {/* <Link
            href="/admin/palette"
            className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Palette
          </Link> */}
          <Link
            href="/careers"
            className="inline-flex items-center justify-center rounded-full bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-white border border-white/10 transition-all hover:bg-white/10 shadow-sm"
          >
            Careers
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#00ABE4] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-[#00ABE4]/20 transition-all hover:bg-white hover:text-[#131921] hover:-translate-y-0.5"
          >
            Support
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            className="p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#0371a3]/10 backdrop-blur-sm z-[998]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#f0f9ff] border-b border-[#0371a3]/10 z-[999] transition-all duration-300 overflow-y-auto ${isMenuOpen ? 'max-h-[85vh] opacity-100 py-6 shadow-xl' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="flex flex-col gap-6 px-6">
          {/* Close Button at top of drawer for mobile */}
          <div className="flex justify-end">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#0371a3]/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0371a3] transition-colors shadow-sm"
            >
              <span>Close Menu</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Admin Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0371a3]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3]">Admin Management</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {adminLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 h-12 px-4 rounded-xl border border-[#0371a3]/5 bg-white text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:bg-[#E9F1FA] hover:text-[#0371a3] transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="w-full h-px bg-[#E9F1FA]" />
          
          <div className="flex flex-col gap-3">
            <Link
              href="/careers"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center h-12 rounded-xl border border-[#0371a3]/10 bg-white text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-sm hover:bg-[#E9F1FA]"
            >
              Join Our Team
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center h-12 rounded-xl bg-[#0371a3] text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#0371a3]/20"
            >
              Get Priority Support
            </Link>
          </div>

          <a
            href={`tel:${supportPhone}`}
            className="flex items-center justify-center gap-3 text-slate-500 hover:text-[#0371a3] transition-colors py-2 border border-[#0371a3]/10 rounded-xl bg-white shadow-sm"
          >
            <svg className="w-4 h-4 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1.031.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">{formatPhoneDisplay(supportPhone.split(',')[0])}</span>
          </a>

          {/* Explicit Unexpand Button at very bottom */}
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#0371a3] transition-colors border-t border-[#E9F1FA] mt-4"
          >
            ↑ Collapse Navigation ↑
          </button>
        </div>
      </div>
    </header>
  );
}
