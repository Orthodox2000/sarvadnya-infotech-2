'use client';

import { useState, useEffect } from 'react';
import { ResumeManager } from './ResumeManager';

interface IdCardProps {
  user: any;
  onLogout: () => Promise<void>;
}

// CHANGE: 2026-10-05 — the outer wrapper's `mb-6` was removed. It assumed IdCard was always the top
// of a full-width section; inside the new /careers auth column that trailing margin pushed the
// layout around. The gap is now owned by the call site (careers-client.tsx, profile/page.tsx).
export function IdCard({ user, onLogout }: IdCardProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await onLogout();
    setLoggingOut(false);
  };

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'C';

  return (
    <div
      className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E5F4F4] p-4 md:p-5 shadow-sm hover:shadow-lg hover:border-[#006569]/20 transition-all duration-500 relative overflow-hidden group"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.995)',
        transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Decorative gradient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#006569]/5 to-transparent rounded-full blur-2xl group-hover:from-[#006569]/10 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-teal-100/20 to-transparent rounded-full blur-2xl group-hover:from-teal-100/40 transition-all duration-700" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar with gradient */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#006569] via-[#005559] to-[#004548] text-white flex items-center justify-center text-sm md:text-base font-black shadow-lg shadow-[#006569]/20 group-hover:shadow-xl group-hover:shadow-[#006569]/30 group-hover:scale-105 transition-all duration-500">
              {initials}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            {/* Subtle pulse ring */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#006569]/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg font-black text-slate-900 truncate group-hover:text-[#006569] transition-colors duration-300">
              {user.fullName || 'Candidate'}
            </h3>
            <p className="text-xs md:text-sm text-slate-500 truncate mt-1 group-hover:text-slate-600 transition-colors duration-300">
              {user.email}
            </p>
            {user.phone && (
              <p className="text-xs text-slate-400 mt-1 group-hover:text-slate-500 transition-colors duration-300">
                {user.phone}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.995] transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
        >
          {loggingOut ? (
            <span className="flex items-center gap-1.5">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging out...
            </span>
          ) : (
            'Logout'
          )}
        </button>
      </div>

      {/* Mobile drawer-like slide-up effect on expand if needed - subtle */}
      <div className="mt-4 relative z-10 transition-all duration-500">
        <ResumeManager user={user} />
      </div>
    </div>
  );
}
