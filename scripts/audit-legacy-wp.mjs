// CHANGE: 2026-09-17 — One-shot audit of the old WordPress dump (sarvadny_wp458.sql).
// Extracts published posts/pages/products + Woocommerce terms from wpmh_* tables and
// classifies every old URL against the live Next.js route set / existing 301 / 410 layers.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SQL_PATH = process.argv[2] || 'C:/Users/hp/AppData/Local/Temp/opencode/legacy/sarvadny_wp458.sql';
const OUT_PATH = process.argv[3] || join(dirname(fileURLToPath(import.meta.url)), 'legacy-wp-audit.json');

// --- Live routes on the current Next.js site (app/sitemap.ts static list) ---
const LIVE_ROUTES = new Set([
  '', '/about', '/addons', '/capabilities', '/careers', '/cloud', '/cloud/aws',
  '/cloud/windows', '/cloud/backup-for-tally', '/cloud/tallycloudaccess', '/contact',
  '/do-more', '/eula', '/find-solution', '/hrms', '/modules', '/news', '/privacy',
  '/products', '/products/silver', '/products/gold', '/products/server',
  '/products/tallydrive', '/products/tallycapital', '/report-problem', '/services',
  '/services/amc', '/services/corporate-training', '/services/mobile-app-biz',
  '/services/tally-on-whatsapp', '/services/tdl', '/services/tss', '/team', '/terms', '/tutorials',
]);

// --- Existing 301 redirect sources (next.config.js) ---
const REDIRECT_SOURCES = new Set([
  '/cloud/nosky', '/tally-erp-9-single-multi-user-license', '/tally-prime',
  '/tally-prime-product', '/tally-product-2', '/upgrade-of-tally-erp-9-products',
  '/housing-societies-2', '/erp-consulting-services-3',
  '/customized-ready-modules-for-specific-business-lines',
  '/tally-software-implementation-service', '/small-add-ons-in-tally-erp-9',
]);

// --- Existing 410 GONE paths (middleware.ts) ---
const GONE_PATHS = new Set([
  '/shop/bumper+stickers', '/shop/gallery-boards', '/shop/framed-prints',
  '/shop/all-mouse-pads', '/shop/cool+stickers', '/product', '/product/', '/feed',
  '/feed/', '/automobile-industries', '/automobile-industries/', '/author/admin/feed',
  '/author/admin/feed/',
]);

const noSlash = (s) => (s.endsWith('/') ? s.slice(0, -1) : s);
const withSlash = (s) => (s === '' || s.endsWith('/') ? s : `${s}/`);

// --- Minimal SQL string tokenizer ---
// Walks a VALUES block and returns every `( ... )` row tuple as an array of raw field strings.
function splitRows(tupleSource) {
  const rows = [];
  let i = 0;
  const n = tupleSource.length;
  while (i < n) {
    while (i < n && tupleSource[i] !== '(') i++;
    if (i >= n) break;
    let depth = 1;
    let inStr = false;
    let j = i + 1;
    const rowStart = i;
    while (j < n) {
      const c = tupleSource[j];
      if (inStr) {
        if (c === '\\') { j += 2; continue; }
        if (c === "'") inStr = false;
      } else if (c === "'") {
        inStr = true;
      } else if (c === '(') {
        depth++;
      } else if (c === ')') {
        depth--;
        if (depth === 0) break;
      }
      j++;
    }
    rows.push({ raw: tupleSource.slice(rowStart, j + 1), end: j });
    i = j + 1;
    // stop at statement terminator (new row would start with '(' only; safe to also stop on ';')
    const rest = tupleSource.slice(j + 1, j + 8);
    if (/^\s*;/.test(rest)) break;
  }
  return rows;
}

function splitFields(rowRaw) {
  const inner = rowRaw.slice(rowRaw.indexOf('(') + 1, rowRaw.lastIndexOf(')'));
  const fields = [];
  let buf = '';
  let inStr = false;
  for (let k = 0; k < inner.length; k++) {
    const c = inner[k];
    if (inStr) {
      buf += c;
      if (c === '\\') { buf += inner[k + 1] ?? ''; k++; continue; }
      if (c === "'") inStr = false;
    } else if (c === "'") {
      inStr = true;
      buf += c;
    } else if (c === ',') {
      fields.push(buf.trim());
      buf = '';
    } else {
      buf += c;
    }
  }
  fields.push(buf.trim());
  return fields;
}

