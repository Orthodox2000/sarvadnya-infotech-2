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
      <div className="relative w-full lg:w-40 xl:w-60 transition-all duration-300">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search Sarvadnya..."
          className={`w-full bg-white border border-[#006569]/30 rounded-lg text-[11px] text-[#4A4A4A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/30 focus:border-[#006569] transition-all shadow-sm focus:placeholder:text-transparent ${isFocused ? 'pl-9 pr-20' : 'pl-4 pr-20'} py-2`}
        />
        <button 
          type="submit"
          title="Search"
          className={`absolute left-2.5 inset-y-0 flex items-center transition-all duration-200 ${isFocused ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'}`}
        >
          <span className="w-4 h-4 text-[#006569]">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </button>
        <button 
          type="submit"
          className="absolute right-0 inset-y-0 bg-[#006569] text-white rounded-r-md px-3 hover:bg-[#045A57] transition-all shadow-sm flex items-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
