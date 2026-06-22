'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProblemReport = {
  _id: string;
  createdAt: string;
  name: string;
  email: string;
  contact: string;
  pageUrl: string;
  issueType: string;
  description: string;
  status: string;
};

const issueLabelMap: Record<string, string> = {
  'broken-link': 'Broken link',
  'form-issue': 'Form issue',
  'content-mismatch': 'Wrong content',
  'layout-issue': 'Layout issue',
  'login-issue': 'Login issue',
  other: 'Other'
};

export default function AdminProblemReportsPage() {
  const [reports, setReports] = useState<ProblemReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProblemReport | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/problem-reports');
      const data = await response.json();
      if (Array.isArray(data.problemReports)) {
        setReports(data.problemReports);
      }
    } catch (error) {
      console.error('Error fetching problem reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this problem report?')) return;

    try {
      const response = await fetch(`/api/admin/problem-reports?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setReports(prev => prev.filter(report => report._id !== id));
        if (selectedReport?._id === id) setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error deleting problem report:', error);
    }
  };

  const getIssueBadgeClass = (issueType: string) => {
    switch (issueType) {
      case 'broken-link':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'form-issue':
        return 'bg-sky-50 text-[#0371a3] border-sky-100';
      case 'content-mismatch':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'layout-issue':
        return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'login-issue':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const renderedReports = reports;

  const renderEmptyRows = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-28"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
        <td className="p-4 text-right"><div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div></td>
      </tr>
    ));
  };

  return (
    <div className="relative">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-2">Admin Support</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Problem Reports</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review basic error reports submitted from the public form.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3]">
            Endpoint: /api/admin/problem-reports
          </span>
          <Link
            href="/report-problem"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors hover:border-sky-200 hover:text-[#0371a3]"
          >
            View Public Form
          </Link>
          <button
            onClick={fetchData}
            className="rounded-full bg-[#0371a3] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:shadow-lg hover:shadow-sky-900/15"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Issue</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Page</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderEmptyRows(7)
              ) : renderedReports.length > 0 ? (
                renderedReports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/40 cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="p-4 text-[11px] font-semibold text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-[9px] font-medium text-slate-400">
                        {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-900">{report.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{report.email}</div>
                      {report.contact && <div className="text-[10px] text-slate-400 font-medium">{report.contact}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${getIssueBadgeClass(report.issueType)}`}>
                        {issueLabelMap[report.issueType] || 'Other'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="max-w-[220px] truncate text-sm font-medium text-slate-600">
                        {report.pageUrl || 'Not shared'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="max-w-sm truncate text-[12px] leading-relaxed text-slate-500">
                        {report.description || 'No description provided.'}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                        {report.status || 'open'}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="rounded-full p-2 text-slate-300 transition-colors hover:text-rose-500"
                        title="Delete report"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="mb-3 text-slate-300">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01M4.75 20h14.5a2.25 2.25 0 001.95-3.38L14.2 4.62a2.25 2.25 0 00-3.9 0L2.8 16.62A2.25 2.25 0 004.75 20z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold italic text-slate-400">No problem reports yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <div
          className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="mt-12 mb-12 flex max-h-[calc(100vh-8rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#0371a3]">Problem Detail</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{selectedReport.name}</h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-full border border-transparent p-2 text-slate-400 transition-colors hover:border-slate-100 hover:bg-white hover:text-slate-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grow space-y-6 overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Email</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedReport.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                  <p className="text-sm font-semibold text-slate-700">{selectedReport.contact || 'Not shared'}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Issue Type</p>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${getIssueBadgeClass(selectedReport.issueType)}`}>
                    {issueLabelMap[selectedReport.issueType] || 'Other'}
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Submitted</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(selectedReport.createdAt).toLocaleDateString()} at {new Date(selectedReport.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Page / Link</p>
                {selectedReport.pageUrl ? (
                  <a
                    href={selectedReport.pageUrl}
                    target={selectedReport.pageUrl.startsWith('http') ? '_blank' : undefined}
                    rel={selectedReport.pageUrl.startsWith('http') ? 'noreferrer' : undefined}
                    className="break-all text-sm font-semibold text-[#0371a3] hover:underline"
                  >
                    {selectedReport.pageUrl}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-slate-500">Not shared</p>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                <p className="mb-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Description</p>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
                  {selectedReport.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-xl px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-slate-700"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedReport.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0371a3] px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:shadow-lg hover:shadow-sky-900/20"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      <p className="py-8 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
        End of Problem Report Log
      </p>
    </div>
  );
}
