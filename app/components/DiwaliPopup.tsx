'use client';

// CHANGE: 2026-11-05 — Diwali festival greeting popup (TEMPORARY, owner-requested).
//
// Brief: the square Diwali template (public/diwali template 2026.png, 1080x1080) appears for
// FIRST-TIME visitors and STAYS until the visitor closes it (the ✕, a click outside, or Esc).
// It must fit every screen with the square artwork fully visible (no crop, no letterbox
// distortion), and is meant to be deleted by hand after the festival.
//
// CHANGE: 2026-11-05 (2nd pass) — owner: *"keep it until someone closes or clicks outside, and
// background green blur is too much, reduce lightly"*. The 5-second auto-close (AUTO_CLOSE_MS +
// its setTimeout) was REMOVED, and the backdrop went from `bg-[#033B38]/75 backdrop-blur-sm`
// to `bg-[#033B38]/30 backdrop-blur-[2px]` — a light tint instead of a dark curtain.
//
// CHANGE: 2026-11-05 (3rd pass) — owner: *"for devices above md show diwali.png which is wider"*.
// Below 768 px the square template (diwali template 2026.png, 1080x1080) is shown; from `md` up
// the wide one (diwali.png, 1920x960) is shown in a 2:1 box. See DIWALI_ART in lib/diwali-popup.ts.
//
// HOW TO REMOVE IT (four steps, nothing else to unpick — no DB, env, settings or CSS change):
//   1. delete app/components/DiwaliPopup.tsx
//   2. delete lib/diwali-popup.ts
//   3. delete the `import DiwaliPopup ...` line and the `<DiwaliPopup />` line in
//      app/(site)/layout.tsx
//   4. delete the `buildDiwaliPreloadScript` import and the `<script id="diwali-preload">` line
//      in app/layout.tsx
// Optionally delete public/diwali-popup-square.webp and public/diwali-popup-wide.webp. The
// originals (public/diwali template 2026.png, public/diwali.png) are untouched by this feature
// and may be kept. Storage key `svd_diwali_2026` can stay in visitors' localStorage; nothing
// reads it again.
//
// WHY A MODAL AND NOT A CORNER TOAST: the artwork is a full greeting card. A square card needs
// room on every aspect ratio, so it is centred over a dimmed backdrop instead of being shrunk
// into a corner where it would be too small to read on a phone.
//
// WHY PAGE SCROLL IS LOCKED: the card no longer times out, so it can sit on screen
// indefinitely. Leaving the page scrollable behind it means content slides under a dimmed
// layer and the visible page no longer matches what the visitor is dragging. The restore runs
// on close AND on unmount (matching ModuleModal / UnifiedContactModal), so the site is never
// left unscrollable.
//
// COLLISION WITH ConsentBanner: both can appear on a true first visit. ConsentBanner sits at
// `bottom-right` with `z-[100001]` and stays until dismissed; this card is z-[100002], so it
// draws over the banner's corner and leaves the banner itself untouched. Because this card now
// waits for a dismissal, it will COVER the banner until the visitor closes it — that is the
// owner's choice; the banner reappears underneath afterwards.

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  DIWALI_ART,
  DIWALI_SKIP_PATHS,
  DIWALI_STORAGE_KEY,
  DIWALI_WIDE_QUERY,
} from '@/lib/diwali-popup';

// TWO ARTWORKS, ONE POPUP (owner request, 2026-11-05 3rd pass): below the Tailwind `md`
// breakpoint (768 px) the SQUARE template is shown; from 768 px up the WIDE 2:1 artwork is
// shown, because a square card becomes tiny on a desktop while the 2:1 one fills the width.
// The URLs, storage key and breakpoint live in `lib/diwali-popup.ts` because the <head>
// preload script in app/layout.tsx must use the exact same strings.
//
// WHY matchMedia INSTEAD OF TWO CSS-HIDDEN <Image> TAGS: a `hidden md:block` pair still ships
// both srcsets (and `priority` preloads both), so every visitor would download two festival
// images for one card. Picking the source in JS keeps it to one asset per device. No hydration
// risk: the card renders nothing until the first-visit effect opens it, and the breakpoint
// state is set in the same post-mount effect batch.
//
// SPEED (2026-11-05, 4th pass): both artworks are now pre-optimised static WebP files (110 KB
// square / 139 KB wide, see lib/diwali-popup.ts) served straight from /public with the existing
// `immutable` cache rule, so `unoptimized` is deliberate — routing these through
// /_next/image would re-encode an already-final file and reinstate the cold transform.

