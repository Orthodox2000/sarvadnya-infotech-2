'use client';

import React, { useEffect, useState } from 'react';

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

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      if (data.submissions) setSubmissions(data.submissions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...submissions]
    .filter(s => filterType === 'all' || s.formType === filterType)
    .sort((a: any, b: any) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const getFormTypeBadge = (type: string) => {
    const colors: any = {
      quote: 'bg-amber-50 text-amber-600 border-amber-100',
      enquire: 'bg-blue-50 text-blue-600 border-blue-100',
      support: 'bg-rose-50 text-rose-600 border-rose-100',
      callback: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      demo: 'bg-violet-50 text-violet-600 border-violet-100',
      general: 'bg-slate-50 text-slate-600 border-slate-100'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${colors[type] || colors.general}`}>
        {type}
      </span>
    );
  };

  const renderEmptyRows = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
        <td className="p-4 text-right"><div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div></td>
      </tr>
    ));
  };

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
                className="bg-[#0371a3] text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:shadow-lg transition-all flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh
            </button>
        </div>
      </header>

      <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Filter By Type:</span>
         <div className="flex flex-wrap gap-2">
            {['all', 'quote', 'enquire', 'support', 'callback', 'demo', 'general'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${filterType === type ? 'bg-[#0371a3] border-[#0371a3] text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
              >
                {type}
              </button>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                    className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('createdAt')}
                >
                  Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                    className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('name')}
                >
                  Contact Person {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                    className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('contact')}
                >
                  Phone Number {sortConfig.key === 'contact' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                    className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('formType')}
                >
                  Type {sortConfig.key === 'formType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                    className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('service')}
                >
                  Service/Product {sortConfig.key === 'service' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Requirements</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderEmptyRows(8)
              ) : sortedData.length > 0 ? (
                sortedData.map((item: any) => (
                  <tr 
                    key={item._id} 
                    className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="p-4 text-[11px] font-semibold text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()} <br />
                      <span className="text-[9px] opacity-60 font-medium">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-[#0371a3] tabular-nums">{item.contact}</div>
                    </td>
                    <td className="p-4">
                      {getFormTypeBadge(item.formType)}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600 italic">
                      {item.service || '-'}
                    </td>
                    <td className="p-4">
                        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 max-w-xs font-medium">
                            {item.description || 'No additional requirements.'}
                        </p>
                    </td>
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
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
                    <p className="text-slate-400 font-semibold italic">No submissions found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
          <div 
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0371a3] mb-1 block">Submission Detail</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {selectedItem.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 md:p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</p>
                    <p className="text-sm font-semibold text-slate-700">{selectedItem.email}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</p>
                    <p className="text-sm font-bold text-[#0371a3] tabular-nums">{selectedItem.contact}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Submitted On</p>
                    <p className="text-sm font-semibold text-slate-700">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Inquiry Type</p>
                    <div className="flex items-center gap-2">
                      {getFormTypeBadge(selectedItem.formType)}
                    </div>
                  </div>
               </div>

               {selectedItem.service && (
                 <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Service / Product</p>
                    <p className="text-sm font-semibold text-[#0371a3] bg-sky-50 px-4 py-2 rounded-xl inline-block border border-sky-100">
                      {selectedItem.service}
                    </p>
                 </div>
               )}

               <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Additional Requirements</p>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed font-medium">
                    "{selectedItem.description || 'No additional requirements.'}"
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] py-10">
        End of Submission Log
      </p>
    </div>
  );
}
