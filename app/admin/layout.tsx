'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session');
        if (!res.ok) {
          router.replace('/admin/login');
        }
      } catch {
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter text-white">
            ADMIN<span className="text-[#006569]">PANEL</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Mobile Header with Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 text-white flex items-center justify-between px-6 z-[100] shadow-xl border-b border-white/5">
        <h2 className="text-xl font-black tracking-tighter">
          ADMIN<span className="text-[#006569]">PANEL</span>
        </h2>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-[#006569]/20 rounded-xl transition-all"
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