function unquote(f) {
  if (f === 'NULL') return null;
  if (f.startsWith("'")) {
    let s = f.slice(1, -1);
    s = s.replace(/\\(['"\\])/g, '$1').replace(/\\\\/g, '\\');
    return s;
  }
  return f;
}

// --- Extract a table's INSERT rows with named columns ---
function extractTable(sql, table) {
  const results = [];
  const re = new RegExp(`INSERT INTO \\x60?${table}\\x60?\\s*(\\(([^)]+)\\))?\\s*VALUES`, 'g');
  let m;
  while ((m = re.exec(sql)) !== null) {
    // header columns (may be empty if omitted)
    const colsRaw = m[2] ? m[2].split(',').map((c) => c.trim().replace(/`/g, '')) : null;
    const start = m.index + m[0].length;
    const end = sql.indexOf(';\n', start);
    const block = sql.slice(start, end === -1 ? undefined : end);
    for (const row of splitRows(block)) {
      const fields = splitFields(row.raw).map(unquote);
      if (colsRaw) {
        const obj = {};
        colsRaw.forEach((c, idx) => { obj[c] = fields[idx] ?? null; });
        results.push(obj);
      } else {
        results.push(fields);
      }
    }
  }
  return results;
}

const sql = readFileSync(SQL_PATH, 'utf8');

// --- Options: permalink structure + home ---
const opts = extractTable(sql, 'wpmh_options');
const permalinkStructure = (opts.find((o) => o.option_name === 'permalink_structure')?.option_value || '').trim();
const home = (opts.find((o) => o.option_name === 'home')?.option_value || '').trim();

// --- Posts ---
const posts = extractTable(sql, 'wpmh_posts');
const published = posts.filter((p) => p.post_status === 'publish' && p.post_name);
console.log(`wpmh_posts rows parsed: ${posts.length}; publish with name: ${published.length}`);
console.log(`permalink_structure: ${permalinkStructure}`);

// --- Terms (product cats / post cats / tags) ---
const terms = extractTable(sql, 'wpmh_terms');
const termTax = extractTable(sql, 'wpmh_term_taxonomy');
const taxByTermId = new Map(termTax.map((t) => [t.term_taxonomy_id, t]));
const slugInfo = [];
for (const t of terms) {
  const tt = termTax.find((x) => x.term_id === t.term_id);
  if (tt && (tt.taxonomy === 'product_cat' || tt.taxonomy === 'category' || tt.taxonomy === 'product_tag')) {
    slugInfo.push({ slug: t.slug, taxonomy: tt.taxonomy, name: t.name, count: tt.count });
  }
}

// --- Classify a candidate old URL ---
function classify(pathname) {
  const bare = noSlash(pathname);
  if (LIVE_ROUTES.has(bare) || LIVE_ROUTES.has(withSlash(bare))) return 'LIVE';
  if (REDIRECT_SOURCES.has(bare) || REDIRECT_SOURCES.has(withSlash(bare))) return 'REDIRECTED';
  if (GONE_PATHS.has(bare) || GONE_PATHS.has(withSlash(bare))) return 'GONE';
  if (/^\/20\d\d\//.test(pathname)) return 'GONE (date archive prefix)';
  if (/^\/wp-/.test(pathname)) return 'GONE (wp prefix)';
  return 'UNMAPPED';
}

const manifest = {
  home,
  permalinkStructure,
  generatedAt: new Date().toISOString(),
  unmapped: [],
  pages: [],
  products: ['wpmh_posts'],
  terms: [],
  totals: {},
};

const postRows = [];
for (const p of published) {
  const url = `/${p.post_name}/`;
  const verdict = classify(url);
  postRows.push({
    url,
    type: p.post_type,
    status: p.post_status,
    date: p.post_date,
    title: (p.post_title || '').slice(0, 80),
    verdict,
  });
  if (verdict === 'UNMAPPED') manifest.unmapped.push({ url, type: p.post_type, date: p.post_date, title: (p.post_title || '').slice(0, 80) });
}

for (const s of slugInfo) {
  const url = s.taxonomy === 'product_cat' ? `/product-category/${s.slug}/` : `/category/${s.slug}/`;
  const verdict = classify(url);
  manifest.terms.push({ url, taxonomy: s.taxonomy, slug: s.slug, name: s.name, verdict });
  if (verdict === 'UNMAPPED') manifest.unmapped.push({ url, type: `term:${s.taxonomy}`, date: '', title: s.name });
}

manifest.totals = {
  posts: postRows.length,
  byType: postRows.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {}),
  unmapped: manifest.unmapped.length,
  terms: manifest.terms.length,
};
manifest.postRows = postRows;

writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2));

const byVerdict = {};
for (const r of postRows) byVerdict[r.verdict] = (byVerdict[r.verdict] || 0) + 1;
console.log('\nPost/page verdicts:', byVerdict);
console.log('\nUNMAPPED (need decision):');
for (const u of manifest.unmapped) console.log(`  ${u.type.padEnd(14)} ${u.url}`);
console.log(`\nManifest written to ${OUT_PATH}`);