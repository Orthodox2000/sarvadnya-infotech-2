'use client';

import { useEffect } from 'react';

const ERROR_PUNCHLINES = [
  "Something broke. Unlike your Tally data, this page didn't back itself up.",
  "Our server took an unscheduled tea break. It'll be back — your Tally never crashed, right?",
  "Even the best Tally implementation hits a glitch sometimes. This is one of those moments.",
  "This error has been logged. Our team is on it faster than your CA on March 31st.",
  "Oops! Something went wrong. But hey, at least your invoices are still safe in Tally.",
  "Technical hiccup — not as painful as a GST notice though.",
];

const punchline = ERROR_PUNCHLINES[Math.floor(Math.random() * ERROR_PUNCHLINES.length)];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fbfaf8] bg-[url('/bg.png')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Warning Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          Something Went Wrong
        </h1>

        <p className="text-sm md:text-base text-slate-500 font-medium mb-4 max-w-md mx-auto leading-relaxed">
          {punchline}
        </p>

        {error.digest && (
          <p className="text-xs text-slate-400 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        {/* Retry Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-[#006569] text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#045A57] transition-all shadow-lg shadow-teal-900/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Contact Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 max-w-sm mx-auto">
          <p className="text-xs font-bold text-[#006569] uppercase tracking-widest mb-3">Need help? Reach out to us.</p>
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
          Sarvadnya Infotech LLP — Your MSME growth partner since 2008
        </p>
      </div>
    </div>
  );
}
