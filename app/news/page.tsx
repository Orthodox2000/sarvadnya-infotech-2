'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsItem } from '@/lib/news';

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/news', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setNewsItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch news:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* Centered Tighter Hero Section */}
      <section className="bg-[#0f0529] pt-8 pb-8 md:pt-12 md:pb-12 px-6 text-center relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-widest mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
            Company Press & Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
            Latest News & Updates
          </h1>
          <p className="text-white/40 text-[10px] md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
            Stay informed about the latest Tally updates, statutory changes, and Sarvadnya Infotech LLP announcements.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <div 
              key={(item as any)._id || item.id} 
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {item.date}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-[#0f0529] mb-4 group-hover:text-[#7338a0] transition-colors leading-tight">
                {item.title}
              </h2>
              
              <div className="flex flex-col gap-3 flex-grow mb-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed italic border-l-2 border-slate-100 pl-4">
                  {item.content}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link 
                  href={item.link}
                  className="inline-flex items-center gap-2 text-[#7338a0] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
