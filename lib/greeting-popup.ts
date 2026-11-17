// CHANGE: 2026-11-17 — shared constants for the site-wide greeting popup. Successor of the
// 2026-11-16 Diwali-derived card. The timing no longer reads a retired localStorage flag: it is
// driven by the visitor session the admin already tracks.
//
// WHY THIS FILE EXISTS: two places must agree on the same strings —
//   app/layout.tsx                   builds the <head> preload script (server)
//   app/components/GreetingPopup.tsx renders the card (client)
// and a mismatch between a preload href and the <img> src silently downloads the artwork twice.
// Pure constants + a string builder, no React, no browser API at module scope, so importing it
// from a server component does not pull anything client-only into the server bundle.
//
// BEHAVIOUR (owner, 2026-11-17):
//   new visitor      -> no `svd_vid` cookie at load -> the card opens as soon as it mounts
//   repeat visitor   -> `svd_vid` cookie already present -> opens GREETING_REVISIT_DELAY_MS later
//   the flag is raised in SESSION storage at show time, but a visit that already has a visitor
//     session resets it to false first, so the 20 s timer is guaranteed on every repeat visit.
//   neither sees it on /checkout or on the test-only demo cart.
//
// "Repeat visitor" comes from VisitorProvider's long-lived `svd_vid` cookie — the very id
// /api/identify records in the admin's `visitors` collection. The <head> script reads it BEFORE
// VisitorProvider can create it, so the new/repeat decision cannot be corrupted by bootstrap.
//
// Remove this file together with the component and its layout mount.

/**
 * Base for the per-tab popup flag. CHANGE 2026-11-17: now written to **sessionStorage** at open
 * time (was localStorage), so a repeat visitor can see the card again in a later session. The
 * in-memory ref in the component is the fallback when storage is blocked.
 */
export const GREETING_STORAGE_KEY = 'svd_greeting_2026';

/**
 * sessionStorage key. '1' = handled; a repeat visit resets it to '0' before scheduling its timer
 * so an older flag can never suppress the card on the 2nd, 3rd, ... visit.
 */
export const GREETING_SESSION_KEY = `${GREETING_STORAGE_KEY}_session`;

/**
 * The visitor-session cookie written by VisitorProvider (app/components/VisitorProvider.tsx).
 * This is the id /api/identify stores in the admin's `visitors` collection, so its presence at
 * page load is the "known / repeat visitor" signal. Keep in sync with VisitorProvider's
 * SESSION_COOKIE — if it ever changes, both this constant and that one must change together.
 */
export const VISITOR_SESSION_COOKIE = 'svd_vid';

/**
 * window global installed by the <head> preload script before hydration.
 * true = the visitor-session cookie already existed at load time (repeat visitor -> 20 s delay).
 */
export const GREETING_RETURNING_GLOBAL = '__svdGreetingReturning';

/** How long a repeat visitor browses before the card appears. Immediate for a new session. */
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
 * TWO JOBS (change 2026-11-17):
 *   1. Capture the visitor-session cookie into `window.__svdGreetingReturning` BEFORE
 *      VisitorProvider mounts and creates it. This is the admin's session/visitor signal that
 *      decides immediate (new) vs 20 s delayed (repeat) in GreetingPopup.tsx.
 *   2. Preload the artwork for a NEW session only — its card opens on mount, so the image must
 *      already be on its way. A repeat visitor's card waits 20 s, so no speculative download.
 *
 * The per-tab sessionStorage flag suppresses both the preload and (in the component) the card.
 * Deliberately tiny and dependency-free; every storage access is wrapped in try/catch so a
 * blocked cookie jar / storage cannot throw in <head>.
 */
export function buildGreetingPreloadScript(): string {
  return (
    '(function(){' +
    'try{' +
    `window[${JSON.stringify(GREETING_RETURNING_GLOBAL)}]=('; '+document.cookie).indexOf(${JSON.stringify(`; ${VISITOR_SESSION_COOKIE}=`)})>-1;` +
    '}catch(e){}' +
    'try{' +
    `var p=location.pathname,s=${JSON.stringify(GREETING_SKIP_PATHS)};` +
    "for(var i=0;i<s.length;i++){if(p===s[i]||p.indexOf(s[i]+'/')===0)return}" +
    `if(sessionStorage.getItem(${JSON.stringify(GREETING_SESSION_KEY)}))return;` +
    `if(window[${JSON.stringify(GREETING_RETURNING_GLOBAL)}])return;` +
    "var l=document.createElement('link');l.rel='preload';l.as='image';l.type='image/webp';" +
    `l.href=${JSON.stringify(GREETING_ART.src)};` +
    "l.setAttribute('fetchpriority','high');document.head.appendChild(l)" +
    '}catch(e){}' +
    '})();'
  );
}
