'use client';

import React, { useCallback, useEffect, useState } from 'react';

type Geo = {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
} | null;

type Device = {
  type: string;
  browser: string;
  os: string;
  mobile: boolean;
} | null;

type Visitor = {
  _id: string;
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  visitCount: number;
  pageViews: number;
  entryPath: string;
  lastPath: string;
  referrer: string;
  lastReferrer: string;
  ip: string;
  geo: Geo;
  device: Device;
  secGpc: boolean;
  gpcRespected: boolean;
  paths: { path: string; at: string }[];
  sectionViews: string[];
  userAgent: string;
  language: string;
  screen: string;
  lastFormAt: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type Meta = {
  total: number;
  activeToday: number;
  activeWeek: number;
  newToday: number;
  topCountries: { country: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
};

const PAGE_SIZES = [10, 25, 50];
const MAX_VISIBLE_PAGES = 5;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString();
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(value: string) {
  const d = formatDate(value);
  const t = formatTime(value);
  return t ? `${d} · ${t}` : d;
}

function getPageNumbers(current: number, totalPages: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];
  let start = Math.max(2, current - 1);
  let end = Math.min(totalPages - 1, current + 1);
  if (start > 2) pages.push('ellipsis-start');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('ellipsis-end');
  pages.push(totalPages);
  return pages;
}

function locationLabel(v: Visitor): string {
  if (v.gpcRespected) return 'GPC opt-out';
  const g = v.geo;
  if (!g) return '—';
  return [g.city, g.region, g.country].filter(Boolean).join(', ') || '—';
}

function deviceLabel(d: Device): string {
  if (!d) return '—';
  const extra = d.type !== 'desktop' && d.type !== 'unknown' ? ` · ${d.type}` : '';
  return `${d.browser} · ${d.os}${extra}`;
}

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'lastSeen',
    direction: 'desc'
  });
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Visitor | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 1 });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filterCountry, filterDevice]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy: sortConfig.key,
        sortDir: sortConfig.direction,
      });
      if (filterCountry !== 'all') params.set('country', filterCountry);
      if (filterDevice !== 'all') params.set('device', filterDevice);
      if (debouncedSearch) params.set('q', debouncedSearch);

      const res = await fetch(`/api/admin/visitors?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      if (Array.isArray(data.visitors)) setVisitors(data.visitors);
      if (data.pagination) setPagination(data.pagination);
      if (data.meta) setMeta(data.meta);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load visitors.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortConfig.key, sortConfig.direction, filterCountry, filterDevice, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this visitor session record?')) return;
    try {
      const res = await fetch(`/api/admin/visitors?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Delete failed (${res.status})`);
      if (selectedItem?._id === id) setSelectedItem(null);
      setError(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting visitor:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete visitor.');
    }
  };

  const handleSort = (key: string) => {
    if (sortConfig.key !== key) {
      setSortConfig({ key, direction: 'asc' });
    } else {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(Math.max(1, page), pagination.totalPages),
    }));
  };

  const changeLimit = (limit: number) => {
    setPagination({ page: 1, limit, total: pagination.total, totalPages: 1 });
  };

  const renderEmptyRows = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-10"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-10"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-3 text-right"><div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div></td>
      </tr>
    ));
  };

  const from = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);

  const sortHeader = (key: string, label: string) => (
    <th
      className="p-3 w-[100px] text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
      onClick={() => handleSort(key)}
    >
      {label} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Visitor Data</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Passive identification of browsing sessions (IP, geo, device).</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-[#006569] text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Visitors</p>
          <p className="text-3xl font-black text-slate-900">{loading ? '…' : meta?.total ?? '—'}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Active (24h)</p>
          <p className="text-3xl font-black text-[#006569]">{loading ? '…' : meta?.activeToday ?? '—'}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">New Today</p>
          <p className="text-3xl font-black text-slate-900">{loading ? '…' : meta?.newToday ?? '—'}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Top Country</p>
          <p className="text-lg font-black text-slate-900 truncate">
            {loading || !meta || meta.topCountries.length === 0
              ? '—'
              : meta.topCountries[0].country}
          </p>
          {meta && meta.topCountries.length > 0 && (
            <p className="text-[10px] text-slate-400 font-semibold truncate">
              {meta.topCountries.slice(0, 3).map((t) => `${t.country} (${t.count})`).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Filters:</span>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-[#006569]"
          >
            <option value="all">All Countries</option>
            {(meta?.topCountries || []).map((c) => (
              <option key={c.country} value={c.country}>{c.country}</option>
            ))}
          </select>
          <select
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-[#006569]"
          >
            <option value="all">All Devices</option>
            {['mobile', 'tablet', 'desktop', 'bot', 'unknown'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country / city / ISP / page…"
            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-[#006569] w-full sm:w-64"
          />
        </div>
        <div className="flex items-center gap-3 px-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Show</span>
          <select
            value={pagination.limit}
            onChange={(e) => changeLimit(Number(e.target.value))}
            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-[#006569]"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size} / page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1080px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {sortHeader('lastSeen', 'Last Seen')}
                {sortHeader('firstSeen', 'First Seen')}
                {sortHeader('visitCount', 'Visits')}
                {sortHeader('pageViews', 'Views')}
                <th className="p-3 w-[130px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Country / City</th>
                <th className="p-3 w-[120px] text-[10px] font-bold uppercase tracking-widest text-slate-400">ISP</th>
                <th className="p-3 w-[120px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Device</th>
                <th className="p-3 w-[110px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Page</th>
                <th className="p-3 w-[60px] text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderEmptyRows(8)
              ) : visitors.length > 0 ? (
                visitors.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedItem(v)}
                  >
                    <td className="p-3 text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {formatDateTime(v.lastSeen)}
                        {v.gpcRespected && (
                          <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">GPC</span>
                        )}
                      </div>
                      <span className="text-[9px] opacity-60 font-medium">{v.sessionId}</span>
                    </td>
                    <td className="p-3 text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                      {formatDateTime(v.firstSeen)}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex min-w-[28px] justify-center px-2 py-0.5 rounded-full bg-teal-50 text-[#006569] text-[10px] font-black tabular-nums border border-teal-100">
                        {v.visitCount}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-bold text-slate-700 tabular-nums">{v.pageViews}</td>
                    <td className="p-3 text-[11px] font-medium text-slate-600 truncate max-w-[130px]">
                      {locationLabel(v)}
                    </td>
                    <td className="p-3 text-[11px] font-medium text-slate-600 truncate max-w-[120px]">
                      {v.geo?.isp || '—'}
                    </td>
                    <td className="p-3 text-[11px] font-medium text-slate-600 truncate max-w-[120px]">
                      {deviceLabel(v.device)}
                    </td>
                    <td className="p-3 text-[11px] font-semibold text-[#006569] truncate max-w-[110px]">
                      {v.lastPath}
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(v._id)}
                        disabled={loading}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete Visitor"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-20 text-center">
                    <div className="text-slate-300 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <p className="text-slate-400 font-semibold italic">No visitor sessions found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination footer */}
      {!loading && pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{from}–{to}</span> of{' '}
            <span className="text-slate-900 font-bold">{pagination.total}</span> visitors
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {getPageNumbers(pagination.page, pagination.totalPages).map((item, idx) =>
              item === 'ellipsis-start' || item === 'ellipsis-end' ? (
                <span key={`${item}-${idx}`} className="px-1.5 text-slate-300 font-bold">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item)}
                  disabled={loading}
                  className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-colors ${
                    item === pagination.page
                      ? 'bg-[#006569] text-white shadow-md shadow-teal-900/10'
                      : 'text-slate-500 bg-slate-50 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto" onClick={() => setSelectedItem(null)}>
          <div
            className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 mt-12 mb-12 flex flex-col max-h-[calc(100vh-8rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <svg className="w-6 h-6 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006569] mb-1 block">Visitor Session</span>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{selectedItem.sessionId}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 md:p-10 space-y-10 overflow-y-auto grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">First Seen</p>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700">{formatDateTime(selectedItem.firstSeen)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Last Seen</p>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700">{formatDateTime(selectedItem.lastSeen)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Visits / Page Views</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-3 py-1.5 rounded-xl bg-teal-50 text-[#006569] text-sm font-black border border-teal-100">{selectedItem.visitCount}</span>
                    <span className="text-slate-400 text-xs font-bold">visits</span>
                    <span className="inline-flex px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 text-sm font-black border border-slate-100">{selectedItem.pageViews}</span>
                    <span className="text-slate-400 text-xs font-bold">views</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Referrer</p>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 truncate">{selectedItem.referrer || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">IP (masked)</p>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 tabular-nums">{selectedItem.ip || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Language / Screen</p>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {selectedItem.language || '—'}{selectedItem.screen ? ` · ${selectedItem.screen}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Geo / Connection</p>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  {selectedItem.gpcRespected ? (
                    <p className="text-slate-500 text-sm font-semibold italic">
                      Privacy opt-out respected (Global Privacy Control) — no IP or location collected.
                    </p>
                  ) : selectedItem.geo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="font-semibold text-slate-700">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</span>
                        {[selectedItem.geo.city, selectedItem.geo.region, selectedItem.geo.country].filter(Boolean).join(', ')}
                        <span className="text-slate-400"> ({selectedItem.geo.countryCode})</span>
                      </div>
                      <div className="font-semibold text-slate-700">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Coordinates</span>
                        {selectedItem.geo.latitude}, {selectedItem.geo.longitude}
                      </div>
                      <div className="font-semibold text-slate-700">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">ISP / ASN</span>
                        {selectedItem.geo.isp || '—'} {selectedItem.geo.asn ? `(${selectedItem.geo.asn})` : ''}
                      </div>
                      <div className="font-semibold text-slate-700">
                        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Timezone</span>
                        {selectedItem.geo.timezone || '—'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm font-semibold italic">No geo data available.</p>
                  )}
                </div>
              </div>

              {selectedItem.userAgent && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">User Agent</p>
                  <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-medium text-slate-500 break-words">{selectedItem.userAgent}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Page History <span className="opacity-60">({selectedItem.paths.length})</span>
                </p>
                <div className="bg-slate-50 rounded-[2rem] border border-slate-100 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {selectedItem.paths.length > 0 ? (
                    selectedItem.paths.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 px-6 py-3">
                        <span className="text-xs font-semibold text-[#006569] truncate">{p.path || '/'}</span>
                        <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{formatDateTime(p.at)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="p-6 text-sm text-slate-400 font-medium italic">No page history recorded.</p>
                  )}
                </div>
              </div>

              {selectedItem.sectionViews && selectedItem.sectionViews.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Sections Viewed</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.sectionViews.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-teal-50 text-[#006569] border border-teal-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              {selectedItem.lastFormAt ? (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  ● Converted {formatDateTime(selectedItem.lastFormAt)}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No form conversion</span>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedItem._id)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-all uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && pagination.total === 0 && (
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] py-10">
          End of Visitor Log
        </p>
      )}
    </div>
  );
}
