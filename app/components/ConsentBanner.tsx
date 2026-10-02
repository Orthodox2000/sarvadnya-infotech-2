'use client';

// CHANGE: 2026-10-02 — Cookie notice. REMADE six times.
//
// v1  bottom-left, full card, "we keep a few records as you browse…", dismiss-only.
// v2  bottom-right, single sentence + "Learn more" -> /privacy. (owner request)
// v3  a *temporary hover button* at the top of the stacking order, auto-collapsing after
//     5s, with a small cookie pill resting in the corner.
// v4  owner reported the banner "appears on all pages and vanishes after 5 seconds".
//     That was a real bug, not a preference: only the X button recorded anything, so
//     simply letting the card time out wrote NOTHING and it auto-opened again on the
//     next page, on every page, forever. Fixed by remembering the card has been seen
//     (see `markSeen`) so it auto-opens exactly once ever.
// v5  owner request: "cookies button gone and only banner seen". The resting `Cookies`
//     pill and every hover/tap affordance around it are deleted. The banner is now the
//     ONLY cookie UI and auto-collapsed after 5s.
// v6  THIS FILE — owner request: "keep it as long as user closes". The 5s auto-collapse
//     timer is DELETED — every trace of the countdown (AUTO_COLLAPSE_MS, collapseLater,
//     clearTimer, the setTimeout ref and its unmount cleanup) is gone. A first visit
//     opens the card and it STAYS until the X is pressed. Nothing changes about when it
//     opens (first visit only) or how it is remembered.
//
// The two-word storage model from v4 is UNCHANGED and still load-bearing:
//   `seen`      — the card auto-opened once (written AT OPEN TIME, see markSeen)
//   `dismissed` — the X was pressed
//   legacy `'1'`— v3 stored this to mean "removed"; it is READ AS `dismissed` so an
//                 existing visitor is not shown the card one more time.
//
// COLLISION NOTE (v5→v6): SupportButton is `fixed bottom-[10%] right-0` — a ~42px-wide,
// ~180px-tall Ask Sara + WhatsApp stack on the same right edge. In v5 the overlap was
// brief because the card auto-collapsed after 5s; in v6 the card lingers until dismissed,
// so a user who neither taps X nor Learn more sees both on the same corner for as long as
// they stay on the first page. That is the owner's explicit request ("keep it as long as
// user closes"); z-[100001] keeps the card on top of the stack while they coexist. Once
// dismissed (or once the visitor leaves the first page), the card never returns.

import { memo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

// Dismissal flag. Named svd_* to match the existing `svd_vid` cookie convention.
//
// WHY THE VALUE IS A WORD, NOT A BOOLEAN: v3 stored a bare `'1'` and that conflated two
// genuinely different end states — "I have seen this and let it go" (keep the pill) and
// "I dismissed this, remove it" (render nothing). With one boolean, only the second could
// be recorded, which is exactly what made the card re-open on every page.
const STORAGE_KEY = 'svd_consent_notice';

/** Stored values. `'1'` is the legacy v3 value and is read as `dismissed`. */
type Stored = 'seen' | 'dismissed' | '1' | null;

function readStored(): Stored {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'seen' || v === 'dismissed' || v === '1' ? v : null;
  } catch {
    // Storage blocked (private mode / disabled cookies): fall through and show the notice.
    // It just cannot be remembered, which means a repeat view. Better that than a silent
    // omission of a legal notice.
    return null;
  }
}

/**
 * Lifecycle stage.
 * `unseen` is both the pre-hydration default and the never-shown case, which is what keeps
 * a returning visitor from seeing a flash before the effect reads storage.
 */
type Stage = 'unseen' | 'seen' | 'dismissed';

function ConsentBanner() {
  const [stage, setStage] = useState<Stage>('unseen');
  const [open, setOpen] = useState(false);

  // Remember that the card has been shown, WITHOUT closing it.
  //
  // WHY THIS RUNS AT OPEN TIME, NOT AFTER A TIMEOUT: the owner's report was the card
  // appearing on every page. If `seen` were only written once the card later closed,
  // then navigating away would lose the record and the next page would open it again —
  // the exact bug, just rarer. Marking at open means "shown at least once" survives an
  // early navigation, a refresh, or a closed tab.
  //
  // Declared before every handler that calls it.
  const markSeen = useCallback(() => {
    try {
      // Never downgrade `dismissed` -> `seen`: doing so would resurrect a card a
      // visitor deliberately removed.
      if (readStored() === 'dismissed') return;
      window.localStorage.setItem(STORAGE_KEY, 'seen');
      setStage((s) => (s === 'dismissed' ? s : 'seen'));
    } catch {
      // Ignore write failures; the notice is informational, so failing to persist only
      // means a repeat view.
    }
  }, []);

  // Mount: reveal on a first visit and leave it up — v6 removed the 5s auto-collapse,
  // the card stays until the X is pressed (owner request: "keep it as long as user
  // closes").
  //
  // localStorage is read in an effect, never during render, to avoid a hydration
  // mismatch — starting `unseen`+closed also means a returning visitor never sees a
  // flash of the card before this runs.
  useEffect(() => {
    const stored = readStored();
    if (stored === 'seen') {
      // Owner decision (v5): once the card has been seen it is never shown again on
      // any page. This branch exists only to keep the end state distinct from
      // `dismissed` in storage.
      setStage('seen');
      return;
    }
    if (stored === 'dismissed' || stored === '1') {
      // Legacy `'1'` lands here too — v3 wrote it to mean "removed", so an existing
      // visitor must NOT be shown the card again just because the encoding changed.
      setStage('dismissed');
      return;
    }
    markSeen();
    setOpen(true);
  }, [markSeen]);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // Ignore write failures; the notice is informational, so failing to persist
      // only means it reappears next visit.
    }
    setOpen(false);
    setStage('dismissed');
  }, []);

  // RENDERING IS DRIVEN BY `open` ALONE — the stage must not gate it. Until v5 this line
  // also returned null for `stage === 'seen'`, but markSeen() flips the stage to 'seen'
  // at the same time it opens the card — the two changes batch into ONE render, so a
  // first visitor would have been shown nothing at all. `stage` still records the end
  // state (for the never-downgrade guard below) but is no longer allowed to veto a
  // freshly opened card. `open` is true only on a genuine first visit and stays true
  // until the X is pressed; every other path leaves it false and renders nothing.
  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100001]">
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
    </div>
  );
}

export default memo(ConsentBanner);