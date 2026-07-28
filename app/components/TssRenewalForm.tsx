'use client';

import { useState } from 'react';

type Props = {
  variant?: 'default' | 'compact' | 'inline';
  source?: string;
};

export default function TssRenewalForm({ variant = 'default', source = 'website' }: Props) {
  const [serialNumber, setSerialNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/tss-renewal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber, name, email, source })
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', message: data.error || 'Something went wrong' });
        return;
      }

      setResult({ type: 'success', message: 'Request submitted! We will contact you shortly.' });
      setSerialNumber('');
      setName('');
      setEmail('');
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-3">Renew Your TSS</h3>
        {result && (
          <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-semibold ${result.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input type="text" placeholder="Serial Number *" required value={serialNumber} onChange={e => setSerialNumber(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6E62]/30 focus:border-[#4A6E62]" />
          <input type="text" placeholder="Your Name *" required value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6E62]/30 focus:border-[#4A6E62]" />
          <input type="email" placeholder="Email Address *" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6E62]/30 focus:border-[#4A6E62]" />
          <button type="submit" disabled={submitting}
            className="w-full px-4 py-2.5 bg-[#4A6E62] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#5D887A] transition-all disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Renew Now'}
          </button>
        </form>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        {result && (
          <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-semibold ${result.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {result.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
          <input type="text" placeholder="Serial Number *" required value={serialNumber} onChange={e => setSerialNumber(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2 text-xs rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" />
          <input type="text" placeholder="Your Name *" required value={name} onChange={e => setName(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2 text-xs rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" />
          <input type="email" placeholder="Email *" required value={email} onChange={e => setEmail(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2 text-xs rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" />
          <button type="submit" disabled={submitting}
            className="px-6 py-2 bg-white text-[#4A6E62] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 transition-all disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Renew Now'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto">
      <h3 className="text-lg font-black text-slate-900 mb-1">Renew Your TSS</h3>
      <p className="text-slate-500 text-xs font-medium mb-5">Enter your details and we will process your renewal.</p>
      {result && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${result.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {result.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Serial Number</label>
          <input type="text" required value={serialNumber} onChange={e => setSerialNumber(e.target.value)}
            placeholder="Enter your TSS serial number"
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6E62]/30 focus:border-[#4A6E62] transition-all" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6E62]/30 focus:border-[#4A6E62] transition-all" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address *</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6E62]/30 focus:border-[#4A6E62] transition-all" />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full px-6 py-3.5 bg-[#4A6E62] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#5D887A] transition-all shadow-lg shadow-[#4A6E62]/20 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Submitting...' : 'Renew Now'}
        </button>
      </form>
    </div>
  );
}
