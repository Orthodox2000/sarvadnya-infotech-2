'use client';

import Link from 'next/link';

const PUNCHLINES = [
  "This page ran away faster than your accountant on a Friday evening.",
  "Even Tally can't balance a page that doesn't exist.",
  "404 — This page has less presence than your GST filing deadline reminder.",
  "This page is as missing as your employees' expense bills.",
  "Error 404: Page not found. Unlike your Tally data, which is always backed up.",
  "This URL has been reconciled out of existence.",
  "Your Tally never shows 404. Maybe switch to TallyPrime?",
  "This page is like a GST return — it was never filed.",
];

const punchline = PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] bg-[url('/bg.png')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Large 404 */}
        <div className="relative mb-6">
          <span className="text-[8rem] md:text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#006569] to-[#045A57] opacity-15 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#006569]/10 flex items-center justify-center">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          Page Not Found
        </h1>

        <p className="text-sm md:text-base text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          {punchline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="px-8 py-3 bg-[#006569] text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#045A57] transition-all shadow-lg shadow-teal-900/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 bg-white border border-[#006569] text-[#006569] rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#006569] hover:text-white transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact Us
          </Link>
        </div>

        {/* Contact Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 max-w-sm mx-auto">
          <p className="text-xs font-bold text-[#006569] uppercase tracking-widest mb-3">Still stuck? We can help.</p>
          <div className="space-y-2 text-sm text-slate-600 font-medium">
            <a href="mailto:info@sarvadnyainfotech.com" className="flex items-center justify-center gap-2 hover:text-[#006569] transition-colors">
              <svg className="w-4 h-4 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              info@sarvadnyainfotech.com
            </a>
            <a href="tel:+919821309060" className="flex items-center justify-center gap-2 hover:text-[#006569] transition-colors">
              <svg className="w-4 h-4 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +91 98213 09060
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400 font-medium">
          Sarvadnya Infotech LLP — Trusted by 1,500+ MSMEs since 2008
        </p>
      </div>
    </div>
  );
}
