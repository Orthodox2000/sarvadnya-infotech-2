// CHANGE: 2026-10-07 — Task 5: static SEO internal-cross-linking assertions.
// Checks that the commercial pages link to /news (hub + articles) and to each
// other, that every /news/<slug> href used anywhere in app/ exists in the news
// seed (scripts/seed_news.mjs — the idempotent source of truth for article
// slugs; ultimate DB liveness is verified separately, see Task 6), and that no
// plain-http href exists in the app tree. Zero dependencies; plain `node`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const TARGETS = [
  'app/(site)/products/silver/page.tsx',
  'app/(site)/products/gold/page.tsx',
  'app/(site)/products/tallydrive/page.tsx',
  'app/(site)/services/tss/page.tsx',
];
const COMMERCIAL = ['/products/silver', '/products/gold', '/products/tallydrive', '/services/tss'];

// --- seed slugs (source of truth for /news links) ---
const seed = read('scripts/seed_news.mjs');
const slugSet = new Set([...seed.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]));

let passed = 0;
let failed = 0;
function check(name, cond, extra = '') {
  if (cond) {
    passed += 1;
    console.log(`PASS  — ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  — ${name}${extra ? ` (${extra})` : ''}`);
  }
  return cond;
}

// --- walk app/ for source files ---
function walk(dir, out = []) {
  for (const entry of readdirSync(join(ROOT, dir))) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (entry === 'node_modules') continue;
      walk(p, out);
    } else if (/\.(tsx|ts|mjs)$/.test(entry)) {
      out.push(p);
    }
  }
  return out;
}
const appFiles = walk('app');

console.log(`\n── 1. Commercial pages: /news + sibling cross-links ──`);
// Links pass through <SeoCrossLinks newsLinks={[{ href: '/news/…' }]} …/> as
// data literals AND render as real href attributes — match both forms.
const NEWS_HREF = /(?:href="|\bhref:\s*["'])\/news\/([a-z0-9-]+)["']/g;
const COMMERCIAL_RE = /(?:href="|\bhref:\s*["'])(\/products\/(?:silver|gold|tallydrive)|\/services\/tss)["']/g;
for (const rel of TARGETS) {
  const src = read(rel);
  check(`${rel}: mounts the SeoCrossLinks strip`, src.includes('SeoCrossLinks'));
  const newsHrefs = [...src.matchAll(NEWS_HREF)].map((m) => m[1]);
  check(`${rel}: links to ≥1 article (/news/<slug>)`, newsHrefs.length >= 1, JSON.stringify(newsHrefs));
  const cross = [...src.matchAll(COMMERCIAL_RE)].map((m) => m[1]);
  check(`${rel}: ≥1 cross-link to a sibling commercial page`, cross.length >= 1, JSON.stringify(cross));
}
const stripSrc = read('app/components/SeoCrossLinks.tsx');
check('SeoCrossLinks renders the /news hub link', /href="\/news"/.test(stripSrc));
check('SeoCrossLinks renders href={l.href} real anchors', /href=\{l\.href\}/.test(stripSrc));

console.log(`\n── 2. Every /news/<slug> href in app/ exists in the seed ──`);
const allNewsHrefs = new Set();
for (const f of appFiles) {
  const src = read(f);
  // both the JSX attribute form and the data-literal form
  const forms = /(?:href="|\bhref:\s*["'])\/news\/([a-z0-9-]+)["']/g;
  for (const m of src.matchAll(forms)) allNewsHrefs.add(m[1]);
}
let missing = 0;
for (const href of allNewsHrefs) {
  const slug = href.split('/').pop();
  if (!slugSet.has(slug)) {
    missing += 1;
    console.log(`  MISSING SEED SLUG: ${href}`);
  }
}
check(`all ${allNewsHrefs.size} unique /news hrefs exist in seed_news.mjs`, missing === 0, `missing: ${missing}`);
check('seed itself contains the Task 6 international-licenses post', slugSet.has('tallyprime-international-licenses'));

console.log(`\n── 3. News hub links back to commercial hubs ──`);
const newsHub = read('app/(site)/news/page.tsx');
const back = COMMERCIAL.filter((c) => newsHub.includes(`href="${c}"`));
check('news hub links back to ≥3 commercial pages (Silver/Gold/TallyDrive/TSS)', back.length >= 3, JSON.stringify(back));

console.log(`\n── 4. No plain-http hrefs anywhere in app/ ──`);
let httpHrefs = 0;
for (const f of appFiles) {
  const src = read(f);
  for (const m of src.matchAll(/href="http:\/\//g)) {
    httpHrefs += 1;
    console.log(`  HTTP HREF: ${f}`);
  }
}
check('zero href="http://" in app/ (no mixed content / internal http)', httpHrefs === 0, `found ${httpHrefs}`);

console.log(`\n${failed === 0 ? 'ALL SEO-LINKS ASSERTIONS PASSED' : `${failed} ASSERTIONS FAILED`} (${passed} passed / ${failed} failed)`);
process.exitCode = failed === 0 ? 0 : 1;