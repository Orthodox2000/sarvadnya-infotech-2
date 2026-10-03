'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

export default function CareersSignupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    phone: '',
    experience: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/careers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          dob: formData.dob || undefined,
          gender: formData.gender || undefined,
          experience: formData.experience || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      router.push('/careers');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[38rem] h-[38rem] bg-gradient-to-br from-[#006569]/5 to-[#006569]/10 rounded-full blur-3xl"
          style={{
            animation: mounted ? 'blob-float 20s ease-in-out infinite alternate' : undefined,
          }}
        />
        <div
          className="absolute -bottom-40 -right-32 w-[42rem] h-[42rem] bg-gradient-to-tr from-[#006569]/8 to-teal-200/15 rounded-full blur-3xl"
          style={{
            animation: mounted ? 'blob-float 24s ease-in-out infinite alternate-reverse' : undefined,
            animationDelay: '3s',
          }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E5F4F4] shadow-2xl shadow-[#006569]/5 p-6 md:p-8"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
              transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header */}
            <div
              className="text-center mb-8"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '100ms',
              }}
            >
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F4ED] border border-[#E5F4F4] text-[#006569] text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
                <span className="h-0.5 w-0.5 rounded-full bg-[#006569]" />
                Join Our Team
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Create Your Account
              </h1>
              <p className="text-sm text-slate-500 font-semibold">
                Start your journey with Sarvadnya Infotech
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '200ms',
              }}
            >
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-[#006569] hover:bg-[#006569]/5 transition-all duration-200 active:scale-95"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-[#006569] hover:bg-[#006569]/5 transition-all duration-200 active:scale-95"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* DOB */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                    className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Experience (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full rounded-2xl bg-[#F5F4ED]/60 border border-[#E5F4F4] px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006569]/20 focus:border-[#006569] transition-all duration-300 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70"
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs text-red-600 font-semibold shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest bg-[#006569] text-white shadow-lg shadow-[#006569]/20 hover:shadow-xl hover:shadow-[#006569]/25 hover:scale-[1.01] active:scale-[0.995] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#006569]/30 focus:ring-offset-2"
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
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </span>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#006569] to-[#005559] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>

            {/* Footer */}
            <div
              className="mt-6 text-center space-y-2"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '300ms',
              }}
            >
              <p className="text-xs text-slate-500 font-semibold">
                Already have an account?{' '}
                <Link
                  href="/careers/login"
                  className="text-[#006569] hover:text-[#005559] font-bold underline-offset-4 hover:underline transition-all"
                >
                  Sign In
                </Link>
              </p>
              <p className="text-xs text-slate-400">
                <Link
                  href="/careers"
                  className="hover:text-slate-600 transition-colors underline-offset-4 hover:underline"
                >
                  ← Back to Careers
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes blob-float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -15px) scale(1.05);
          }
          100% {
            transform: translate(-15px, 20px) scale(0.98);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}