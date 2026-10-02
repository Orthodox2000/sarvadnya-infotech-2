'use client';

// CHANGE: 2026-10-02 — Cookie notice. REMADE five times, four of them the same day.
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
// v5  THIS FILE — owner request: "cookies button gone and only banner seen". The
//     resting `Cookies` pill and every hover/tap affordance around it are deleted.
//     The banner is now the ONLY cookie UI: it auto-opens once on a first visit,
//     auto-collapses after 5s, and never returns — there is nothing left to summon it
//     with. Both stored end states render nothing, because without a pill there is no
//     on-demand half to keep.
//
// The two-word storage model from v4 is UNCHANGED and still load-bearing:
//   `seen`      — the card auto-opened once (written AT OPEN TIME, see markSeen)
//   `dismissed` — the X was pressed
//   legacy `'1'`— v3 stored this to mean "removed"; it is READ AS `dismissed` so an
//                 existing visitor is not shown the card one more time.
//
// COLLISION NOTE (v5): SupportButton is `fixed bottom-[10%] right-0` — a ~42px-wide,
// ~180px-tall Ask Sara + WhatsApp stack on the same right edge. The banner is transient
// (5s, once ever), so any overlap with that stack is brief by construction; z-[100001]
// puts the card on top while it lasts, which is what the owner asked for. There is no
// permanent element on this corner any more.

import { memo, useCallback, useEffect, useRef, useState } from 'react';
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

// How long the expanded card stays up after the pointer leaves (ms).
const AUTO_COLLAPSE_MS = 5000;

function ConsentBanner() {
  const [stage, setStage] = useState<Stage>('unseen');
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Remember that the card has been shown, WITHOUT closing it.
  //
  // WHY THIS RUNS AT OPEN TIME, NOT AFTER THE 5s: the owner's report was the card
  // appearing on every page. If `seen` were only written once the card auto-collapsed,
  // then navigating away during the countdown would lose the record and the next page
  // would open it again — the exact bug, just rarer. Marking at open means "shown at
  // least once" survives an early navigation, a refresh, or a closed tab.
  //
  // Declared before every handler that calls it.
  const markSeen = useCallback(() => {
    try {
      // Never downgrade `dismissed` -> `seen`: doing so would resurrect the pill of a
      // visitor who deliberately removed it.
      if (readStored() === 'dismissed') return;
      window.localStorage.setItem(STORAGE_KEY, 'seen');
      setStage((s) => (s === 'dismissed' ? s : 'seen'));
    } catch {
      // Ignore write failures; the notice is informational, so failing to persist only
      // means a repeat view.
    }
  }, []);

  // Mount: reveal on a first visit, and let it linger 5s so it is actually read.
  //
  // localStorage is read in an effect, never during render, to avoid a hydration
  // mismatch — starting `unseen`+closed also means a returning visitor never sees a
  // flash of the card before this runs.
  useEffect(() => {
    const stored = readStored();
    if (stored === 'seen') {
      // Owner decision (v5): once the card has been seen it is never shown again. The
      // resting pill that used to remain was removed on request, so there is nothing
      // left to render — this branch exists only to keep the end state distinct from
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
    collapseLater();
    return clearTimer;
  }, [clearTimer, collapseLater, markSeen]);

  const dismiss = useCallback(() => {
    clearTimer();
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // Ignore write failures; the notice is informational, so failing to persist
      // only means it reappears next visit.
    }
    setOpen(false);
    setStage('dismissed');
  }, [clearTimer]);

  // RENDERING IS DRIVEN BY `open` ALONE — the stage must not gate it. Until v5 this line
  // also returned null for `stage === 'seen'`, but markSeen() flips the stage to 'seen'
  // at the same time it opens the card — the two changes batch into ONE render, so a
  // first visitor would have been shown nothing at all. `stage` still records the end
  // state (for the never-downgrade guard below) but is no longer allowed to veto a
  // freshly opened card. `open` is true only on a genuine first visit, and for the 5s
  // countdown after it; every other path leaves it false and renders nothing.
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
