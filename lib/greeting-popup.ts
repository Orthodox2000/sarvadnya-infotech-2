// CHANGE: 2026-11-27 — ONE GLOBAL rule for every visitor (owner). The 2026-11-17 split between
// "new" (immediate) and "repeat" (20 s, driven by the `svd_vid` cookie + a sessionStorage flag)
// is removed. Every visit now waits GREETING_DELAY_MS, records the show time in LOCAL storage,
// and stays quiet until GREETING_COOLDOWN_MS has passed. One setting file, one persistent key,
// identical behaviour for all visitors and all tabs.
//
// WHY THIS FILE EXISTS: two places must agree on the same strings —
//   app/layout.tsx                   builds the <head> preload script (server)
//   app/components/GreetingPopup.tsx renders the card (client)
// and a mismatch between a preload href and the <img> src silently downloads the artwork twice.
// Pure constants + a string builder, no React, no browser API at module scope, so importing it
// from a server component does not pull anything client-only into the server bundle.
//
// BEHAVIOUR (owner, 2026-11-27):
//   every visit  -> wait GREETING_DELAY_MS (15 s) from landing, then show the card and record
//                   Date.now() under GREETING_SHOWN_KEY.
//   next 6 hours -> no card anywhere on the site, regardless of session, tab or reload.
//   after 6 hours-> the 15 s timer runs again.
//   /checkout and /demo (payment/test routes) stay excluded — see GREETING_SKIP_PATHS.
//
// Remove this file together with the component and its layout mount.

/**
 * Single global show-time key. localStorage (not sessionStorage) so the 6-hour cooldown survives
 * tab closes, reloads and new sessions. Value is a Date.now() millisecond timestamp.
 */
export const GREETING_SHOWN_KEY = 'svd_greeting_2026_shown_at';

/** Delay from landing to the card, for ALL visitors. */
export const GREETING_DELAY_MS = 15_000;

/** Global cooldown after a show — reset only after this long. */
export const GREETING_COOLDOWN_MS = 6 * 60 * 60 * 1000;

/** Routes where the greeting is not shown (and therefore not preloaded) — see the component. */
export const GREETING_SKIP_PATHS = ['/checkout', '/demo'] as const;

/**
 * CHANGE: 2026-11-16 — the greeting card is also the launch notice for the new Document
 * Management module. Clicking the artwork (or its CTA pill) routes here and closes the card.
 * One constant, so the component cannot drift from the module page route. Remove this pair
 * together with the CTA markup in GreetingPopup.tsx if the card should stop linking.
 */
export const GREETING_CTA_HREF = '/modules/document-management';
export const GREETING_CTA_LABEL = 'New: Document Management for TallyPrime';

/**
 * ONE artwork for every width, pre-encoded once from the owner's PNG with sharp and committed
 * as a static file:
 *   greeting-popup.webp  1280x640 (2:1), 65 KB  <- public/ev.png 1280x640
 * WHY A SINGLE 2:1 ASSET: the owner supplied one image, so the card keeps one box of the same
 * ratio and `object-contain` fits it whole — no crop, no stretch, no srcset pair to download.
 * WHY NOT next/image's optimizer: the card caps at 56rem (896 CSS px), so 1280 px is already
 * ~1.4x and re-encoding the source PNG on a cold request gains nothing; the file is served
 * `immutable, max-age=31536000` by the existing static-header rule.
 * REGENERATE (only if public/ev.png is replaced):
 *   node -e "require('sharp')('public/ev.png').resize(1280,640,{fit:'inside'}).webp({quality:82,effort:6}).toFile('public/greeting-popup.webp')"
 * Registered by the static-file cache rule only — no next.config change is needed for it.
 *
 * ALT TEXT: deliberately generic — it describes who is greeting, not the artwork, because the
 * artwork can be swapped for the next occasion without inventing detail that is no longer
 * there. Refine it only with words that are visible in the image itself.
 */
export const GREETING_ART = {
  src: '/greeting-popup.webp',
  width: 1280,
  height: 640,
  alt: 'Greeting from Sarvadnya Infotech LLP',
} as const;

/**
 * Inline script for <head>, executed during HTML parse — before React hydration.
 *
 * ONE global decision (2026-11-27): skip the payment/test paths, then preload the artwork only if
 * the 6-hour cooldown has expired. The constants are injected from this file, so the preload and
 * the component can never disagree. Deliberately tiny and dependency-free; storage access is in
 * try/catch so a blocked storage jar cannot throw in <head>.
 */
export function buildGreetingPreloadScript(): string {
  return (
    '(function(){' +
    'try{' +
    `var p=location.pathname,s=${JSON.stringify(GREETING_SKIP_PATHS)};` +
    "for(var i=0;i<s.length;i++){if(p===s[i]||p.indexOf(s[i]+'/')===0)return}" +
    `var t=localStorage.getItem(${JSON.stringify(GREETING_SHOWN_KEY)});` +
    `if(t&&Date.now()-Number(t)<${JSON.stringify(GREETING_COOLDOWN_MS)})return;` +
    "var l=document.createElement('link');l.rel='preload';l.as='image';l.type='image/webp';" +
    `l.href=${JSON.stringify(GREETING_ART.src)};` +
    "l.setAttribute('fetchpriority','high');document.head.appendChild(l)" +
    '}catch(e){}' +
    '})();'
  );
}
