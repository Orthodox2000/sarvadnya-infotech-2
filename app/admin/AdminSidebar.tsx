'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '' },
    { label: 'Careers', href: '/admin/careers', icon: '' },
    { label: 'News', href: '/admin/news', icon: '' },
    { label: 'Pages', href: '/admin/pages', icon: '' },
    { label: 'Settings', href: '/admin/settings', icon: '' },
  ];

  return (
    <aside className="w-64 bg-[#0f0529] text-white min-h-screen p-6 flex flex-col">
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-black tracking-tighter">
          ADMIN<span className="text-indigo-400">PANEL</span>
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
          v1.1.6
        </p>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href
                ? 'bg-[#7338a0] text-white shadow-lg'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
        >
          <span className="font-bold text-sm">Back to Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
