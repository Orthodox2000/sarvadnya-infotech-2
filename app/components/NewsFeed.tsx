'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsItem } from '@/lib/news';

export default function NewsFeed() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/admin/news');
        const data = await res.json();
        setNewsItems(data);
      } catch (err) {
        console.error('Failed to fetch news for feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position popover below the item (NewsFeed is at the top)
    setPopoverPos({
      top: rect.bottom + 8,
      left: Math.max(10, Math.min(rect.left, window.innerWidth - 300))
    });
    setHoveredIndex(index);
  };

  const currentNews = hoveredIndex !== null && newsItems.length > 0 ? newsItems[hoveredIndex % newsItems.length] : null;

  if (loading || newsItems.length === 0) {
    return (
      <div className="relative w-full bg-[#0f0529] h-[20px] flex items-center border-b border-white/10 z-[50]">
        <div className="px-6 flex items-center gap-2">
           <div className="h-1.5 w-1.5 rounded-full bg-slate-700 animate-pulse" />
           <div className="h-2 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full bg-[#0f0529] h-[20px] flex items-center border-b border-white/10 group overflow-visible z-[2100]"
    >
      {/* Label Section */}
      <div className="absolute left-0 top-0 bottom-0 z-[1010] flex items-center bg-gradient-to-r from-[#0f0529] via-[#0f0529] to-transparent px-6 pr-12 pointer-events-none">
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
      <div className="w-full overflow-hidden" key={`marquee-${newsItems.length}`}>
        <div className="flex w-max whitespace-nowrap animate-marquee-infinite group-hover:pause-marquee-infinite">
          {/* First set of items */}
          <div className="flex items-center gap-12 px-4 shrink-0">
            {newsItems.map((item, index) => (
              <div
                key={`news-1-${index}`}
                className="flex items-center gap-3 relative group/item"
                onMouseEnter={(e) => handleMouseEnter(e, index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="text-[10px] md:text-xs font-bold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Link
                  href="/news"
                  className="text-[11px] md:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                >
                  {item.title}
                </Link>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 px-4 shrink-0">
            {newsItems.map((item, index) => (
              <div
                key={`news-2-${index}`}
                className="flex items-center gap-3 relative group/item"
                onMouseEnter={(e) => handleMouseEnter(e, index + newsItems.length)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="text-[10px] md:text-xs font-bold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Link
                  href="/news"
                  className="text-[11px] md:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                >
                  {item.title}
                </Link>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Single Fixed Popover - Renders outside the marquee clipping container */}
      {currentNews && (
        <div
          className={`fixed z-[9999] w-72 p-5 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 transition-all duration-300 pointer-events-auto
          ${hoveredIndex !== null ? 'visible opacity-100 translate-y-0 scale-100' : 'invisible opacity-0 -translate-y-2 scale-95'}`}
          style={{
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`
          }}
          onMouseEnter={() => setHoveredIndex(hoveredIndex)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative">
            {/* Arrow pointing up to the NewsFeed bar */}
            <div className="absolute -top-7 left-4 w-4 h-4 bg-white border-t border-l border-slate-100 rotate-45" />
            <p className="text-[13px] text-slate-700 font-bold leading-relaxed mb-4 whitespace-normal">
              {currentNews.description}
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7338a0] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#4a2574] transition-all shadow-lg shadow-indigo-100"
            >
              Read Full Story
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}