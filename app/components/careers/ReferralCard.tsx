'use client';

import { useEffect, useState } from 'react';

/**
 * CHANGE: 2026-10-16 — careers referral system, post-login settings.
 * WHY: the member needs to SEE and SHARE their own referral code. Display-only by design
 * (owner ruling): attribution is fixed at signup, never editable afterwards.
 *
 * CHANGE: 2026-10-17 — owner request: the section is now COLLAPSED BY DEFAULT ("hidden post
 * login by default, people have to expand"), the full shareable LINK is shown (not just copy
 * buttons), and the action buttons sit in a properly spaced inline row. NOTE: the collapsible
 * body is always rendered (hidden with CSS) so the share link can be shown without a second
 * state machine; the count always loads.
 *
 * HYDRATION: the share URL contains `window.location.origin`, which does not exist during SSR.
 * The link text is therefore seeded in an effect (never during render), so SSR + first client
 * render both show an empty link slot and cannot mismatch.
 */
export function ReferralCard({ user }: { user: any }) {
  const [referredCount, setReferredCount] = useState<number | null>(null);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Seeded empty, filled in an effect — keeps SSR/client markup identical (see HYDRATION note).
  const [shareLink, setShareLink] = useState('');

  const code = String(user?.referralCode || '').toUpperCase();

  useEffect(() => {
    if (!code) return;
    let alive = true;
    fetch('/api/auth/careers/referral-stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && typeof data.referredCount === 'number') setReferredCount(data.referredCount);
      })
      .catch(() => {
        /* the count is decoration — a failure must not affect the card */
      });
    return () => {
      alive = false;
    };
  }, [code]);

  useEffect(() => {
    if (!code) return;
    setShareLink(`${window.location.origin}/careers?ref=${code}`);
  }, [code]);

  if (!code) return null;

  const copy = async (what: 'code' | 'link') => {
    const text = what === 'code' ? code : shareLink || `${window.location.origin}/careers?ref=${code}`;
    setCopyFailed(false);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts (plain-http LAN testing) and old engines.
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(what);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopyFailed(true);
    }
  };

  const share = async () => {
    const url = shareLink || `${window.location.origin}/careers?ref=${code}`;
    const shareData = {
      title: 'Join us via referral',
      text: `Use my Sarvadnya Infotech referral code ${code}: ${url}`,
      url,
    };
    setCopyFailed(false);
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await copy('link');
    } catch {
      setCopyFailed(true);
    }
  };

  const buttonBase =
    'rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30';

  return (
    <div className="mt-4 rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/40">
      {/* Header — the whole row toggles the section (collapsed by default). */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="careers-referral-body"
        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F5F4ED]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-teal-50 text-[#006569]" aria-hidden="true">
            {/* share / referral glyph */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Referral Code
            </span>
            <span className="block truncate text-[10px] font-semibold text-slate-400">
              {referredCount === null
                ? 'Invite friends and earn credit.'
                : referredCount === 0
                  ? 'No sign-ups with your code yet.'
                  : `${referredCount} ${referredCount === 1 ? 'friend has' : 'friends have'} signed up with your code.`}
            </span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border text-[12px] leading-none transition-colors ${
            expanded ? 'border-[#006569] bg-[#006569] text-white' : 'border-[#B8DEDE] text-[#006569]'
          }`}
        >
          {expanded ? '\u2212' : '+'}
        </span>
      </button>

      {expanded && (
        <div id="careers-referral-body" className="border-t border-[#E5F4F4] px-3 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Referral Code</p>
          <p className="mt-1 font-mono text-lg font-black tracking-[0.25em] text-[#006569]">{code}</p>

          {/* The shareable link is shown in full (selectable) — owner: "also show link as well". */}
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Your Referral Link</p>
          <input
            type="text"
            readOnly
            value={shareLink}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Your referral link"
            placeholder="Loading link…"
            className="mt-1 w-full truncate rounded-lg border border-[#E5F4F4] bg-white px-2.5 py-2 font-mono text-[10px] text-slate-600 focus:outline-none focus:border-[#006569]"
          />

          {/* Inline, properly spaced actions (was a cramped vertical stack). */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => copy('code')} className={`${buttonBase} bg-teal-50 text-[#006569] hover:bg-teal-100`}>
              {copied === 'code' ? 'Code copied!' : 'Copy code'}
            </button>
            <button type="button" onClick={() => copy('link')} className={`${buttonBase} bg-teal-50 text-[#006569] hover:bg-teal-100`}>
              {copied === 'link' ? 'Link copied!' : 'Copy link'}
            </button>
            <button type="button" onClick={share} className={`${buttonBase} bg-[#006569] text-white hover:bg-[#005559]`}>
              Share
            </button>
          </div>

          {copyFailed && (
            <p role="status" className="mt-2 text-[10px] font-semibold text-amber-700">
              Couldn&apos;t copy automatically — select the link and copy it manually.
            </p>
          )}

          {user?.referredBy && (
            <p className="mt-3 border-t border-[#E5F4F4] pt-2 text-[10px] font-semibold text-slate-400">
              You were invited with code{' '}
              <span className="font-mono font-black text-slate-500">{user.referredBy}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
