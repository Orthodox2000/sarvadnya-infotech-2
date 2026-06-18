'use client';

import React, { useEffect, useState } from 'react';

type Application = {
  _id: string;
  createdAt: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience: string;
  resume_url: string;
  message: string;
};

export default function AdminResponses() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      
      if (data && data.error) throw new Error(data.error);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const openResume = (url: string) => {
    if (!url) {
      alert('Resume URL not found.');
      return;
    }
    window.open(url, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
        const res = await fetch(`/api/admin/applications?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setApplications(prev => prev.filter(a => a._id !== id));
            if (selectedApp?._id === id) setSelectedApp(null);
        }
    } catch (error) {
        console.error('Error deleting application:', error);
    }
  };

  // Helper to render empty rows
  const renderEmptyRows = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <tr key={`empty-${i}`} className="border-b border-slate-50 opacity-30">
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32 animate-pulse"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-40 animate-pulse"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-20 animate-pulse"></div></td>
        <td className="p-4 text-right"><div className="h-4 bg-slate-100 rounded w-16 ml-auto animate-pulse"></div></td>
      </tr>
    ));
  };

  return (
    <div className="relative">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Applications</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Review and manage candidates who applied via the website.</p>
        </div>
        <button 
            onClick={fetchApplications}
            className="bg-[#0371a3] text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:shadow-lg transition-all flex items-center gap-2"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Applicant</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Title</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Exp.</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderEmptyRows(5)
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr 
                    key={app._id} 
                    className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <td className="p-4 text-[11px] font-semibold text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-900">{app.full_name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{app.email}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600 italic">
                      {app.job_title}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-[#0371a3] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 uppercase tracking-widest">
                        {app.experience}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openResume(app.resume_url)}
                          className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all"
                        >
                          Resume
                        </button>
                        <button 
                            onClick={() => handleDelete(app._id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            title="Delete Application"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="text-slate-300 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <p className="text-slate-400 font-semibold italic">No applications found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto" onClick={() => setSelectedApp(null)}>
          <div 
            className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 mt-12 mb-12 flex flex-col max-h-[calc(100vh-8rem)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100">
                   <svg className="w-6 h-6 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0371a3] mb-1 block">Applicant Profile</span>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                    {selectedApp.full_name}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
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
                        <span className="text-sm font-semibold text-slate-700 truncate">{selectedApp.email}</span>
                    </div>
                  </div>

                  <div className="group relative">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</p>
                    <div className="flex items-center justify-between bg-sky-50/50 px-4 py-3 rounded-2xl border border-sky-100">
                        <span className="text-sm font-bold text-[#0371a3] tabular-nums">{selectedApp.phone}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Application Date</p>
                    <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                        <p className="text-sm font-semibold text-slate-700">{new Date(selectedApp.createdAt).toLocaleDateString()} at {new Date(selectedApp.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Experience Level</p>
                    <div className="inline-block bg-sky-50 text-[#0371a3] px-4 py-3 rounded-2xl border border-sky-100 text-sm font-bold uppercase tracking-widest">
                      {selectedApp.experience}
                    </div>
                  </div>
               </div>

               <div className="h-px bg-slate-100 w-full"></div>

               <div className="grid grid-cols-1 gap-8">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Targeted Job Role</p>
                        <div className="inline-flex items-center gap-3 bg-[#0371a3] text-white px-5 py-3 rounded-2xl shadow-md shadow-sky-900/10">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="text-sm font-bold tracking-tight">{selectedApp.job_title}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Applicant Message</p>
                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative group min-h-[120px]">
                            <svg className="absolute top-4 right-6 w-10 h-10 text-slate-100 group-hover:text-slate-200 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                            <p className="relative z-10 text-slate-600 text-[15px] leading-relaxed font-medium italic">
                                {selectedApp.message || 'The applicant did not provide a specific cover letter or message.'}
                            </p>
                        </div>
                    </div>
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button 
                   onClick={() => setSelectedApp(null)}
                   className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                >
                   Close Detail
                </button>
                <button 
                   onClick={() => openResume(selectedApp.resume_url)}
                   className="bg-[#0371a3] text-white px-8 py-3 rounded-xl font-bold text-xs hover:shadow-xl transition-all flex items-center gap-2 shadow-lg shadow-sky-900/20"
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   Download Resume
                </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] py-10">
        End of Application Log
      </p>
    </div>
  );
}