export default function DiwaliPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Which artwork is showing. Starts `false` (square) and is corrected in the effect below
  // before the card is ever painted, since `open` only flips after mount too.
  const [wideArt, setWideArt] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  // In-memory twin of the storage flag. WHY: the layout does NOT remount on client-side
  // navigation, so this effect re-runs per route. With storage blocked (private mode) the
  // write below silently fails, and without this guard the card would hit the visitor again
  // on every single page they open.
  const shownRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // First-visit check. localStorage is read in an effect, never during render (hydration
  // mismatch: the server cannot know what the browser has stored). Writing at OPEN TIME, not
  // at close time, so navigating away mid-show cannot make the card reappear on the next page
  // — the exact bug ConsentBanner hit in September.
  useEffect(() => {
    if (shownRef.current) return;
    if (DIWALI_SKIP_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;

    let alreadyShown = false;
    try {
      alreadyShown = window.localStorage.getItem(DIWALI_STORAGE_KEY) === '1';
    } catch {
      // Storage blocked (private mode / cookies disabled): show it, it just cannot be
      // remembered, so the visitor may see it again on a later visit.
      alreadyShown = false;
    }
    if (alreadyShown) return;

    try {
      window.localStorage.setItem(DIWALI_STORAGE_KEY, '1');
    } catch {
      // Ignore: failing to persist only means a repeat view.
    }
    shownRef.current = true;
    setOpen(true);
  }, [pathname]);

  // Art-direction breakpoint. `change` fires on rotation / window resize, so a tablet that
  // crosses 768 px while the card is open swaps to the artwork that fits it. Removed on
  // unmount.
  useEffect(() => {
    const query = window.matchMedia(DIWALI_WIDE_QUERY);
    const sync = () => setWideArt(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Lock the page behind the card while it is open (it now waits for a dismissal, so it can
  // be up for minutes). Restored on close and again on unmount, so a navigation while it is
  // open cannot leave the site unscrollable. The padding swap compensates for the scrollbar
  // that `overflow: hidden` removes — without it the whole page jumps ~15 px sideways the
  // instant the card appears (and jumps back on close).
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

  // Escape dismisses — the card has no timer anymore, so the keyboard path must exist.
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

  const art = wideArt ? DIWALI_ART.wide : DIWALI_ART.square;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Diwali greeting from Sarvadnya Infotech LLP"
      onClick={close}
      className="fixed inset-0 z-[100002] flex items-center justify-center bg-[#033B38]/30 p-4 backdrop-blur-[2px] animate-in fade-in duration-300 motion-reduce:animate-none sm:p-6"
    >
      {/* FITTING RULE — one line per artwork, no media queries (the source swap above is the
          only breakpoint):
            square (< md):  min(90vw, 80vh, 32rem)  -> 324 px at 360 px wide, 512 px ceiling
            wide   (>= md): min(90vw, 160vh, 56rem) -> 2:1, so the HEIGHT is always <= 80vh
          Each box matches its artwork's own ratio and the image is `object-contain` inside it,
          so nothing is ever cropped or stretched — including a future replacement that does
          not match the ratio exactly. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          'relative animate-in zoom-in-95 duration-300 motion-reduce:animate-none ' +
          (wideArt
            ? 'aspect-[2/1] w-[min(90vw,160vh,56rem)]'
            : 'aspect-square w-[min(90vw,80vh,32rem)]')
        }
      >
        <Image
          src={art.src}
          alt={art.alt}
          width={art.width}
          height={art.height}
          // Already the final, pre-sized WebP — see the SPEED note above. The <head> preload
          // script requests the exact same URL, so there is one download, not two.
          unoptimized
          priority
          draggable={false}
          className="h-full w-full select-none rounded-2xl object-contain shadow-[0_24px_70px_-18px_rgba(0,0,0,0.75)] ring-1 ring-white/15"
        />

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close Diwali greeting"
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
