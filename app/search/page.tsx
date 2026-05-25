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
        setResults(data);
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <div className="flex-fill py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Search Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              Search Results
            </h1>
            <p className="text-slate-500 font-medium">
              Showing results for "<span className="text-indigo-600 font-bold">{query}</span>"
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-3xl border border-slate-200">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {results.map((result, idx) => (
                <Link 
                  key={idx} 
                  href={result.url}
                  className="block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500/30 hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${result.type === 'AI Recommend' ? 'bg-indigo-600 border-indigo-600' : 'bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-600 group-hover:border-indigo-600'}`}>
                      <svg className={`w-6 h-6 transition-colors ${result.type === 'AI Recommend' ? 'text-white' : 'text-indigo-600 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={result.icon} />
                      </svg>
                    </div>
                    <div className="flex-fill">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${result.type === 'AI Recommend' ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                          {result.type === 'AI Recommend' ? 'Smart Suggestion' : result.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          Sarvadnya Official
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {result.description}
                      </p>
                      <div className="mt-4 flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest gap-2">
                        View Details
                        <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">No results found</h2>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">
                We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.
              </p>
              <Link 
                href="/"
                className="inline-block mt-8 px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors"
              >
                Return Home
              </Link>
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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
