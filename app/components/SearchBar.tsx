'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="relative w-48 xl:w-64 transition-all duration-300">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Sarvadnya..."
          className="w-full bg-gray-100 border border-[#ffffff] rounded-full py-2 pl-9 pr-4 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ABE4]/50 focus:border-[#00ABE4] transition-all"
        />
        <button 
          type="submit"
          title="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-[#00ABE4] group-focus-within:text-[#00ABE4] transition-colors"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
