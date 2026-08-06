'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DESTINATION_CATEGORIES, FORM_DESTINATIONS, KNOWN_DESTINATION_KEYS } from '@/lib/form-destinations';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type QueueStats = {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  dead: number;
  total: number;
  oldestPendingAt: string | null;
};

export default function AdminEmailConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sender, setSender] = useState('');
  const [destinations, setDestinations] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [settingsRes, queueRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/email/queue'),
      ]);
      const settingsData = await settingsRes.json();
      const queueData = await queueRes.json();

      if (settingsData?.error) throw new Error(settingsData.error);

      const settingsMap = new Map<string, string>(
        (settingsData as { key: string; value: string }[]).map((s) => [s.key, s.value])
      );

      setSender(settingsMap.get('RESEND_SENDER_EMAIL') || '');

      let destParsed: Record<string, string> = {};
      try {
        destParsed = JSON.parse(settingsMap.get('EMAIL_DESTINATION_RECIPIENTS') || '{}');
      } catch {
        destParsed = {};
      }
      const nextDest: Record<string, string> = {};
      const destKeys = [...KNOWN_DESTINATION_KEYS, ...Object.keys(destParsed)];
      for (const key of destKeys) {
        nextDest[key] = String(destParsed[key] || '');
      }
      setDestinations(nextDest);

      if (queueData?.stats) setStats(queueData.stats);
      if (Array.isArray(queueData?.recent)) setRecent(queueData.recent);
    } catch (err) {
      console.error('Failed to fetch email config:', err);
      setMessage({ text: 'Failed to load configuration.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateAll = (): string | null => {
    if (!sender || !EMAIL_RE.test(sender.trim())) {
      return 'Sender email address is invalid or empty.';
    }
    for (const key of Object.keys(destinations)) {
      const raw = destinations[key] || '';
      const emails = raw.split(',').map((e) => e.trim()).filter(Boolean);
      if (emails.some((e) => !EMAIL_RE.test(e))) {
        return `"${key}" contains an invalid email address.`;
      }
    }
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validateAll();
    if (invalid) {
      setMessage({ text: invalid, type: 'error' });
      return;
    }

    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const cleanDest: Record<string, string> = {};
      for (const key of Object.keys(destinations)) {
        cleanDest[key] = destinations[key]?.trim() || '';
      }
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'RESEND_SENDER_EMAIL', value: sender.trim() },
            { key: 'EMAIL_DESTINATION_RECIPIENTS', value: JSON.stringify(cleanDest, null, 2) },
          ],
        }),
      });
      const data = await response.json();
      if (data?.error) throw new Error(data.error);
      setMessage({ text: 'Email configuration saved successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to save email configuration.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleProcessNow = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/email/process?batch=10');
      const data = await res.json();
      if (data?.error) throw new Error(data.error);
      await fetchData();
      setMessage({
        text: `Retry run done: ${data.sent} sent, ${data.failed} failed, ${data.dead} dead.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to retry sends.', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-600',
      processing: 'bg-blue-50 text-blue-600',
      sent: 'bg-teal-50 text-teal-600',
      failed: 'bg-orange-50 text-orange-600',
      dead: 'bg-red-50 text-red-600',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status] || 'bg-slate-100 text-slate-500'}`}>
        {status}
      </span>
    );
  };

  const renderDestinationInput = ({ key, label }: { key: string; label: string }, pathText?: string) => (
    <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <span className="text-[10px] text-slate-400 font-mono font-medium">({key})</span>
      </div>
      {pathText && <p className="text-[10px] text-slate-400 font-medium mb-2">{pathText}</p>}
      <input
        type="text"
        className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0371a3]/30 focus:border-[#0371a3] text-sm"
        placeholder="name@company.com (comma-separated)"
        value={destinations[key] || ''}
        onChange={(e) => setDestinations((prev) => ({ ...prev, [key]: e.target.value }))}
      />
    </div>
  );

  const customKeys = Object.keys(destinations).filter((k) => !KNOWN_DESTINATION_KEYS.includes(k));

  if (loading) return <div className="text-center py-10">Loading email configuration...</div>;

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Email Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">
          Choose who receives the internal copy of each form. Every form on a page sends its email to that page's
          receiver, grouped by enquiry type below — set a receiver and save, leave blank to disable that page's email.
        </p>
      </header>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold leading-relaxed">
        ⚠️ Resend accounts have a limited monthly email quota. Emails are sent <strong>directly</strong> on form
        submission — one per submission, deduplicated by request ID. Failed sends are recorded in the ledger below and
        can be retried from here; sent/failed jobs are auto-purged after 30 days.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Config form */}
        <form onSubmit={handleSave} className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#0371a3]">1 · Sender Address</h2>
            <input
              type="text"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0371a3]"
              placeholder="webenquiry@en.sarvadnyainfotech.com"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 font-medium">
              Must be on a domain verified in Resend (SPF + DKIM). Stored as RESEND_SENDER_EMAIL — all internal emails
              are sent from this address.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#0371a3] mb-1">2 · Recipients by Page</h2>
              <p className="text-[10px] text-slate-400 font-medium mb-5">
                Each page's forms (modal + sidebar enquiry) email only the receiver set below. Blank = no email for that
                page (opt-in). Multiple addresses can be comma-separated.
              </p>

              {DESTINATION_CATEGORIES.map(({ key: categoryKey, label: categoryLabel, description }) => {
                const categoryDestinations = FORM_DESTINATIONS.filter((d) => d.category === categoryKey);
                if (categoryDestinations.length === 0) return null;
                return (
                  <div key={categoryKey} className="mb-8 last:mb-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{categoryLabel}</h3>
                      <span className="text-[10px] font-bold text-slate-300">{categoryDestinations.length} pages</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mb-3">{description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryDestinations.map((d) =>
                        renderDestinationInput(d, d.paths.length ? `Pages: ${d.paths.join(', ')}` : undefined)
                      )}
                    </div>
                  </div>
                );
              })}

              {customKeys.length > 0 && (
                <div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Custom / Unassigned</h3>
                    <span className="text-[10px] font-bold text-slate-300">{customKeys.length} keys</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customKeys.map((key) =>
                      renderDestinationInput({ key, label: `Custom (${key})` })
                    )}
                  </div>
                </div>
              )}

              <p className="mt-4 text-[10px] text-slate-400 font-medium">
                Stored as EMAIL_DESTINATION_RECIPIENTS (JSON) and read from the database on every submission — recipients
                are resolved server-side only, so clients can never change who receives emails. Submissions from a page
                with no receiver are still saved but produce no email.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#0371a3] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Email Configuration'}
            </button>
          </div>
        </form>

        {/* Send ledger panel */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-[#0371a3] mb-4">Send Ledger</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pending', value: stats?.pending ?? 0, color: 'text-amber-600' },
                { label: 'Processing', value: stats?.processing ?? 0, color: 'text-blue-600' },
                { label: 'Sent', value: stats?.sent ?? 0, color: 'text-teal-600' },
                { label: 'Failed', value: stats?.failed ?? 0, color: 'text-orange-600' },
                { label: 'Dead', value: stats?.dead ?? 0, color: 'text-red-600' },
                { label: 'Total', value: stats?.total ?? 0, color: 'text-slate-900' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className={`text-2xl font-black ${item.color}`}>{item.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleProcessNow}
            disabled={processing}
            className="w-full bg-[#006569] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
          >
            {processing ? 'Retrying...' : 'Retry Failed Sends'}
          </button>
          <p className="text-[10px] text-slate-400 font-medium text-center">
            New submissions send their email instantly — no cron needed. This button only retries the small set of
            sends that failed; an external scheduler (GitHub Actions / Upstash QStash) can also drive it.
          </p>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Jobs</h3>
            {recent.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No jobs yet.</p>
            ) : (
              <div className="space-y-2">
                {recent.map((job) => (
                  <div key={job.jobKey} className="flex items-center justify-between gap-2 bg-slate-50 rounded-xl px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{job.formType}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {job.recipients.join(', ')} · {job.attempts}/{job.maxAttempts} attempts
                      </div>
                    </div>
                    {statusBadge(job.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
