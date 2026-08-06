'use client';

import { useEffect, useState } from 'react';

type TssRenewal = {
  _id: string;
  createdAt: string;
  name: string;
  email: string;
  serialNumber: string;
  source: string;
  status: string;
};

export default function AdminTssRenewalsPage() {
  const [renewals, setRenewals] = useState<TssRenewal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TssRenewal | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tss-renewals');
      const data = await res.json();
      if (Array.isArray(data.renewals)) setRenewals(data.renewals);
    } catch (err) {
      console.error('Error fetching TSS renewals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this renewal request?')) return;
    try {
      const res = await fetch(`/api/admin/tss-renewals?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRenewals(prev => prev.filter(r => r._id !== id));
        if (selected?._id === id) setSelected(null);
      }
    } catch (err) {
      console.error('Error deleting renewal:', err);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/tss-renewals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setRenewals(prev => prev.map(r => r._id === id ? { ...r, status } : r));
        if (selected?._id === id) setSelected(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'contacted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'renewed': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="relative">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006569] mb-2">Admin Support</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">TSS Renewal Requests</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Customers requesting TSS renewal with their serial number.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="rounded-full bg-[#006569] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:shadow-lg hover:shadow-teal-900/15"
        >
          Refresh
        </button>
      </header>

      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Serial Number</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="p-4"><div className="h-8 bg-slate-100 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : renewals.length > 0 ? (
                renewals.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/40 cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                    <td className="p-4 text-[11px] font-semibold text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-[9px] font-medium text-slate-400">
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-900">{r.name}</td>
                    <td className="p-4 text-sm font-medium text-slate-600">{r.email}</td>
                    <td className="p-4 text-sm font-bold text-slate-900 font-mono">{r.serialNumber}</td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        {r.source || 'website'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${statusBadge(r.status)}`}>
                        {r.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="rounded-full p-2 text-slate-300 transition-colors hover:text-rose-500"
                        title="Delete"
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold italic text-slate-400">No renewal requests yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="mt-12 mb-12 flex max-h-[calc(100vh-8rem)] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#006569]">Renewal Request</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 text-slate-400 transition-colors hover:text-slate-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grow space-y-4 overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Email</p>
                  <p className="text-sm font-semibold text-slate-700">{selected.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Serial Number</p>
                  <p className="text-sm font-bold text-slate-900 font-mono">{selected.serialNumber}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Source</p>
                  <p className="text-sm font-semibold text-slate-700">{selected.source || 'website'}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Submitted</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(selected.createdAt).toLocaleDateString()} at{' '}
                    {new Date(selected.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'contacted', 'renewed', 'rejected'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatus(selected._id, s)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                        selected.status === s
                          ? `${statusBadge(s)} border-current`
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6">
              <button onClick={() => setSelected(null)} className="rounded-xl px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-700">
                Close
              </button>
              <a
                href={`mailto:${selected.email}?subject=Your TSS Renewal Request&body=Hi ${selected.name},%0A%0AWe received your TSS renewal request (Serial: ${selected.serialNumber}). Please share the latest pricing to proceed.`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#006569] px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:shadow-lg hover:shadow-teal-900/20"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      <p className="py-8 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
        End of TSS Renewal Log
      </p>
    </div>
  );
}
