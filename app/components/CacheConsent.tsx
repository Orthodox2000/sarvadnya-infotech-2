'use client';

import { useState, useEffect } from 'react';

export default function CacheConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // We check if the user has already seen the message in this session
    const hasSeen = sessionStorage.getItem('cache-consent-seen');
    if (!hasSeen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('cache-consent-seen', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[5000] max-w-[280px] animate-in slide-in-from-left-4 fade-in duration-500">
      <div className="bg-[#0f0529]/95 backdrop-blur-md text-white p-5 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-[11px] font-bold leading-relaxed tracking-tight text-slate-200">
              By using this website, you accept our use of <span className="text-white">data caching</span> for an optimized experience.
            </p>
          </div>
          <button 
            onClick={() => {
              setVisible(false);
              sessionStorage.setItem('cache-consent-seen', 'true');
            }}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
}
