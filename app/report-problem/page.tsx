'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';

type ReportForm = {
  name: string;
  contact: string;
  pageUrl: string;
  issueType: string;
  description: string;
};

const issueOptions = [
  { value: 'broken-link', label: 'Broken link' },
  { value: 'form-issue', label: 'Form issue' },
  { value: 'content-mismatch', label: 'Wrong content' },
  { value: 'layout-issue', label: 'Layout issue' },
  { value: 'other', label: 'Other' }
];

const initialForm: ReportForm = {
  name: '',
  contact: '',
  pageUrl: '',
  issueType: 'other',
  description: ''
};

export default function ReportProblemPage() {
  const [form, setForm] = useState<ReportForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      pageUrl: window.location.href
    }));
  }, []);

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'info@sarvadnyainfotech.com';
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '9821309060';

  const updateField = (field: keyof ReportForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/problem-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit report');
      }

      setSuccess(true);
      setForm({
        ...initialForm,
        pageUrl: window.location.href
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#0371a3] mb-2">Support</p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">Report a Problem</h1>
           <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Tell us what went wrong — no technical details needed. We&apos;ll figure out the rest.
            </p>
        </div>
        <Link
          href="/"
          className="shrink-0 px-4 py-2 rounded-full border border-slate-200 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#0371a3] hover:border-sky-200 bg-white transition-colors"
        >
          Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-6">
        <section className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-5 sm:p-6">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Name <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span></span>
                  <input
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-300 focus:bg-white"
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Contact <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span></span>
                  <input
                    value={form.contact}
                    onChange={(e) => updateField('contact', e.target.value)}
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-300 focus:bg-white"
                    placeholder="Email or phone so we can reach you"
                  />
                </label>

                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Issue Type</span>
                  <select
                    value={form.issueType}
                    onChange={(e) => updateField('issueType', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-300 focus:bg-white"
                  >
                    {issueOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Page / Link <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span></span>
                  <input
                    value={form.pageUrl}
                    onChange={(e) => updateField('pageUrl', e.target.value)}
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-300 focus:bg-white"
                    placeholder="Paste the page URL where the issue happened"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">What happened?</span>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                  rows={7}
                  className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-300 focus:bg-white resize-none"
                  placeholder="Tell us what you expected, what happened, and any steps to reproduce it."
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-[11px] text-slate-400 font-medium">
                  This report is reviewed by the admin team after submission.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0371a3] px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white transition-all hover:shadow-lg hover:shadow-sky-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Submit Report'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-start gap-5 py-4 sm:py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report submitted</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">
                  Thanks. Your report is now waiting in the admin panel for review.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 transition-colors hover:border-sky-200 hover:text-[#0371a3]"
              >
                Submit another report
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 mb-3">Need help faster?</p>
            <div className="space-y-3">
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-sky-200 hover:text-[#0371a3] transition-colors"
              >
                <span>Email support</span>
                <span className="text-[11px] text-slate-400">{supportEmail}</span>
              </a>
              <a
                href={`tel:${supportPhone}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-sky-200 hover:text-[#0371a3] transition-colors"
              >
                <span>Call support</span>
                <span className="text-[11px] text-slate-400">{supportPhone}</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
