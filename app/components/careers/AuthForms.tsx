'use client';

import { useState } from 'react';

interface AuthFormsProps {
  onSuccess: (user: any) => void;
}

export function AuthForms({ onSuccess }: AuthFormsProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = mode === 'login' ? '/api/auth/careers/login' : '/api/auth/careers/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      setSuccess(mode === 'login' ? 'Login successful!' : 'Account created successfully!');
      onSuccess(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5F4F4] p-5 md:p-6 shadow-sm">
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => {
            setMode('login');
            setError(null);
            setSuccess(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.995] focus:outline-none focus:ring-2 focus:ring-[#006569]/20 ${
            mode === 'login'
              ? 'bg-[#006569] text-white shadow-sm shadow-[#006569]/10'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => {
            setMode('signup');
            setError(null);
            setSuccess(null);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.995] focus:outline-none focus:ring-2 focus:ring-[#006569]/20 ${
            mode === 'signup'
              ? 'bg-[#006569] text-white shadow-sm shadow-[#006569]/10'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl bg-[#F5F4ED]/50 border border-[#E5F4F4] px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/60"
              placeholder="John Doe"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Email *
          </label>
          <input
            required
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl bg-[#F5F4ED]/50 border border-[#E5F4F4] px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/60"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Password *
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl bg-[#F5F4ED]/50 border border-[#E5F4F4] px-4 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/60"
              placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-[#006569] hover:bg-[#006569]/5 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
              className="w-full rounded-xl bg-[#F5F4ED]/50 border border-[#E5F4F4] px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/60"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs text-red-600 font-semibold shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-700 font-semibold shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-1">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full mt-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#006569] text-white shadow-lg shadow-[#006569]/15 hover:shadow-xl hover:shadow-[#006569]/20 hover:scale-[1.01] active:scale-[0.995] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#006569]/30 focus:ring-offset-1"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Please wait...
              </>
            ) : (
              <>{mode === 'login' ? 'Login' : 'Sign Up'}</>
            )}
          </span>
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#006569] to-[#005559] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>
    </div>
  );
}
