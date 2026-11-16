'use client';

// CHANGE: 2026-11-16 — the Diwali greeting card became the general greeting card.
// Artwork: public/ev.png (1280x640, 2:1, owner-supplied) via the pre-encoded
// public/greeting-popup.webp. No "Diwali" wording anywhere in the UI.
//
// TIMING (owner, 2026-11-16):
//   first-time visitor  -> opens immediately on mount, stays until the visitor closes it
//                          (the ✕, a click outside, or Esc)
//   returning visitor   -> opens 20 s after landing (GREETING_REVISIT_DELAY_MS), and only once
//   new visitors never get a second card 20 s later — the first card may still be open, and the
//   flag is already written, so the delay branch can never fire for them.
// "Returning" is decided by the RETIRED Diwali flag (GREETING_LEGACY_KEY): those visitors have
// already had the old card, which is exactly who the 20 s rule is for.
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
  GREETING_CTA_LABEL,
  GREETING_LEGACY_KEY,
  GREETING_REVISIT_DELAY_MS,
  GREETING_SKIP_PATHS,
  GREETING_STORAGE_KEY,
} from '@/lib/greeting-popup';

export default function GreetingPopup() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  // In-memory twin of the stored flag. WHY: the layout does NOT remount on client-side
  // navigation, but with storage blocked (private mode) the write silently fails, and without
  // this guard a re-run of the effect could hand the visitor a card per page.
  const shownRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Timing decision. Runs ONCE per page load (mount-only deps): the (site) group layout stays
  // mounted across client-side navigation, so "20 s on the site" is measured from the landing
  // page, not from the last route change — a visitor who keeps browsing still gets the card.
  // localStorage is read in an effect, never during render (the server cannot know what the
  // browser has stored). The flag is written at OPEN time, not at close time, so navigating
  // away mid-show cannot make the card reappear — the exact bug ConsentBanner hit in September.
  useEffect(() => {
    if (shownRef.current) return;

    let sessionHandled = false;
    try {
      sessionHandled = window.sessionStorage.getItem(`${GREETING_STORAGE_KEY}_session`) === '1';
    } catch {
      // Ignore: without session storage we fall back to localStorage/ref guards.
    }
    if (sessionHandled) return;

    const path = window.location.pathname;
    if (GREETING_SKIP_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) return;

    let alreadySeen = false;
    let returning = false;
    try {
      alreadySeen = window.localStorage.getItem(GREETING_STORAGE_KEY) === '1';
      returning = window.localStorage.getItem(GREETING_LEGACY_KEY) === '1';
    } catch {
      // Storage blocked (private mode / cookies disabled): treat as a first visit. It just
      // cannot be remembered, so this visitor may see the card again on a later visit.
    }
    if (alreadySeen) return;

    const markSessionHandled = () => {
      try {
        window.sessionStorage.setItem(`${GREETING_STORAGE_KEY}_session`, '1');
      } catch {
        // Ignore: failing to persist only means a repeat view in this tab is possible.
      }
    };

    const reveal = () => {
      // Re-check the skip list at REVEAL time, not only at mount: a returning visitor can
      // navigate onto the checkout or the demo cart during the 20 s countdown, and a blocking
      // card over a payment form is a lost order. Bailing here deliberately does NOT write the
      // flag, so the visitor still gets the card on a later visit.
      const now = window.location.pathname;
      if (GREETING_SKIP_PATHS.some((p) => now === p || now.startsWith(`${p}/`))) return;
      markSessionHandled();
      try {
        window.localStorage.setItem(GREETING_STORAGE_KEY, '1');
      } catch {
        // Ignore: failing to persist only means a repeat view.
      }
      shownRef.current = true;
      setOpen(true);
    };

    if (!returning) {
      reveal();
      return;
    }

    markSessionHandled();
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
      className="fixed inset-0 z-[100002] flex items-center justify-center bg-[#033B38]/30 p-4 backdrop-blur-[2px] animate-in fade-in duration-300 motion-reduce:animate-none sm:p-6"
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
        className="relative w-[min(90vw,160vh,56rem)] animate-in zoom-in-95 duration-300 motion-reduce:animate-none"
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
