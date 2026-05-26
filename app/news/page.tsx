import React from 'react';
import Link from 'next/link';
import { getNews } from '@/lib/mongodb-utils';
import { NewsItem } from '@/lib/news';

export default async function NewsPage() {
  const newsItems: NewsItem[] = await getNews();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Centered Tighter Hero Section */}
      <section className="bg-[#dff0f5] pt-8 pb-8 md:pt-12 md:pb-12 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-white/10 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-sky-200/20 blur-[110px] -ml-24 -mb-24" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-[6px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
            <span className="flex h-0.5 w-0.5 rounded-full bg-slate-400"></span>
            Company Press & Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
            Latest News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">Updates</span>
          </h1>
          <p className="text-slate-600/80 text-[10px] md:text-sm max-w-xl mx-auto leading-relaxed font-semibold">
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#E9F1FA] text-[#0371a3] text-[10px] font-black uppercase tracking-widest rounded-full">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {item.date}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0371a3] transition-colors leading-tight">
                {item.title}
              </h2>
              
              <div className="flex flex-col gap-3 flex-grow mb-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed italic border-l-2 border-slate-200 pl-4">
                  {item.content}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link 
                  href={item.link}
                  className="inline-flex items-center gap-2 text-[#0371a3] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
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
        
        {newsItems.length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No news items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
