'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  type: string;
  icon: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && !data.error) {
          setResults(data.results || []);
          setSummary(data.summary || null);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Search Header / Hero (Radiant Sky Theme) */}
      <section className="bg-[#f0f8fa] relative pt-12 pb-12 md:pt-16 md:pb-16 px-6 overflow-hidden border-b border-white/5">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Background Effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sky-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
            <span className="flex h-1 w-1 rounded-full bg-slate-400"></span>
            Intelligence Search
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.2)]">Search Results</span>
          </h1>
          <p className="text-slate-600 font-semibold text-sm md:text-lg">
            Showing results for "<span className="text-[#0371a3] font-bold">{query}</span>"
          </p>
        </div>
      </section>

      <div className="flex-fill py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-50 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* AI Summary Section */}
              {summary && results.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 text-slate-900 shadow-xl shadow-sky-900/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform text-[#0371a3] pointer-events-none">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center border border-sky-100">
                        <svg className="w-4 h-4 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3]">Quick AI Overview</span>
                    </div>
                    <p className="text-sm md:text-[15px] font-semibold leading-relaxed text-slate-700 max-w-3xl">
                      {summary.split('\n').map((line, i) => {
                        const parts = line.split(/(\[\[.*?\|.*?\]\])/);
                        return (
                          <span key={i}>
                            {parts.map((part, j) => {
                              if (part.startsWith('[[') && part.endsWith(']]')) {
                                const [label, url] = part.slice(2, -2).split('|');
                                return (
                                  <Link 
                                    key={j}
                                    href={url}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-100 text-[#0371a3] rounded-lg font-bold hover:bg-[#0371a3] hover:text-white transition-all my-1 border border-sky-200 shadow-sm mx-1"
                                  >
                                    <span className="text-[9px] uppercase tracking-wider">{label}</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                  </Link>
                                );
                              }
                              return part;
                            })}
                            {i < summary.split('\n').length - 1 && <br />}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Exact Match Status */}
              {results.length > 0 && !results.some(r => r.title.toLowerCase() === query.toLowerCase()) && (
                <div className="px-6 py-3 rounded-full bg-amber-50 border border-amber-200 inline-flex items-center gap-2 text-amber-700 text-[11px] font-black uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Note: I cannot find an exact match, but here are the most relevant results:
                </div>
              )}

              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((result, idx) => (
                    <Link 
                      key={idx} 
                      href={result.url}
                      className="block bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-[#0371a3]/30 hover:-translate-y-1 transition-all group"
                    >
                      <div className="flex items-start gap-4 md:gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${result.type === 'AI Recommend' ? 'bg-[#0371a3] border-[#0371a3] shadow-lg shadow-sky-900/20' : 'bg-sky-50 border-sky-100 group-hover:bg-[#0371a3] group-hover:border-[#0371a3] group-hover:shadow-lg group-hover:shadow-sky-900/20'}`}>
                          <svg className={`w-7 h-7 transition-colors duration-500 ${result.type === 'AI Recommend' ? 'text-white' : 'text-[#0371a3] group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={result.icon} />
                          </svg>
                        </div>
                        <div className="flex-fill">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${result.type === 'AI Recommend' ? 'bg-[#0371a3] text-white border-[#0371a3] animate-pulse' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-sky-50 group-hover:text-[#0371a3] group-hover:border-sky-100'}`}>
                              {result.type === 'AI Recommend' ? 'Smart Suggestion' : result.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                              Official Solution
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#0371a3] transition-colors leading-tight">
                            {result.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm font-medium">
                            {result.description}
                          </p>
                          <div className="mt-5 flex items-center text-[#0371a3] text-[11px] font-black uppercase tracking-widest gap-2">
                            View Full Details
                            <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 mb-8 border border-slate-100">
                    <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">I cannot find an exact match</h2>
                  <p className="text-slate-500 max-w-sm mx-auto font-semibold mb-10 leading-relaxed">
                    We couldn't find anything matching "{query}". Our support team or AI assistant can help you find exactly what you need.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link 
                        href="/contact"
                        className="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#0371a3] transition-all shadow-xl shadow-slate-200"
                    >
                        Contact Support
                    </Link>
                    <Link 
                        href="/"
                        className="px-10 py-4 bg-[#0371a3] text-white font-black text-xs uppercase tracking-widest rounded-full shadow-xl shadow-sky-900/20 hover:bg-[#00ABE4] transition-all"
                    >
                        Return Home
                    </Link>
                  </div>
                </div>
              )}

              {/* Constant Footer Help (High Contrast CTA) */}
              <div className="mt-20 p-8 md:p-12 rounded-[3rem] bg-slate-950 relative overflow-hidden group">
                {/* Subtle decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-[#0371a3]/10 blur-[120px] pointer-events-none transition-all duration-700 group-hover:bg-[#0371a3]/20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-3">Still can't find what you need?</h4>
                    <p className="text-slate-400 font-medium text-base">Try our AI Chatbot for instant detailed answers about our services.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                    <Link 
                      href="/contact"
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors"
                    >
                      Contact Us
                    </Link>
                    <button 
                      onClick={() => {
                          const btn = document.querySelector('[aria-label="Ask AI"]') as HTMLButtonElement;
                          btn?.click();
                      }}
                      className="px-8 py-4 bg-[#0371a3] text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-2xl shadow-sky-900/30 hover:bg-[#00ABE4] transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Use AI Chatbot
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] py-8">
                Tip: Our AI Assistant is available at the bottom right of every page
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#0371a3] rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
