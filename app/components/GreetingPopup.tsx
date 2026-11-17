'use client';

// CHANGE: 2026-11-17 — timing now follows the visitor session the admin tracks, not a retired
// localStorage flag. Artwork: public/ev.png (1280x640, 2:1, owner-supplied) via the pre-encoded
// public/greeting-popup.webp.
//
// TIMING (owner, 2026-11-17):
//   NEW visitor      -> no `svd_vid` cookie at page load -> opens immediately on mount and stays
//                       until the visitor closes it (the ✕, a click outside, or Esc).
//   REPEAT visitor   -> `svd_vid` cookie already present -> opens 20 s after landing
//                       (GREETING_REVISIT_DELAY_MS). The cookie is the same session id the admin
//                       records in `visitors`; the <head> script captures its presence before
//                       VisitorProvider can create it.
//   Once per page load: the flag is raised in sessionStorage at SHOW time, but a visit that
//   already has a visitor session RESETS it to false first — so the 20 s timer is guaranteed on
//   the 2nd, 3rd, ... visit too (owner bug report 2026-11-17). The in-memory shownRef still blocks
//   a second card within one page load, and new visitors still get the immediate card.
//
// HOW TO REMOVE IT (four steps, nothing else to unpick — no DB, env, settings or CSS change):
//   1. delete app/components/GreetingPopup.tsx
//   2. delete lib/greeting-popup.ts
//   3. delete the `import GreetingPopup ...` line and the `<GreetingPopup />` line in
//      app/(site)/layout.tsx
//   4. delete the `buildGreetingPreloadScript` import and the `<script id="greeting-preload">`
//      line in app/layout.tsx
// Optionally delete public/greeting-popup.webp. public/ev.png is the owner's master and may be
// kept. The `svd_greeting_2026` flag can stay in visitors' localStorage; nothing reads it again.
//
// WHY A MODAL AND NOT A CORNER TOAST: the artwork is a greeting card. A card needs room on
// every aspect ratio, so it is centred over a dimmed backdrop instead of being shrunk into a
// corner where it would be too small to read on a phone.
//
// WHY PAGE SCROLL IS LOCKED: the card can sit on screen indefinitely, so leaving the page
// scrollable behind it would mean content slides under a dimmed layer while the visitor
// drags. The restore runs on close AND on unmount (matching ModuleModal /
// UnifiedContactModal), so the site is never left unscrollable.
//
// COLLISION WITH ConsentBanner: both can appear on a true first visit. ConsentBanner sits at
// `bottom-right` with `z-[100001]` and stays until dismissed; this card is z-[100002], so it
// draws over the banner's corner and leaves the banner itself untouched. The banner reappears
// underneath once the card is closed.

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GREETING_ART,
  GREETING_CTA_HREF,
  GREETING_RETURNING_GLOBAL,
  GREETING_REVISIT_DELAY_MS,
  GREETING_SESSION_KEY,
  GREETING_SKIP_PATHS,
} from '@/lib/greeting-popup';

// CHANGE: 2026-11-17 — one duration for BOTH directions, so the slow entry and the slow exit are
// the same animation played forwards and backwards. Kept here rather than only in the class names
// because the close handler must wait exactly this long before unmounting the card.
const GREETING_TRANSITION_MS = 700;

