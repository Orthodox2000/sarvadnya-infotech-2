'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type HealthStatus = {
  status: string;
  mongodb: string;
  timestamp: string;
  version: string;
  mongodb_error?: string;
};

type AdminStats = {
  submissions: number;
  problemReports: number;
  applications: number;
  modules: number;
  learning: number;
  reviews: number;
  news: number;
  partners: number;
  faq: number;
};

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [healthRes, statsRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/admin/stats')
      ]);
      
      const healthData = await healthRes.json();
      const statsData = await statsRes.json();
      
      setHealth(healthData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statGroups = [
    {
      title: 'Leads & Inquiries',
      items: [
        { label: 'Submissions', value: stats?.submissions || 0, href: '/admin/submissions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-blue-50 text-blue-600' },
        { label: 'Problem Reports', value: stats?.problemReports || 0, href: '/admin/problem-reports', icon: 'M12 9v2m0 4h.01M4.75 20h14.5a2.25 2.25 0 001.95-3.38L14.2 4.62a2.25 2.25 0 00-3.9 0L2.8 16.62A2.25 2.25 0 004.75 20z', color: 'bg-amber-50 text-amber-600' },
        { label: 'Applications', value: stats?.applications || 0, href: '/admin/careers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-emerald-50 text-emerald-600' },
      ]
    },
    {
      title: 'Content Assets',
      items: [
        { label: 'Modules', value: stats?.modules || 0, href: '/admin/modules', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z', color: 'bg-purple-50 text-purple-600' },
        { label: 'Learning Resources', value: stats?.learning || 0, href: '/admin/learning', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'bg-orange-50 text-orange-600' },
        { label: 'News Items', value: stats?.news || 0, href: '/admin/news', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', color: 'bg-rose-50 text-rose-600' },
        { label: 'FAQ Items', value: stats?.faq || 0, href: '/admin/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-sky-50 text-sky-600' },
      ]
    },
    {
      title: 'Trust & Partnerships',
      items: [
        { label: 'Reviews', value: stats?.reviews || 0, href: '/admin/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Assets & Partners', value: stats?.partners || 0, href: '/admin/partners', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-indigo-50 text-indigo-600' },
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a]">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time overview of your business infrastructure and content.</p>
        </div>
        
        {/* System Health Compact */}
        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Health</span>
              <button 
                onClick={fetchData}
                disabled={refreshing}
                className={`p-1 rounded-lg transition-all ${refreshing ? 'animate-spin text-slate-300' : 'text-[#0371a3] hover:bg-sky-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-sm font-bold text-slate-700">{loading ? 'Checking...' : health?.status === 'ok' ? 'All Systems Operational' : 'Action Required'}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Database</span>
            <span className={`text-sm font-bold ${health?.mongodb === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? '...' : health?.mongodb || 'Disconnected'}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">App Version</span>
            <span className="text-sm font-bold text-[#0371a3]">{health?.version || 'v1.1.251'}</span>
          </div>
        </div>
      </header>

      <div className="space-y-10">
        {statGroups.map((group, gIdx) => (
          <section key={gIdx}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{group.title}</h2>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.items.map((item, iIdx) => (
                <Link 
                  key={iIdx} 
                  href={item.href}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-150 ${item.color.split(' ')[0]}`}></div>
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`p-3 rounded-2xl ${item.color}`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 text-[#0371a3] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black uppercase tracking-widest">Manage</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-3xl font-black text-[#0f172a] mb-1">
                      {loading ? '...' : item.value}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {health?.mongodb_error && (
        <div className="mt-12 p-6 bg-red-50 rounded-[2rem] border border-red-100 flex items-start gap-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-900 font-bold mb-1">Database Connection Error</h3>
            <p className="text-xs text-red-600 font-mono break-all">{health.mongodb_error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

