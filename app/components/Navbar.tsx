'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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

// CHANGE: 2026-08-26 — Navbar is fully hardcoded (no /api/settings or DB dependency).
// Removed the settings state/fetch: support_phone helpers were never rendered in the output.
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // CHANGE: 2026-08-24 — Track Productbar visibility to show a small bottom shadow only while it is hidden.
  const [productBarHidden, setProductBarHidden] = useState(false);

  // CHANGE: 2026-08-24 — Listen for Productbar visibility events; shadow appears when it hides, disappears when it returns.
  useEffect(() => {
    const syncShadow = (e: Event) => {
      const visible = (e as CustomEvent<{ visible?: boolean }>).detail?.visible ?? true;
      setProductBarHidden(!visible);
    };
    window.addEventListener('productbar:visibility', syncShadow);
    return () => window.removeEventListener('productbar:visibility', syncShadow);
  }, []);

  // CHANGE: 2026-08-26 — Removed unused navLinks + isActive helpers (active-tab underline removed per user
  // request; Smart Suggest & Careers no longer change style on the current route).

  // CHANGE: 2026-08-26 — Admin links removed for frontend-only deployment.
  // Admin panel lives in a separate deployment. Restore from admin.bak if needed.
  // const adminLinks = [
  //   { label: 'Dashboard', href: '/admin', icon: '...' },
  //   { label: 'Careers', href: '/admin/careers', icon: '...' },
  //   { label: 'Modules', href: '/admin/modules', icon: '...' },
  //   { label: 'Learning', href: '/admin/learning', icon: '...' },
  //   { label: 'FAQ', href: '/admin/faq', icon: '...' },
  //   { label: 'Reviews', href: '/admin/reviews', icon: '...' },
  //   { label: 'News', href: '/admin/news', icon: '...' },
  //   { label: 'Partners', href: '/admin/partners', icon: '...' },
  //   { label: 'Settings', href: '/admin/settings', icon: '...' },
  // ];

  return (
    // CHANGE: 2026-08-24 — Lightened header gradient a second step (near-white cream) + conditional small bottom shadow while Productbar is hidden.
    <header className={`relative z-1000 w-full border-[#E5E2D9] bg-[linear-gradient(90deg,_rgba(254,254,252,1)_0%,_rgba(251,250,246,1)_53%,_rgba(248,247,240,1)_100%)] transition-shadow duration-300 ${productBarHidden ? 'shadow-[0_3px_10px_rgba(0,0,0,0.15)]' : 'shadow-none'}`}>
      <nav className="flex h-10 lg:h-16 w-full max-w-full items-center justify-between pr-3">
        <Link
          href="/"
          className="flex items-center h-full justify-center group transition-transform hover:scale-[1.01]"
        >
          <div className="relative block h-full shrink-0 ml-2 lg:ml-3 opacity-90 group-hover:opacity-100 transition-opacity">
            <Image
              src="/TallyCertificate.png"
              alt="e-consultation logo"
              width={300}
              height={80}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <span className="ml-1.5 text-[12px] sm:text-[16px] lg:text-[18.9px] font-bold leading-tight text-slate-900">
            Sarvadnya <span className="text-[#006569]">Infotech LLP</span>
            <span className="block text-[8.5px] sm:text-[11px] lg:text-[13.5px] font-medium uppercase tracking-widest text-slate-400">Tally Certified Partner</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          <div className="hidden lg:flex items-center">
             <SearchBar />
            </div>

          <Link
            href="/find-solution"
            className="whitespace-nowrap inline-flex items-center justify-center rounded-lg border-[0.5px] px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ease-in-out shadow-sm text-[#006569] border-[#006569] bg-white hover:bg-teal-50"
          >
            <svg className="w-4 h-4 mr-1.5 text-[#006569] shrink-0" fill="currentColor" viewBox="0 0 463.771 463.771">
              <path d="M173.073,349.604c-4.825,0-8.961-3.444-9.835-8.188c-10.587-57.508-20.312-92.657-41.352-113.697 S65.695,196.954,8.189,186.367C3.444,185.493,0,181.357,0,176.532s3.445-8.961,8.189-9.835c57.506-10.586,92.657-20.311,113.697-41.352 s30.765-56.191,41.352-113.697c0.874-4.745,5.01-8.189,9.835-8.189s8.961,3.445,9.835,8.189 c10.586,57.506,20.312,92.657,41.352,113.697c21.041,21.04,56.191,30.765,113.697,41.352 c4.746,0.874,8.189,5.01,8.189,9.835s-3.445,8.961-8.189,9.835c-57.506,10.586-92.656,20.312-113.697,41.352 c-21.04,21.04-30.765,56.191-41.352,113.697C182.034,346.16,177.897,349.604,173.073,349.604z M58.669,176.532 c35.099,8.738,59.633,19.319,77.359,37.044s28.307,42.26,37.044,77.359c8.738-35.099,19.319-59.633,37.044-77.359 s42.261-28.307,77.358-37.044c-35.098-8.738-59.632-19.319-77.358-37.044s-28.307-42.26-37.044-77.359 c-8.738,35.099-19.319,59.633-37.044,77.359S93.768,167.794,58.669,176.532z"/>
              <path d="M350.064,460.312c-4.826,0-8.961-3.444-9.836-8.188c-6.6-35.85-12.584-57.686-25.291-70.393 c-12.709-12.708-34.543-18.692-70.393-25.292c-4.744-0.873-8.188-5.01-8.188-9.834c0-4.826,3.444-8.962,8.188-9.836 c35.85-6.599,57.686-12.584,70.393-25.292s18.691-34.543,25.291-70.392c0.875-4.745,5.012-8.189,9.836-8.189 s8.961,3.445,9.834,8.189c6.602,35.849,12.586,57.686,25.293,70.392c12.707,12.708,34.543,18.693,70.393,25.292 c4.744,0.874,8.188,5.01,8.188,9.836c0,4.824-3.443,8.961-8.188,9.834c-35.85,6.6-57.686,12.584-70.393,25.292 c-12.707,12.707-18.691,34.543-25.293,70.393C359.025,456.868,354.889,460.312,350.064,460.312z M290.773,346.604 c33.689,10.467,48.824,25.602,59.291,59.292c10.465-33.69,25.602-48.825,59.291-59.292 c-33.689-10.466-48.824-25.601-59.291-59.292C339.598,321.003,324.463,336.138,290.773,346.604z"/>
            </svg>
            Smart Suggest
          </Link>
          <Link
            href="/careers"
            className="inline-flex items-center justify-center rounded-lg border-[0.5px] px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ease-in-out shadow-sm text-[#006569] border-[#006569] bg-white hover:bg-teal-50"
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
