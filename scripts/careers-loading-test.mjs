#!/usr/bin/env node
/**
 * CHANGE: 2026-10-06 — Task 3 suite (plan docs/superpowers/plans/2026-10-06-security-careers-seo.md).
 *
 * /careers loading-state test. While `/api/auth/careers/me` and `/api/careers/visible` are HELD
 * (request interception), it asserts the loading skeletons are content-shaped and stable, then
 * releases and asserts the swap to real content causes no layout jump:
 *
 *   (a) skeletons present with aria-busy while the calls are held
 *   (b) openings placeholders are ROW-SHAPED — >= 3 child placeholders per row, and each row's
 *       height within ~20px of the final OpeningRow height measured after release (same viewport)
 *   (c) auth card placeholders shaped like the real form — a title bar + 2 field-height blocks
 *       + a distinct button-height block, card height within ~28px of the final form card
 *   (d) after release: final content row heights ≈ skeleton heights (no big layout jump)
 *   (e) zero hydration errors and no horizontal overflow at 360px
 *
 * Screenshots land in /tmp/opencode/careers-{width}-{held|final}.png for owner review.
 *
 * Requires: a dev server on BASE_URL (default http://localhost:3000) and puppeteer (devDependency).
 * Run: npm run test:careers-loading
 *
 * The failure messages are written against the CURRENT (pre-fix) skeleton so a RED run reads as
 * a spec: "flat 92px boxes" is exactly the defect Task 3 exists to remove.
 */
import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const SHOT_DIR = '/tmp/opencode';
let fails = 0;
let checks = 0;
const ok = (m) => { checks++; console.log(`  ✅ ${m}`); };
const bad = (m) => { checks++; fails++; console.log(`  ❌ ${m}`); };

const VIEWPORTS = [
  { w: 360, h: 740, name: '360' },
  { w: 768, h: 800, name: '768' },
  { w: 1440, h: 900, name: '1440' },
];

async function health() {
  try {
    const r = await fetch(`${BASE}/api/prices`, { signal: AbortSignal.timeout(5000) });
    return r.ok;
  } catch {
    return false;
  }
}

/** Collect the held-phase skeleton measurements inside the page.
 * Placeholder bars carry a non-transparent background; walking the tree for
 * `colored` blocks lets the assertions work on nested skeletons (head/form/footer
 * wrappers) and distinguishes CTA bars (teal tint) from field bars (warm tint). */
async function measureHeld(page) {
  return page.evaluate(() => {
    const colored = (root) => {
      if (!root) return [];
      const out = [];
      for (const el of root.querySelectorAll('*')) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)') {
          const r = el.getBoundingClientRect();
          if (r.height >= 4 && r.width >= 4) {
            out.push({ h: Math.round(r.height), w: Math.round(r.width), bg });
          }
        }
      }
      return out;
    };
    const authEl = document.querySelector('#careers-auth-column [aria-busy="true"]');
    const openEl = document.querySelector('[aria-label="Loading openings"]');
    return {
      authBusy: !!authEl,
      auth: authEl
        ? {
            h: Math.round(authEl.getBoundingClientRect().height),
            w: Math.round(authEl.getBoundingClientRect().width),
            blocks: colored(authEl),
          }
        : null,
      openingsBusy: !!openEl,
      openings: openEl
        ? {
            rows: [...openEl.children].map((row) => ({
              h: Math.round(row.getBoundingClientRect().height),
              blocks: colored(row),
            })),
          }
        : null,
    };
  });
}

