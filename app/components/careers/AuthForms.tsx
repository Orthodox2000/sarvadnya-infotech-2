'use client';

import { useEffect, useRef, useState } from 'react';

interface AuthFormsProps {
  onSuccess: (user: any) => void;
  // CHANGE: 2026-10-05 — the parent bumps this counter when a "Login to apply" CTA is pressed, and
  // the form focuses its email field. A counter, not a boolean, so pressing twice focuses twice.
  focusSignal?: number;
}

type Mode = 'login' | 'signup';

/**
 * CHANGE: 2026-10-05 — redesigned for the new /careers right-hand column.
 * WHY: the Login/Sign Up tab pair above the form competed with the page for attention; login is
 * what a returning candidate wants, so it is the default and sign-up sits one link away. The form
 * also renders INLINE (no separate page) because login now lives beside the openings.
 * CHANGE: 2026-10-05 — the success banner was `emerald-*`, a colour family retired from the brand
 * (AGENTS.md §7). Switched to teal so no green survives on the page.
 */
export function AuthForms({ onSuccess, focusSignal = 0 }: AuthFormsProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  // CHANGE: 2026-10-05 — entrance is `mounted`-gated (set in an effect, never during render) so
  // SSR markup and the first client render agree and hydration cannot mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // CHANGE: 2026-10-05 — focus follows a mode SWITCH, via an effect rather than
  // requestAnimationFrame. WHY: rAF is not a dependable moment — a backgrounded or non-painting
  // page (headless/occluded tab) may never fire it, so the field silently never receives focus.
  // A `mode` effect is deterministic. The first run is skipped so page load does not steal focus.
  // `preventScroll` keeps the sticky auth column from jumping when the browser scrolls it into view.
  const isFirstModeRun = useRef(true);
  useEffect(() => {
    if (isFirstModeRun.current) {
      isFirstModeRun.current = false;
      return;
    }
    emailRef.current?.focus({ preventScroll: true });
  }, [mode]);

  // CHANGE: 2026-10-05 — react to "Login to apply" from the openings column. This runs on mount too,
  // not just on change, because the form is unmounted while the auth check is in flight: a press
  // during that window increments the counter while no form exists, and the first mount then honours
  // the already-queued signal instead of dropping it.
  useEffect(() => {
    if (focusSignal > 0) emailRef.current?.focus({ preventScroll: true });
  }, [focusSignal]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      onSuccess(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '120ms',
      }}
      className="rounded-2xl border border-[#E5F4F4] bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{isSignup ? 'Create account' : 'Sign in'}</h2>
        <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">
          {isSignup
            ? 'Save your resume once and apply to every role in a couple of clicks.'
            : 'Access your candidate profile and saved resume.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignup && (
          <div className="space-y-1.5">
            <label htmlFor="careers-fullname" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
              Full Name
            </label>
            <input
              id="careers-fullname"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/50 px-4 py-2.5 text-sm text-slate-900 transition-colors duration-300 placeholder:text-slate-400 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
              placeholder="Your name"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="careers-email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
            Email *
          </label>
          <input
            id="careers-email"
            ref={emailRef}
            name="email"
            required
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/50 px-4 py-2.5 text-sm text-slate-900 transition-colors duration-300 placeholder:text-slate-400 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="careers-password" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
            Password *
          </label>
          <div className="relative">
            <input
              id="careers-password"
              name="password"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/50 px-4 py-2.5 pr-11 text-sm text-slate-900 transition-colors duration-300 placeholder:text-slate-400 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
              placeholder={isSignup ? 'Min 6 characters' : '••••••••'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              // CHANGE: 2026-10-05 — the eye toggle was a 32px target. Now a fixed 40x40 grid cell so it is a
              // comfortable tap target on a phone while staying visually inside the 42px field.
              className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-[#006569]/5 hover:text-[#006569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30"
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
                  aria-hidden="true"
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
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isSignup && (
          <div className="space-y-1.5">
            <label htmlFor="careers-phone" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
              Phone <span className="normal-case tracking-normal text-slate-300">(optional)</span>
            </label>
            <input
              id="careers-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
              className="w-full rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/50 px-4 py-2.5 text-sm text-slate-900 transition-colors duration-300 placeholder:text-slate-400 hover:border-[#006569]/40 hover:bg-[#F5F4ED]/70 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-semibold text-red-600"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          // CHANGE: 2026-10-05 — `min-h-11` (44px). Measured at 33px tall before this, under the 44px
          // touch-target guidance for a primary CTA on a mobile-first site (AGENTS.md: verify every
          // new component at 360px). Flex centring keeps the label and the spinner both centred at
          // the new height instead of relying on text-align.
          className="flex w-full min-h-11 items-center justify-center rounded-xl bg-[#006569] py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#006569]/15 transition-all duration-300 hover:bg-[#005559] hover:shadow-xl hover:shadow-[#006569]/25 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Please wait...
            </span>
          ) : isSignup ? (
            'Create account'
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="mt-4 border-t border-[#E5F4F4] pt-4 text-center">
        <p className="text-[11px] font-semibold text-slate-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            // CHANGE: 2026-10-05 (round 4) — this mode toggle measured a 17px-tall hit area, below the
            // 24x24 CSS px floor of WCAG 2.2 SC 2.5.8 (Target Size, Minimum). It is a real control
            // (it swaps the whole form), not decorative text, so it gets a real target: `inline-flex`
            // + `min-h-9` makes the BOX 36px tall while the label still renders as an inline text link.
            // The negative margin keeps the visual alignment with the sentence beside it, so the padding
            // does not shove the paragraph around.
            className="-mx-2 inline-flex min-h-9 items-center justify-center rounded px-2 font-black text-[#006569] underline-offset-4 transition-colors hover:text-[#005559] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30 focus-visible:ring-offset-2"
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  );
}