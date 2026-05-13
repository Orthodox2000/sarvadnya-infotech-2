'use client';

import React from 'react';

const newsItems = [
  "New TallyPrime v7.0 Released with Advanced AI Features!",
  "Sarvadnya Infotech LLP Awarded Top Certified Partner 2026.",
  "E-Invoicing Limits Reduced: Stay Compliant with TallyPrime.",
  "Upcoming Webinar: Optimizing Your Supply Chain with Tally Custom Modules.",
  "Seamless WhatsApp Integration now available for all Tally users."
];

export default function NewsFeed() {
  return (
    <div className="relative w-full max-w-full bg-[#0f0529] py-3 overflow-hidden border-y border-white/10">
      {/* Label Section */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-r from-[#0f0529] via-[#0f0529] to-transparent px-6 pr-12">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white">
            News
          </span>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="w-full overflow-x-clip [contain:paint]">
        <div className="flex w-max whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {/* First set of items */}
          <div className="flex items-center gap-12 px-4 shrink-0">
            {newsItems.map((item, index) => (
              <div key={`news-1-${index}`} className="flex items-center gap-3">
                <span className="text-[10px] md:text-xs font-bold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] md:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-default drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 px-4 shrink-0">
            {newsItems.map((item, index) => (
              <div key={`news-2-${index}`} className="flex items-center gap-3">
                <span className="text-[10px] md:text-xs font-bold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] md:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-default drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