export default function GreetingPopup() {
  const [open, setOpen] = useState(false);
  // `closing` keeps the card mounted while the exit animation plays; `open` stays true so the
  // scroll lock and Escape handler remain in force until the card is actually gone.
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  // In-memory twin of the stored flag. WHY: the layout does NOT remount on client-side
  // navigation, but with storage blocked (private mode) the write silently fails, and without
  // this guard a re-run of the effect could hand the visitor a card per page.
  const shownRef = useRef(false);

  // CHANGE: 2026-11-17 — play the exit at the same slow pace as the entry, then unmount.
  // A second call (double click, Esc while already closing) is a no-op; reduced-motion users skip
  // the wait and get an immediate close, matching the `motion-reduce:animate-none` classes below.
  const close = useCallback(() => {
    if (closeTimerRef.current !== null) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setOpen(false);
      return;
    }
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setClosing(false);
      setOpen(false);
    }, GREETING_TRANSITION_MS);
  }, []);

  // A navigation or unmount mid-exit must not leave a dangling timer writing to a dead component.
  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  // Timing decision. Runs ONCE per page load (mount-only deps): the (site) group layout stays
  // mounted across client-side navigation, so "20 s on the site" is measured from the landing
  // page, not from the last route change — a visitor who keeps browsing still gets the card.
  // The new/repeat decision was captured in <head> (before VisitorProvider creates `svd_vid`);
  // the per-tab flag is sessionStorage, read/written in this effect, never during render.
  // It is raised at SHOW time, not close time, so navigating away mid-show cannot make the card
  // reappear — the exact bug ConsentBanner hit in September.
  useEffect(() => {
    if (shownRef.current) return;

    // Repeat = the admin's visitor-session cookie already existed at load time. The <head>
    // script wrote the global before VisitorProvider could create the cookie on a first visit.
    const returning =
      (window as unknown as Record<string, unknown>)[GREETING_RETURNING_GLOBAL] === true;

    let sessionHandled = false;
    try {
      sessionHandled = window.sessionStorage.getItem(GREETING_SESSION_KEY) === '1';
    } catch {
      // Ignore: without session storage the in-memory ref still blocks a second card this mount.
    }

    // CHANGE: 2026-11-17 (owner bug report) — on a 3rd+ visit the flag left by an earlier visit in
    // the same tab was still '1', so the 20 s timer never ran and no card appeared. When a visitor
    // session exists, reset the flag to false FIRST so the timer is guaranteed on every repeat
    // visit. shownRef still prevents a second card inside this page load. A brand-new session
    // keeps the guard: it has no cookie yet, so a stale flag means it already got the card here.
    if (returning) {
      try {
        window.sessionStorage.setItem(GREETING_SESSION_KEY, '0');
      } catch {
        // Ignore: with storage blocked the flag cannot suppress anything anyway.
      }
    } else if (sessionHandled) {
      return;
    }

    const path = window.location.pathname;
    if (GREETING_SKIP_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) return;

    const markSessionHandled = () => {
      try {
        window.sessionStorage.setItem(GREETING_SESSION_KEY, '1');
      } catch {
        // Ignore: failing to persist only means a repeat view in this tab is possible.
      }
    };

    const reveal = () => {
      if (shownRef.current) return;
      // Re-check the skip list at REVEAL time, not only at mount: a returning visitor can
      // navigate onto the checkout or the demo cart during the 20 s countdown, and a blocking
      // card over a payment form is a lost order. Bailing here deliberately does NOT write the
      // flag, so the visitor still gets the card on a later visit.
      const now = window.location.pathname;
      if (GREETING_SKIP_PATHS.some((p) => now === p || now.startsWith(`${p}/`))) return;
      markSessionHandled();
      shownRef.current = true;
      setOpen(true);
    };

    if (!returning) {
      // New session -> immediate popup, flag raised in reveal().
      reveal();
      return;
    }

    // Repeat visitor -> wait, then show and raise the flag in the session.
    const timer = window.setTimeout(reveal, GREETING_REVISIT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Lock the page behind the card while it is open. Restored on close and again on unmount, so
  // a navigation while it is open cannot leave the site unscrollable. The padding swap
  // compensates for the scrollbar that `overflow: hidden` removes — without it the whole page
  // jumps ~15 px sideways the instant the card appears (and jumps back on close).
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  // Escape dismisses — the card has no timer waiting to close it, so the keyboard path must exist.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // Move focus to the close button when it opens so Escape/Enter work immediately and screen
  // readers announce the dialog. `preventScroll` keeps the page from jumping.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Greeting from Sarvadnya Infotech LLP"
      onClick={close}
      className={`fixed inset-0 z-[100002] flex items-center justify-center bg-[#033B38]/30 p-4 backdrop-blur-[2px] duration-700 ease-in-out motion-reduce:animate-none sm:p-6 ${
        closing ? 'animate-out fade-out fill-mode-forwards' : 'animate-in fade-in'
      }`}
    >
      {/* FITTING RULE — one artwork, one box, so every width behaves the same way:
            w = min(90vw, 160vh, 56rem)  and  aspect-[2/1]
            -> height = w/2, i.e. never more than 80vh
            -> 324 x 162 px at the 360 px floor, 896 x 448 px on desktop
          `object-contain` keeps the whole artwork visible inside that box, so nothing is
          cropped or stretched — including a future replacement whose ratio is not exactly 2:1
          (it letterboxes instead, which is still a complete image). 90vw (not 92vw) because the
          overlay's `p-4` already eats 32 px at the narrowest breakpoint. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-[min(90vw,160vh,56rem)] duration-700 ease-in-out motion-reduce:animate-none ${
          closing ? 'animate-out zoom-out-95 fade-out fill-mode-forwards' : 'animate-in zoom-in-95 fade-in'
        }`}
      >
        {/* CHANGE: 2026-11-16 — popup shows only the image. Clicking the image opens the linked page. */}
        <Link
          href={GREETING_CTA_HREF}
          onClick={close}
          aria-label={GREETING_ART.alt}
          className="relative block aspect-[2/1] w-full overflow-hidden rounded-2xl shadow-[0_24px_70px_-18px_rgba(0,0,0,0.75)] ring-1 ring-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Image
            src={GREETING_ART.src}
            alt={GREETING_ART.alt}
            width={GREETING_ART.width}
            height={GREETING_ART.height}
            // Already the final, pre-sized WebP — see the note in lib/greeting-popup.ts. The
            // <head> preload script requests the exact same URL, so there is one download, not two.
            unoptimized
            priority
            draggable={false}
            className="h-full w-full select-none object-contain"
          />
        </Link>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close greeting"
          className="-right-2.5 -top-2.5 absolute flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006569] shadow-lg ring-1 ring-black/10 transition-colors hover:bg-[#E5F4F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-right-3 sm:-top-3"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
