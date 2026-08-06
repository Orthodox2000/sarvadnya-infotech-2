'use client';

import React, { useCallback, useEffect, useState } from 'react';

type Submission = {
  _id: string;
  createdAt: string;
  name: string;
  email: string;
  contact: string;
  service: string;
  description: string;
  formType: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 1 });

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
      if (filterType !== 'all') params.set('formType', filterType);

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      if (Array.isArray(data.submissions)) setSubmissions(data.submissions);
      if (data.pagination) setPagination(data.pagination);
      setExpandedDesc(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortConfig.key, sortConfig.direction, filterType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Delete failed (${res.status})`);

      if (selectedItem?._id === id) setSelectedItem(null);
      setError(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting record:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete record.');
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

  const handleFilter = (type: string) => {
    setFilterType(type);
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

  const getFormTypeBadge = (type: string) => {
    const colors: any = {
      quote: 'bg-amber-50 text-amber-600 border-amber-100',
      enquire: 'bg-teal-50 text-teal-600 border-teal-100',
      support: 'bg-rose-50 text-rose-600 border-rose-100',
      callback: 'bg-teal-50 text-teal-600 border-teal-100',
      demo: 'bg-teal-50 text-[#006569] border-teal-100',
      general: 'bg-slate-50 text-slate-600 border-slate-100'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${colors[type] || colors.general}`}>
        {type || 'unknown'}
      </span>
    );
  };

  const renderEmptyRows = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-3"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
        <td className="p-3 text-right"><div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div></td>
      </tr>
    ));
  };

  const from = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Form Submissions</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage inquiries, demo requests, and support tickets.</p>
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

      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
         <div className="flex items-center gap-4 overflow-x-auto">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Filter By Type:</span>
           <div className="flex flex-wrap gap-2">
              {['all', 'quote', 'enquire', 'support', 'callback', 'demo', 'general'].map(type => (
                <button
                  key={type}
                  onClick={() => handleFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${filterType === type ? 'bg-[#006569] border-[#006569] text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                >
                  {type}
                </button>
              ))}
           </div>
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

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[880px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th
                    className="p-3 w-[110px] text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('createdAt')}
                >
                  Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                    className="p-3 w-[160px] text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('name')}
                >
                  Contact Person {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                    className="p-3 w-[120px] text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('contact')}
                >
                  Phone Number {sortConfig.key === 'contact' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                    className="p-3 w-[90px] text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('formType')}
                >
                  Type {sortConfig.key === 'formType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                    className="p-3 w-[150px] text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('service')}
                >
                  Service/Product {sortConfig.key === 'service' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 w-[140px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Requirements</th>
                <th className="p-3 w-[60px] text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderEmptyRows(8)
              ) : submissions.length > 0 ? (
                submissions.map((item: any) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="p-3 text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)} <br />
                      <span className="text-[9px] opacity-60 font-medium">{formatTime(item.createdAt)}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{item.name || '—'}</div>
                      <div className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{item.email || ''}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-bold text-[#006569] tabular-nums whitespace-nowrap">{item.contact || '—'}</div>
                    </td>
                    <td className="p-3">
                      {getFormTypeBadge(item.formType)}
                    </td>
                    <td className="p-3 text-sm font-medium text-slate-600 italic truncate max-w-[160px]">
                      {item.service || '-'}
                    </td>
                    <td className="p-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDesc(expandedDesc === item._id ? null : item._id);
                          }}
                          className="block w-full text-left group max-w-[140px]"
                        >
                          <p className={`text-[11px] text-slate-500 leading-snug font-medium ${expandedDesc === item._id ? '' : 'line-clamp-1'}`}>
                            {item.description || 'No additional requirements.'}
                          </p>
                          {item.description && item.description.length > 50 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#006569] group-hover:underline">
                              {expandedDesc === item._id ? '− Collapse' : '+ Expand'}
                            </span>
                          )}
                        </button>
                    </td>
                    <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={loading}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete Record"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="text-slate-300 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-slate-400 font-semibold italic">
                      {filterType !== 'all' ? `No ${filterType} submissions found.` : 'No submissions found.'}
                    </p>
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
            <span className="text-slate-900 font-bold">{pagination.total}</span> submissions
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
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100`}>
                   <svg className="w-6 h-6 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006569] mb-1 block">Inquiry Detail</span>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                    {selectedItem.name || 'Untitled Submission'}
                  </h2>
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
               {/* Contact Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group relative">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</p>
                    <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                        <span className="text-sm font-semibold text-slate-700 truncate">{selectedItem.email || '—'}</span>
                    </div>
                  </div>

                  <div className="group relative">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</p>
                    <div className="flex items-center justify-between bg-teal-50/50 px-4 py-3 rounded-2xl border border-teal-100">
                        <span className="text-sm font-bold text-[#006569] tabular-nums">{selectedItem.contact || '—'}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Submission Date</p>
                    <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-700">{formatDate(selectedItem.createdAt)}{formatTime(selectedItem.createdAt) ? ` at ${formatTime(selectedItem.createdAt)}` : ''}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Inquiry Metadata</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getFormTypeBadge(selectedItem.formType)}
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">ID: {selectedItem._id.slice(-8)}</span>
                    </div>
                  </div>
               </div>

               <div className="h-px bg-slate-100 w-full"></div>

               <div className="grid grid-cols-1 gap-8">
                    {selectedItem.service && (
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Targeted Service / Product</p>
                            <div className="inline-flex items-center gap-3 bg-[#006569] text-white px-5 py-3 rounded-2xl shadow-md shadow-teal-900/10">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <span className="text-sm font-bold tracking-tight">{selectedItem.service}</span>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Business Requirements</p>
                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative group min-h-[120px]">
                            <svg className="absolute top-4 right-6 w-10 h-10 text-slate-100 group-hover:text-slate-200 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                            <p className="relative z-10 text-slate-600 text-[15px] leading-relaxed font-medium italic">
                                {selectedItem.description || 'The user did not provide any specific additional requirements or comments.'}
                            </p>
                        </div>
                    </div>
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                   onClick={() => setSelectedItem(null)}
                   className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                >
                   Close Detail
                </button>
                {selectedItem.email && (
                <a
                   href={`mailto:${selectedItem.email}`}
                   className="bg-[#006569] text-white px-8 py-3 rounded-xl font-bold text-xs hover:shadow-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-900/20"
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   Reply via Email
                </a>
                )}
            </div>
          </div>
        </div>
      )}

      {!loading && pagination.total === 0 && (
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] py-10">
          End of Submission Log
        </p>
      )}
    </div>
  );
}
