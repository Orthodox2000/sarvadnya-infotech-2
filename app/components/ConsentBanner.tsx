'use client';

// CHANGE: 2026-09-30 — Cookie notice. REMADE twice the same day.
//
// v1  bottom-left, full card, "we keep a few records as you browse…", dismiss-only.
// v2  bottom-right, single sentence + "Learn more" -> /privacy. (owner request)
// v3  THIS FILE — owner asked for a *temporary hover button* that disappears after
//     5 seconds, at the top of the stacking order. So the persistent card is gone:
//     only a small cookie pill sits in the corner by default, it expands on hover /
//     focus / tap, and it auto-collapses again 5s after the pointer leaves (and 5s
//     after first paint, so a first-time visitor actually reads it).
//
// Why a pill rather than a permanent bar: a permanent legal notice in the corner of
// a lead-generation site is pure friction. This way it is seen once automatically,
// then stays out of the way, and returns on demand.
//
// COLLISION NOTE: SupportButton is `fixed bottom-[10%] right-0` — a ~42px-wide,
// ~180px-tall Ask Sara + WhatsApp stack on the same right edge. Because the collapsed
// pill is only ~40px tall and hugs the very bottom (bottom-4), it clears that stack on
// every device height (the stack's bottom edge is always >= 10% of viewport height).
// The EXPANDED card grows upward into the stack's corner on short viewports; z-[100001]
// puts the card on top, which is what the owner asked for. The 5s auto-collapse is
// what keeps that overlap transient. Verified by /tmp/opencode/probe-collision.cjs.

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Dismissal flag. Named svd_* to match the existing `svd_vid` cookie convention.
const STORAGE_KEY = 'svd_consent_notice';

// How long the expanded card stays up after the pointer leaves (ms).
const AUTO_COLLAPSE_MS = 5000;

function ConsentBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The open state as it was BEFORE the current pointer burst began.
  //
  // WHY THIS EXISTS: a touch tap does not fire mouse events on its own — the browser
  // synthesises them right after `touchend`, in the order
  //   pointerdown -> touchstart -> touchend -> mouseover -> mouseenter -> mousedown -> click
  // So a naive `onClick={() => (open ? close : open)}` reads `open === true` (the
  // synthetic mouseenter has just set it) and immediately shuts the card again.
  // Measured against a real touch profile: the tap produced a genuine `click` on the
  // pill and the card still never appeared — the feature was broken on phones, which
  // is the main audience. Snapshotting on `pointerdown` (the only event that reliably
  // precedes the synthetic mouse burst) restores the user's real intent for BOTH
  // input types: a mouse user still gets "hover opens, click shuts".
  const openBeforeBurst = useRef(false);

  // Committed mirror of `open`. The pointerdown handler must read THIS, not the `open`
  // captured in its render closure: a mouse click arrives as mousemove -> mousedown in
  // quick succession, and the closure still held the pre-hover `false`, so the snapshot
  // was wrong and the click failed to toggle. A ref read is immune to that staleness.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const collapseLater = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), AUTO_COLLAPSE_MS);
  }, [clearTimer]);

  const onPillClick = useCallback(() => {
    if (openBeforeBurst.current) {
      // Already showing when the pointer went down: the user is saying "shut it".
      clearTimer();
      setOpen(false);
      return;
    }
    // Opened by an explicit tap/click. A touch never produces a mouseleave, so the
    // countdown has to start here or the card would sit open until the next
    // navigation on a phone.
    clearTimer();
    setOpen(true);
    collapseLater();
  }, [clearTimer, collapseLater]);

  // Mount: reveal on a first visit, and let it linger 5s so it is actually read.
  // localStorage is read in an effect, never during render, to avoid a hydration
  // mismatch — starting `false` also means a returning visitor never sees a flash.
  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage blocked (private mode / disabled cookies): still offer the notice,
      // it just cannot be remembered. Better a repeat view than a silent omission.
    }
    if (seen) {
      setDismissed(true);
      return;
    }
    setOpen(true);
    collapseLater();
    return clearTimer;
  }, [clearTimer, collapseLater]);

  const openNow = useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer]);

  const dismiss = useCallback(() => {
    clearTimer();
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore write failures; the notice is informational, so failing to persist
      // only means it reappears next visit.
    }
    setOpen(false);
    setDismissed(true);
  }, [clearTimer]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100001] flex flex-col items-end gap-2">
      {open && (
        <div
          id="cookie-notice-panel"
          role="region"
          aria-label="Cookie notice"
          className="animate-in fade-in slide-in-from-bottom-2 w-[calc(100vw-2rem)] max-w-[21rem] duration-300"
        >
          <div className="flex items-start gap-2.5 rounded-2xl border border-[#D4EAEA] bg-white/95 px-3.5 py-3 shadow-[0_8px_28px_-12px_rgba(0,101,105,0.35)] backdrop-blur-md">
            {/* Cookie mark — a chip with three crumbs. aria-hidden: the sentence beside
                it already carries the meaning, so a screen reader should not hear it twice. */}
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="mt-[1px] h-5 w-5 shrink-0 text-[#006569]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="7.2" />
              <circle cx="7.6" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
              <circle cx="12.3" cy="9.6" r="0.7" fill="currentColor" stroke="none" />
              <circle cx="9" cy="12.6" r="0.8" fill="currentColor" stroke="none" />
            </svg>

            <p className="min-w-0 flex-1 text-[11px] leading-[1.5] text-slate-600 sm:text-xs">
              Our website uses cookies to make your experience better!
            </p>

            <Link
              href="/privacy"
              aria-label="Learn more about our privacy policy"
              className="shrink-0 whitespace-nowrap rounded-full bg-[#006569] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#045A57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006569]"
            >
              Learn more
            </Link>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss cookie notice"
              className="-mr-1 -mt-0.5 shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-[#E5F4F4] hover:text-[#006569] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006569]"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* The always-present affordance. Hover, focus and tap all open it, so it is
          reachable by mouse, keyboard and touch without a separate control. */}
      <div
        className="group"
        onMouseEnter={openNow}
        onMouseLeave={collapseLater}
        onFocus={openNow}
        onBlur={collapseLater}
      >
        <button
          type="button"
          // Capture intent BEFORE anything in this burst can change it. See the
          // `openBeforeBurst` comment above — without this the card cannot open on
          // touch at all.
          onPointerDown={() => {
            openBeforeBurst.current = openRef.current;
          }}
          onClick={onPillClick}
          aria-expanded={open}
          aria-controls="cookie-notice-panel"
          // Distinct from the panel's own "Cookie notice" label. When both shared one
          // accessible name, two different elements answered to the same query, which
          // is both an a11y smell and made the layout probe measure the wrong box.
          aria-label="Cookies"
          className="flex h-10 items-center gap-1.5 rounded-full border border-[#D4EAEA] bg-white/95 px-3 shadow-[0_8px_28px_-12px_rgba(0,101,105,0.35)] backdrop-blur-md transition-colors hover:bg-[#E5F4F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006569]"
        >
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[#006569]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <circle cx="10" cy="10" r="7.2" />
            <circle cx="7.6" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="12.3" cy="9.6" r="0.7" fill="currentColor" stroke="none" />
            <circle cx="9" cy="12.6" r="0.8" fill="currentColor" stroke="none" />
          </svg>
          <span className="text-[11px] font-semibold text-slate-600 transition-colors group-hover:text-[#006569]">
            Cookies
          </span>
        </button>
      </div>
    </div>
  );
}

export default memo(ConsentBanner);
