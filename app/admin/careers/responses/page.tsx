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
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Job Applications</h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage candidates who applied via the website.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Title</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Exp.</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderEmptyRows(5)
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-900">{app.full_name}</div>
                      <div className="text-[10px] text-slate-400">{app.email}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {app.job_title}
                    </td>
                    <td className="p-4 text-xs font-bold text-[#0371a3] bg-sky-50 rounded-lg inline-block my-3 ml-4">
                      {app.experience}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openResume(app.resume_url)}
                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#0371a3] text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        Resume
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                renderEmptyRows(8)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
