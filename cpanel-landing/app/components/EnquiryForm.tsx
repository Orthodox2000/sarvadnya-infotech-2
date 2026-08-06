'use client';

import { useState } from 'react';
import { API_BASE } from '@/lib/api';

const SERVICES = [
  'TallyPrime Setup & Licensing',
  'Annual Maintenance Contract (AMC)',
  'Tally on Cloud',
  'TallyDrive Cloud Backup',
  'Tally on WhatsApp',
  'TDL / Custom Modules',
  'HRMS',
  'Corporate Training',
  'Other',
];

const inputClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200';

export default function EnquiryForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: SERVICES[0],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [requestId] = useState(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now())
  );

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/email/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contact: form.phone,
          service: form.service,
          description: form.message,
          formType: 'landing',
          destination: 'contact',
          requestId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server responded with ${res.status}`);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Enquiry received!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Thanks {form.name.split(' ')[0] || 'for reaching out'} — our team will get back to
          you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Name *
          </label>
          <input id="lf-name" required value={form.name} onChange={update('name')} placeholder="Your name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="lf-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Phone *
          </label>
          <input id="lf-phone" required type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 00000 00000" className={inputClasses} />
        </div>
      </div>
      <div>
        <label htmlFor="lf-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Email *
        </label>
        <input id="lf-email" required type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="lf-service" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          I am interested in
        </label>
        <select id="lf-service" value={form.service} onChange={update('service')} className={inputClasses}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lf-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Message
        </label>
        <textarea id="lf-message" rows={3} value={form.message} onChange={update('message')} placeholder="Tell us a little about your requirement…" className={inputClasses} />
      </div>

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
      </button>
      <p className="text-center text-[11px] text-slate-400">
        Your enquiry is saved securely and answered by our team.
      </p>
    </form>
  );
}
