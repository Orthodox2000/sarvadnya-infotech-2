'use client';

import React, { useEffect, useState } from 'react';

type HealthStatus = {
  status: string;
  mongodb: string;
  timestamp: string;
  version: string;
  mongodb_error?: string;
};

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch health status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-[#0f172a]">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">System overview and health metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900">System Health</h3>
              <button 
                onClick={fetchHealth}
                disabled={refreshing}
                className={`p-1.5 rounded-lg transition-all ${refreshing ? 'animate-spin text-slate-300' : 'text-[#0371a3] hover:bg-sky-50'}`}
                title="Refresh Connection Status"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </button>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              health?.status === 'ok' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {loading ? 'Checking...' : health?.status || 'Offline'}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">MongoDB</span>
              <span className={`font-bold ${health?.mongodb === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {loading ? '...' : health?.mongodb || 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Storage</span>
              <span className="font-bold text-blue-600">
                Mega.nz
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Version</span>
              <span className="font-bold text-[#0371a3]">{health?.version || 'v1.1.6'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Last Check</span>
              <span className="text-slate-400">
                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>

          {health?.mongodb_error && (
            <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
              <p className="text-[10px] text-red-600 font-mono break-all">Mongo: {health.mongodb_error}</p>
            </div>
          )}
        </div>

        {/* Quick Stats Placeholder */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Content Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Careers</p>
              <p className="text-2xl font-black text-[#0f172a]">3</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">News</p>
              <p className="text-2xl font-black text-[#0f172a]">5</p>
            </div>
          </div>
        </div>

        {/* Recent Actions Placeholder */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#0371a3]"></div>
                <p className="text-slate-600">Admin panel initialized</p>
                <span className="ml-auto text-slate-400">Just now</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

