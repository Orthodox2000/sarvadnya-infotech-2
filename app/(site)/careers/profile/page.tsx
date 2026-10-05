'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { ResumeManager } from '@/app/components/careers/ResumeManager';
import { IdCard } from '@/app/components/careers/IdCard';

export default function CareersProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/careers/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // CHANGE: 2026-10-05 — was '/careers/login', which now itself redirects to /careers.
        // Pointing straight at /careers avoids a pointless double hop.
        router.replace('/careers');
      }
    } catch (err) {
      setError('Failed to load profile');
      router.replace('/careers');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/careers/logout', { method: 'POST' });
    router.push('/careers');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 right-1/4 w-[36rem] h-[36rem] bg-gradient-to-br from-[#006569]/5 to-[#006569]/10 rounded-full blur-3xl"
          style={{
            animation: mounted ? 'blob-float 18s ease-in-out infinite alternate' : undefined,
          }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-[40rem] h-[40rem] bg-gradient-to-tr from-[#006569]/8 to-teal-200/15 rounded-full blur-3xl"
          style={{
            animation: mounted ? 'blob-float 24s ease-in-out infinite alternate-reverse' : undefined,
            animationDelay: '2s',
          }}
        />
      </div>

      <main className="flex-1 px-4 py-12 md:py-16 relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div
            className="mb-8 text-center md:text-left"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F4ED] border border-[#E5F4F4] text-[#006569] text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
              <span className="h-0.5 w-0.5 rounded-full bg-[#006569]" />
              Candidate Profile
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Your Profile
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-semibold">
              Manage your information and resume for job applications
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading your profile...
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600 font-semibold mb-6">
              {error}
            </div>
          )}

          {/* Profile Content */}
          {user && !loading && (
            <div className="space-y-6">
              {/* ID Card with entrance animation. `mb-6` moved here from IdCard's own wrapper so
                  the same component also works inside the /careers auth column with no stray gap. */}
              <div
                className="mb-6"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
                  transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '100ms',
                }}
              >
                <IdCard user={user} onLogout={handleLogout} />
              </div>

              {/* Extended Profile Section */}
              <div
                className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E5F4F4] shadow-sm p-5 md:p-6"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '200ms',
                }}
              >
                <h3 className="text-base font-black text-slate-900 mb-4">Profile Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-slate-900 font-semibold">{user.fullName || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Email
                    </p>
                    <p className="text-slate-900 font-semibold break-all">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Phone
                    </p>
                    <p className="text-slate-900 font-semibold">{user.phone || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Member Since
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E5F4F4]">
                  <ResumeManager user={user} onUpdate={handleUpdateUser} />
                </div>
              </div>

              {/* Navigation */}
              <div
                className="flex flex-wrap items-center justify-between gap-3"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '300ms',
                }}
              >
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#E5F4F4] bg-white text-slate-700 hover:bg-[#F5F4ED]/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.995]"
                >
                  ← Back to Careers
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.995] shadow-lg shadow-slate-900/10"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
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