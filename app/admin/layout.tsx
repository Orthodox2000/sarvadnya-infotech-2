'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Mobile Header with Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 text-white flex items-center justify-between px-6 z-[100] shadow-xl border-b border-white/5">
        <h2 className="text-xl font-black tracking-tighter">
          ADMIN<span className="text-[#00ABE4]">PANEL</span>
        </h2>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-[#00ABE4]/20 rounded-xl transition-all"
          aria-label="Open Sidebar"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-grow p-4 md:p-8 pt-20 lg:pt-8 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
