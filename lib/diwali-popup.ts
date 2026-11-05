// CHANGE: 2026-11-05 — shared constants for the TEMPORARY Diwali greeting popup.
//
// WHY THIS FILE EXISTS: three places must agree on the same strings —
//   app/layout.tsx            builds the <head> preload script (server)
//   app/components/DiwaliPopup.tsx  renders the card (client)
// and a mismatch between a preload href and the <img> src silently downloads the artwork twice.
// Pure constants + a string builder, no React, no browser API at module scope, so importing it
// from a server component does not pull anything client-only into the server bundle.
//
// Remove this file together with the component and its layout mount.

/** localStorage flag. Written at open time by the component; only read by the preload script. */
export const DIWALI_STORAGE_KEY = 'svd_diwali_2026';

/** Tailwind's `md` breakpoint (48rem). The component and the preload script both use this. */
export const DIWALI_WIDE_QUERY = '(min-width: 768px)';

/** Routes where the greeting is not shown (and therefore not preloaded) — see the component. */
export const DIWALI_SKIP_PATHS = ['/checkout', '/demo'] as const;

/**
 * Pre-optimised artwork, built once from the owner's PNGs with sharp and committed as static
 * files:
 *   diwali-popup-square.webp  1024x1024, 110 KB  <- public/diwali template 2026.png (2.1 MB)
 *   diwali-popup-wide.webp    1792x896,  139 KB  <- public/diwali.png (850 KB)
 * WHY NOT next/image's optimizer: the 2:1 cap is 896 CSS px, so 1792 px is already 2x, and the
 * square cap is 512 CSS px (1024 at 2x). Both files are the largest single download the popup
 * can ever need, are served `immutable, max-age=31536000` by the existing header rule, and skip
 * the optimizer's cold transform entirely. Handing next/image a 2.1 MB PNG meant every first
 * request paid for a server-side resize before the bytes could leave.
 * Registered by the static-file cache rule only — no next.config change is needed for them.
 */
export const DIWALI_ART = {
  square: {
    src: '/diwali-popup-square.webp',
    width: 1024,
    height: 1024,
    alt: 'Diwali greeting from Sarvadnya Infotech LLP — warm wishes for a bright and prosperous festival of lights',
  },
  wide: {
    src: '/diwali-popup-wide.webp',
    width: 1792,
    height: 896,
    alt: 'Happy Diwali from Sarvadnya Infotech LLP — festive greeting banner',
  },
} as const;

/**
 * Inline script for <head>, executed during HTML parse — before React hydration.
 *
 * WHY: the popup is a client component that cannot render until hydration (the first-visit flag
 * lives in localStorage, so the server cannot know). Without this, the artwork request only
 * starts after the JS bundle runs. Preloading here starts the download in parallel with the
 * HTML/CSS/JS and costs returning visitors nothing, because the whole block is skipped when the
 * storage flag is already set (it never even creates a link).
 *
 * Deliberately tiny and dependency-free; wrapped in try/catch so a blocked localStorage or an
 * unsupported matchMedia can never throw in <head>.
 */
export function buildDiwaliPreloadScript(): string {
  return (
    '(function(){try{' +
    `var p=location.pathname,s=${JSON.stringify(DIWALI_SKIP_PATHS)};` +
    "for(var i=0;i<s.length;i++){if(p===s[i]||p.indexOf(s[i]+'/')===0)return}" +
    `if(localStorage.getItem(${JSON.stringify(DIWALI_STORAGE_KEY)}))return;` +
    "var l=document.createElement('link');l.rel='preload';l.as='image';l.type='image/webp';" +
    `l.href=matchMedia(${JSON.stringify(DIWALI_WIDE_QUERY)}).matches?${JSON.stringify(DIWALI_ART.wide.src)}:${JSON.stringify(DIWALI_ART.square.src)};` +
    "l.setAttribute('fetchpriority','high');document.head.appendChild(l)" +
    '}catch(e){}})();'
  );
}
