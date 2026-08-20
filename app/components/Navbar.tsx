'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchWithCache } from "@/lib/client-api";
import SearchBar from "./SearchBar";

export type SiteSettings = {
  support_phone: string;
  support_email: string;
  office_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  facebook_handle: string;
  instagram_handle: string;
  linkedin_handle: string;
  youtube_handle: string;
  map_iframe_url: string;
};

export default function Navbar({ initialSettings }: { initialSettings?: any }) {
  const [settings, setSettings] = useState<any>(initialSettings || null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (!initialSettings) fetchSettings();
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

  const isActive = (href: string) => pathname === href;

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
    <header className="relative z-1000 w-full border-[#E5E2D9] bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)]">
      <nav className="flex h-10 lg:h-16 w-full max-w-full items-center justify-between pr-3">
        <Link
          href="/"
          className="flex items-center h-full justify-center group transition-transform hover:scale-[1.01]"
        >
          <div className="relative block h-full shrink-0 ml-2 lg:ml-3opacity-90 group-hover:opacity-100 transition-opacity">
            <Image
              src="/TallyCertificate.png"
              alt="e-consultation logo"
              width={300}
              height={80}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <span className="ml-1.5 text-[13px] sm:text-[16px] lg:text-[18.9px] font-bold leading-tight text-slate-900">
            Sarvadnya <span className="text-[#006569]">Infotech LLP</span>
            <span className="block text-[9px] sm:text-[11px] lg:text-[13.5px] font-medium uppercase tracking-widest text-slate-400">Certified Tally Partner</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          <div className="hidden lg:flex items-center">
             <SearchBar />
            </div>

          <Link
            href="/find-solution"
            className={`whitespace-nowrap inline-flex items-center justify-center rounded-lg border-[0.5px] px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ease-in-out shadow-sm ${isActive('/find-solution') ? 'text-[#006569] underline underline-offset-8 decoration-[#006569] decoration-2 border-[#006569] bg-white' : 'text-[#006569] border-[#006569] bg-white hover:bg-teal-50'}`}
          >
            <svg className="w-4 h-4 mr-1.5 text-[#006569] shrink-0" fill="currentColor" viewBox="0 0 463.771 463.771">
              <path d="M173.073,349.604c-4.825,0-8.961-3.444-9.835-8.188c-10.587-57.508-20.312-92.657-41.352-113.697 S65.695,196.954,8.189,186.367C3.444,185.493,0,181.357,0,176.532s3.445-8.961,8.189-9.835c57.506-10.586,92.657-20.311,113.697-41.352 s30.765-56.191,41.352-113.697c0.874-4.745,5.01-8.189,9.835-8.189s8.961,3.445,9.835,8.189 c10.586,57.506,20.312,92.657,41.352,113.697c21.041,21.04,56.191,30.765,113.697,41.352 c4.746,0.874,8.189,5.01,8.189,9.835s-3.445,8.961-8.189,9.835c-57.506,10.586-92.656,20.312-113.697,41.352 c-21.04,21.04-30.765,56.191-41.352,113.697C182.034,346.16,177.897,349.604,173.073,349.604z M58.669,176.532 c35.099,8.738,59.633,19.319,77.359,37.044s28.307,42.26,37.044,77.359c8.738-35.099,19.319-59.633,37.044-77.359 s42.261-28.307,77.358-37.044c-35.098-8.738-59.632-19.319-77.358-37.044s-28.307-42.26-37.044-77.359 c-8.738,35.099-19.319,59.633-37.044,77.359S93.768,167.794,58.669,176.532z"/>
              <path d="M350.064,460.312c-4.826,0-8.961-3.444-9.836-8.188c-6.6-35.85-12.584-57.686-25.291-70.393 c-12.709-12.708-34.543-18.692-70.393-25.292c-4.744-0.873-8.188-5.01-8.188-9.834c0-4.826,3.444-8.962,8.188-9.836 c35.85-6.599,57.686-12.584,70.393-25.292s18.691-34.543,25.291-70.392c0.875-4.745,5.012-8.189,9.836-8.189 s8.961,3.445,9.834,8.189c6.602,35.849,12.586,57.686,25.293,70.392c12.707,12.708,34.543,18.693,70.393,25.292 c4.744,0.874,8.188,5.01,8.188,9.836c0,4.824-3.443,8.961-8.188,9.834c-35.85,6.6-57.686,12.584-70.393,25.292 c-12.707,12.707-18.691,34.543-25.293,70.393C359.025,456.868,354.889,460.312,350.064,460.312z M290.773,346.604 c33.689,10.467,48.824,25.602,59.291,59.292c10.465-33.69,25.602-48.825,59.291-59.292 c-33.689-10.466-48.824-25.601-59.291-59.292C339.598,321.003,324.463,336.138,290.773,346.604z"/>
            </svg>
            Smart Suggest
          </Link>
          <Link
            href="/careers"
            className={`inline-flex items-center justify-center rounded-lg border-[0.5px] px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ease-in-out shadow-sm ${isActive('/careers') ? 'text-[#006569] underline underline-offset-8 decoration-[#006569] decoration-2 border-[#006569] bg-white' : 'text-[#006569] border-[#006569] bg-white hover:bg-teal-50'}`}
          >
            Careers
          </Link>
           
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-[#006569] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-[#4B6780]/20 transition-all duration-500 ease-in-out border border-transparent hover:bg-white hover:text-[#006569] hover:border-[#006569]"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            className="p-2 text-[#4A4A4A]/70 hover:text-[#4A4A4A] transition-colors"
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
          className="lg:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-998"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#F7F6F2] border-b border-[#E5E2D9] z-999 transition-all duration-300 overflow-y-auto ${isMenuOpen ? 'max-h-[85vh] opacity-100 py-6 shadow-xl' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="flex flex-col gap-6 px-6">


          {/* Admin Section 
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#006569]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006569]">Admin Management</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {adminLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 h-12 px-4 rounded-xl border border-[#006569]/5 bg-white text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:bg-[#E9F1FA] hover:text-[#006569] transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          */}

          <div className="block lg:hidden bg-white border border-[#E5E2D9] rounded-lg p-2">
            <SearchBar />
          </div>

          <div className="w-full h-px bg-[#E5E2D9]" />

          <div className="flex flex-col gap-3">
         
            <Link
              href="/find-solution"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center h-12 rounded-lg border border-[#E5E2D9] bg-[#F7F6F2] text-[11px] font-black uppercase tracking-widest text-[#4A4A4A] shadow-sm hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-1.5 text-[#006569] shrink-0" fill="currentColor" viewBox="0 0 463.771 463.771">
                <path d="M173.073,349.604c-4.825,0-8.961-3.444-9.835-8.188c-10.587-57.508-20.312-92.657-41.352-113.697 S65.695,196.954,8.189,186.367C3.444,185.493,0,181.357,0,176.532s3.445-8.961,8.189-9.835c57.506-10.586,92.657-20.311,113.697-41.352 s30.765-56.191,41.352-113.697c0.874-4.745,5.01-8.189,9.835-8.189s8.961,3.445,9.835,8.189 c10.586,57.506,20.312,92.657,41.352,113.697c21.041,21.04,56.191,30.765,113.697,41.352 c4.746,0.874,8.189,5.01,8.189,9.835s-3.445,8.961-8.189,9.835c-57.506,10.586-92.656,20.312-113.697,41.352 c-21.04,21.04-30.765,56.191-41.352,113.697C182.034,346.16,177.897,349.604,173.073,349.604z M58.669,176.532 c35.099,8.738,59.633,19.319,77.359,37.044s28.307,42.26,37.044,77.359c8.738-35.099,19.319-59.633,37.044-77.359 s42.261-28.307,77.358-37.044c-35.098-8.738-59.632-19.319-77.358-37.044s-28.307-42.26-37.044-77.359 c-8.738,35.099-19.319,59.633-37.044,77.359S93.768,167.794,58.669,176.532z"/>
                <path d="M350.064,460.312c-4.826,0-8.961-3.444-9.836-8.188c-6.6-35.85-12.584-57.686-25.291-70.393 c-12.709-12.708-34.543-18.692-70.393-25.292c-4.744-0.873-8.188-5.01-8.188-9.834c0-4.826,3.444-8.962,8.188-9.836 c35.85-6.599,57.686-12.584,70.393-25.292s18.691-34.543,25.291-70.392c0.875-4.745,5.012-8.189,9.836-8.189 s8.961,3.445,9.834,8.189c6.602,35.849,12.586,57.686,25.293,70.392c12.707,12.708,34.543,18.693,70.393,25.292 c4.744,0.874,8.188,5.01,8.188,9.836c0,4.824-3.443,8.961-8.188,9.834c-35.85,6.6-57.686,12.584-70.393,25.292 c-12.707,12.707-18.691,34.543-25.293,70.393C359.025,456.868,354.889,460.312,350.064,460.312z M290.773,346.604 c33.689,10.467,48.824,25.602,59.291,59.292c10.465-33.69,25.602-48.825,59.291-59.292 c-33.689-10.466-48.824-25.601-59.291-59.292C339.598,321.003,324.463,336.138,290.773,346.604z"/>
              </svg>
            Smart Suggest
            </Link>
            <Link
              href="/careers"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center h-12 rounded-lg border border-[#E5E2D9] bg-[#F7F6F2] text-[11px] font-black uppercase tracking-widest text-[#4A4A4A] shadow-sm hover:bg-gray-50"
            >
              Join Our Team
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center h-12 rounded-lg bg-[#244777] text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#4B6780]/20"
            >
              Get Priority Support
            </Link>
          </div>


          {/* Explicit Unexpand Button at very bottom */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#4A4A4A]/50 hover:text-[#4A4A4A] transition-colors border-t border-gray-200 mt-4"
          >
            ↑ Collapse Navigation ↑
          </button>
        </div>
      </div>
    </header>
  );
}
