'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/careers/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5F4F4] p-6 shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-slate-900 mb-4">Forgot Password</h1>
        {sent ? (
          <p className="text-sm text-slate-600 mb-4">
            If an account exists for <strong>{email}</strong>, you will receive an OTP to reset your password.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/50 px-4 py-2.5 text-sm"
                placeholder="you@example.com"
              />
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 rounded-xl bg-[#006569] text-white text-xs font-black uppercase tracking-widest"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}
        <div className="mt-4 text-center text-xs">
          <Link href="/careers" className="text-[#006569] font-bold">Back to Careers</Link>
        </div>
      </div>
    </div>
  );
}