'use client';

import { useEffect, useState } from 'react';

/**
 * CHANGE: 2026-10-16 — careers referral system, post-login settings.
 * WHY: the member needs to SEE and SHARE their own referral code. Display-only by design
 * (owner ruling): attribution is fixed at signup, never editable afterwards.
 *
 * HYDRATION: the share URL contains `window.location.origin`, which does not exist during
 * SSR — so the absolute link is built only inside the click handler and never rendered.
 * Nothing here reads `window` during render.
 */
export function ReferralCard({ user }: { user: any }) {
  const [referredCount, setReferredCount] = useState<number | null>(null);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);

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

  if (!code) return null;

  const copy = async (what: 'code' | 'link') => {
    const text = what === 'code' ? code : `${window.location.origin}/careers?ref=${code}`;
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
    const shareData = {
      title: 'Join us via referral',
      text: `Use my Sarvadnya Infotech referral code ${code}: ${window.location.origin}/careers?ref=${code}`,
      url: `${window.location.origin}/careers?ref=${code}`,
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

  return (
    <div className="mt-4 rounded-xl border border-[#E5F4F4] bg-[#F5F4ED]/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Referral Code</p>
          <p className="mt-1 font-mono text-lg font-black tracking-[0.25em] text-[#006569]">{code}</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">
            {referredCount === null ? (
              'Share your link to invite friends.'
            ) : referredCount === 0 ? (
              'No sign-ups with your code yet.'
            ) : (
              <>
                <span className="font-black text-[#006569]">{referredCount}</span>{' '}
                {referredCount === 1 ? 'friend signed up' : 'friends signed up'} with your code.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={() => copy('code')}
            className="rounded-full bg-teal-50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#006569] transition-colors hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30"
          >
            {copied === 'code' ? 'Copied!' : 'Copy code'}
          </button>
          <button
            type="button"
            onClick={() => copy('link')}
            className="rounded-full bg-teal-50 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#006569] transition-colors hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30"
          >
            {copied === 'link' ? 'Link copied!' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-full bg-[#006569] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#005559] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/40"
          >
            Share
          </button>
        </div>
      </div>

      {copyFailed && (
        <p role="status" className="mt-2 text-[10px] font-semibold text-amber-700">
          Couldn&apos;t copy automatically — select the code and copy it manually.
        </p>
      )}

      {user?.referredBy && (
        <p className="mt-2 border-t border-[#E5F4F4] pt-2 text-[10px] font-semibold text-slate-400">
          You were invited with code <span className="font-mono font-black text-slate-500">{user.referredBy}</span>.
        </p>
      )}
    </div>
  );
}
