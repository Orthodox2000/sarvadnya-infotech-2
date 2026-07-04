'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="relative w-full lg:w-60 xl:w-80 transition-all duration-300">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search Sarvadnya..."
          className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-[11px] text-[#4A4A4A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#316852]/30 focus:border-[#316852] transition-all"
        />
        <button 
          type="submit"
          title="Search"
          className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-all duration-200 flex items-center gap-1 ${isFocused ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'}`}
        >
          <span className="w-4 h-4 text-gray-400 hover:text-[#316852]">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#316852]">Search</span>
        </button>
      </div>
    </form>
  );
}
