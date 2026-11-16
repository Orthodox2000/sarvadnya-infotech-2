// CHANGE: 2026-11-16 — shared constants for the site-wide greeting popup. Successor of the
// 2026-11-05 Diwali card (same component shape, one artwork, plus the 20 s rule for returning
// visitors). The word "Diwali" survives only in GREETING_LEGACY_KEY, which is read to recognise
// a returning visitor and is never written again.
//
// WHY THIS FILE EXISTS: two places must agree on the same strings —
//   app/layout.tsx                   builds the <head> preload script (server)
//   app/components/GreetingPopup.tsx renders the card (client)
// and a mismatch between a preload href and the <img> src silently downloads the artwork twice.
// Pure constants + a string builder, no React, no browser API at module scope, so importing it
// from a server component does not pull anything client-only into the server bundle.
//
// BEHAVIOUR (owner, 2026-11-16):
//   first-time visitor  -> the card opens as soon as it mounts and stays until it is closed
//   returning visitor   -> the card opens GREETING_REVISIT_DELAY_MS after landing, still once
//   neither ever sees it on /checkout or on the test-only demo cart
//
// Remove this file together with the component and its layout mount.

/**
 * localStorage flag for the CURRENT card. Written at open time by the component; read by both
 * the component (to stay shut) and the preload script (to stay silent).
 */
export const GREETING_STORAGE_KEY = 'svd_greeting_2026';

/**
 * The retired Diwali card's flag (2026-11-05 → 2026-11-16). Read ONLY: its presence is what
 * marks a visitor as returning, which is what earns the 20 s delay instead of an immediate
 * card. Never written — a visitor who only ever saw the old card stays "returning", which is
 * exactly the owner's rule ("old visitors see it 20 s later, once").
 */
export const GREETING_LEGACY_KEY = 'svd_diwali_2026';

/** How long a returning visitor browses before the card appears. Immediate for a first visit. */
export const GREETING_REVISIT_DELAY_MS = 20_000;

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
 * WHY: the popup is a client component that cannot render until hydration (both flags live in
 * localStorage, so the server cannot know). Without this, the artwork request only starts after
 * the JS bundle runs. Preloading here starts the download in parallel with HTML/CSS/JS.
 *
 * It fires ONLY for a true first visit: a visitor who already holds either flag creates no link
 * at all. For a returning visitor that is also the right call — the card waits 20 s, and a
 * download nobody may ever see should not compete with the first paint.
 *
 * Deliberately tiny and dependency-free; wrapped in try/catch so a blocked localStorage can
 * never throw in <head>.
 */
export function buildGreetingPreloadScript(): string {
  return (
    '(function(){try{' +
    `var p=location.pathname,s=${JSON.stringify(GREETING_SKIP_PATHS)};` +
    "for(var i=0;i<s.length;i++){if(p===s[i]||p.indexOf(s[i]+'/')===0)return}" +
    `if(localStorage.getItem(${JSON.stringify(GREETING_STORAGE_KEY)}))return;` +
    `if(localStorage.getItem(${JSON.stringify(GREETING_LEGACY_KEY)}))return;` +
    "var l=document.createElement('link');l.rel='preload';l.as='image';l.type='image/webp';" +
    `l.href=${JSON.stringify(GREETING_ART.src)};` +
    "l.setAttribute('fetchpriority','high');document.head.appendChild(l)" +
    '}catch(e){}})();'
  );
}