/** Collect the post-release final content measurements. */
async function measureFinal(page) {
  return page.evaluate(() => {
    const authCard = document.querySelector('#careers-auth-column .rounded-2xl');
    const rows = [...document.querySelectorAll('article.rounded-2xl.bg-white')];
    return {
      auth: authCard
        ? { h: Math.round(authCard.getBoundingClientRect().height) }
        : null,
      openingRows: rows.map((r) => Math.round(r.getBoundingClientRect().height)),
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });
}

async function runViewport(browser, vp, isFirst) {
  console.log(`\n── ${vp.name}px ──`);
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
  const browserErrors = [];
  const held = [];
  let releaseMe = false;
  let releaseVisible = false;

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    try {
      if (u.endsWith('/api/auth/careers/me') && !releaseMe) {
        held.push(() => req.continue());
        return;
      }
      if (u.endsWith('/api/careers/visible') && !releaseVisible) {
        held.push(() => req.continue());
        return;
      }
      req.continue();
    } catch {
      /* page closed mid-hold — ignore */
    }
  });
  page.on('pageerror', (e) => browserErrors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const t = m.text();
      // Filter favicon 404s etc. — only real client errors matter.
      if (!/favicon|net::|Failed to load resource/i.test(t)) browserErrors.push(t);
    }
  });

  // First load pays the Turbopack compile tax (can take 30-60s on this machine).
  await page.goto(`${BASE}/careers`, {
    waitUntil: 'domcontentloaded',
    timeout: isFirst ? 120000 : 60000,
  });

  // mounted fade completes in 600ms + staggered delays; settle on the skeletons.
  await new Promise((r) => setTimeout(r, 1600));

  const heldS = await measureHeld(page);
  await page.screenshot({ path: `${SHOT_DIR}/careers-${vp.name}-held.png` });

  // ── assertions on the HELD state ─────────────────────────────────────────────
  // (a) skeletons present with aria-busy.
  if (heldS.authBusy && heldS.openingsBusy) {
    ok('(a) auth + openings skeletons render with aria-busy while calls are held');
  } else {
    bad(`(a) skeleton missing: auth=${heldS.authBusy} openings=${heldS.openingsBusy}`);
  }

  if (heldS.auth && heldS.openings) {
    const authW = heldS.auth.w || 360;
    const authBlocks = heldS.auth.blocks || [];
    const title = authBlocks.filter((b) => b.h <= 32 && b.w < authW * 0.6);
    // Field bars: the real inputs are ~40-44px with a warm input tint.
    const fieldish = authBlocks.filter((b) => b.h >= 34 && b.h <= 64);
    // The field tint is the MOST COMMON bg among field-height blocks (2 inputs beat 1 CTA).
    const bgCounts = new Map();
    for (const b of fieldish) bgCounts.set(b.bg, (bgCounts.get(b.bg) || 0) + 1);
    let mainFieldBg = null;
    for (const bg of bgCounts.keys()) {
      if (!mainFieldBg || bgCounts.get(bg) > bgCounts.get(mainFieldBg)) mainFieldBg = bg;
    }
    // CTA bar: full-width, and a DIFFERENT tint from the field bars (teal CTA vs warm input).
    const button = fieldish.filter((b) => b.w >= authW * 0.5 && b.bg !== mainFieldBg);
    const heightClasses = new Set(authBlocks.map((b) => Math.floor(b.h / 12)));

    // (c) auth card shaped like the form: title bar + 2 field blocks + a distinct button block.
    if (title.length >= 1) ok('(c) auth skeleton has a title bar');
    else bad(`(c) auth skeleton lacks a title bar (blocks: ${JSON.stringify(authBlocks)})`);
    if (fieldish.length >= 2) ok(`(c) auth skeleton has ${fieldish.length} field-height blocks (34-64px)`);
    else bad(`(c) auth skeleton needs 2+ field-height blocks (34-64px), got ${fieldish.length}`);
    if (button.length >= 1) ok('(c) auth skeleton has a full-width CTA bar in a distinct tint');
    else bad(`(c) auth skeleton missing a distinct CTA bar (main field tint: ${mainFieldBg})`);
    if (heightClasses.size >= 3) ok(`(c) auth skeleton blocks vary in height (${heightClasses.size} height classes)`);
    else bad(`(c) auth skeleton blocks are samey heights (${heightClasses.size} classes) — the "flat grey boxes" defect`);

    // (b) openings placeholders ROW-SHAPED: >=3 placeholder bars per row.
    const rows = heldS.openings.rows || [];
    if (rows.length >= 1) {
      const counts = rows.map((r) => r.blocks.length);
      const shaped = rows.filter((r) => r.blocks.length >= 3).length;
      if (shaped === rows.length) ok(`(b) every skeleton row is row-shaped (${counts.join('/')} placeholder bars each)`);
      else bad(`(b) skeleton rows need >=3 placeholder bars each, got counts ${counts.join('/')} — flat ${rows[0]?.h ?? '?'}px boxes`);
    } else {
      bad('(b) no openings skeleton rows found');
    }
  } else {
    bad(`(a)(b)(c) could not measure skeletons (auth=${JSON.stringify(heldS.auth)?.slice(0, 60)} openings=${JSON.stringify(heldS.openings)?.slice(0, 60)})`);
  }

  // ── release the API calls, measure the swap ──────────────────────────────────
  releaseMe = true;
  releaseVisible = true;
  for (const c of held) c();

  try {
    await page.waitForFunction(
      () =>
        !document.querySelector('[aria-label="Loading openings"]') &&
        !document.querySelector('#careers-auth-column [aria-busy="true"]'),
      { timeout: 10000 }
    );
  } catch {
    /* kept for the post-release read below — the final rows may still be measured */
  }
  // Real rows fade in over 600ms + stagger; let them settle.
  await new Promise((r) => setTimeout(r, 1400));

  const fin = await measureFinal(page);
  await page.screenshot({ path: `${SHOT_DIR}/careers-${vp.name}-final.png` });

  // (d) no big layout jump: skeleton row height ≈ final row height (within 20px).
  const skRows = (heldS.openings?.rows || []).filter((r) => r && r.h > 0);
  const finRows = fin.openingRows || [];
  if (finRows.length === 0) {
    bad(`(d) no final opening rows to compare at ${vp.name}px — is the database seeded? (node scripts/seed_careers.mjs)`);
  } else if (skRows.length > 0) {
    const avgFin = finRows.reduce((a, b) => a + b, 0) / finRows.length;
    const worst = Math.max(...skRows.map((r) => Math.abs(r.h - avgFin)));
    if (worst <= 20) ok(`(d) skeleton rows (${skRows.map((r) => r.h).join('/')}px) hold ~final row height ${Math.round(avgFin)}px (±20px)`);
    else bad(`(d) layout jump: skeleton rows ${skRows.map((r) => r.h).join('/')}px vs final ${Math.round(avgFin)}px — worst delta ${Math.round(worst)}px`);
  }

  if (heldS.auth && fin.auth) {
    const delta = Math.abs(heldS.auth.h - fin.auth.h);
    if (delta <= 28) ok(`(d) auth card height stable: skeleton ${heldS.auth.h}px vs form ${fin.auth.h}px (±28px)`);
    else bad(`(d) auth card jumps: skeleton ${heldS.auth.h}px vs final ${fin.auth.h}px (delta ${delta}px)`);
  }

  // (e) no horizontal overflow at 360px (bug class: the navbar row overflow).
  if (vp.w === 360) {
    if (fin.scrollW <= fin.clientW) ok('(e) no horizontal overflow at 360px');
    else bad(`(e) horizontal overflow at 360px: scrollWidth ${fin.scrollW} > clientWidth ${fin.clientW}`);
  }

  // Hydration errors: React emits "Hydration failed ..." on console.error.
  const hydration = browserErrors.filter((e) => /hydrat/i.test(e));
  if (hydration.length === 0) ok('(e) zero hydration errors');
  else bad(`(e) ${hydration.length} hydration error(s): ${hydration[0]?.slice(0, 140)}`);

  await page.close();
}

async function main() {
  if (!(await health())) {
    console.error(
      `❌ No dev server on ${BASE}. Start it first:\n   npm run dev\nThen rerun npm run test:careers-loading`
    );
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  for (let i = 0; i < VIEWPORTS.length; i++) {
    await runViewport(browser, VIEWPORTS[i], i === 0);
  }
  await browser.close();

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`${checks - fails}/${checks} checks passed`);
  process.exit(fails === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('Suite crashed:', e);
  process.exit(1);
});