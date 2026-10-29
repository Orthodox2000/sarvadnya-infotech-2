// CHANGE: 2026-10-12 — top-of-the-line SEO guard.
// WHAT IT CHECKS (static, no network):
//   1. Every seoMetadata() call has a title, a description and a path (literal values).
//   2. Final <title> length >= 15 (search results truncate ~60 — over-length is a WARN
//      because the brand lives at the END, so truncation drops only the brand, not the
//      descriptive head).
//   3. No duplicate titles across pages (duplicate titles compete in SERPs).
//   4. Required SEO plumbing exists: app/robots.ts, app/sitemap.ts, app/opengraph-image.tsx,
//      app/favicon.ico, and the root layout metadata export.
//   5. Utility routes (checkout / demo / theme-settings) are noindex.
//   6. WARN: description longer than 160 chars AFTER an appended CONTACT_SUFFIX. Since
//      2026-10-29 the suffix is per-page (`contactSuffix: false` opts out), so the check only
//      adds the 38-char tail for pages that still carry it. (Google truncates / rewrites
//      descriptions anyway — trimming that copy is the owner's call.)
//   7. seoMetadata() must declare `images` in BOTH openGraph and twitter, because an explicit
//      openGraph without `images` suppresses app/opengraph-image.tsx on every page.
// Run: npm run check:seo   (exit 1 on any violation)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const APP = join(ROOT, 'app')

// Keep in sync with lib/seo.ts.
const CONTACT_SUFFIX = ' | Call: +91 9821 309060 | Navi Mumbai'
const BRAND_SUFFIX = ' | Sarvadnya Infotech LLP'
const DESC_MAX = 160
const TITLE_MAX = 60
const TITLE_MIN = 15
const DESC_MIN = 50

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (name.endsWith('.tsx') || name.endsWith('.ts')) out.push(full)
  }
  return out
}

// Find the index of the ')' closing the '(' at openIdx, skipping string/template literals so
// a ')' inside prose (e.g. "Tally (Silver, Gold)") can never close the call early.
function findCallEnd(src, openIdx) {
  let depth = 0
  for (let j = openIdx; j < src.length; j++) {
    const ch = src[j]
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      j++
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue }
        if (src[j] === quote) break
        j++
      }
      continue
    }
    if (ch === '(') depth++
    else if (ch === ')') { depth--; if (depth === 0) return j }
  }
  return -1
}

// CHANGE: 2026-10-27 — blank out comments before hunting for `seoMetadata(`.
// WHY: the first version scanned raw source, so a comment that merely MENTIONED
// seoMetadata() was parsed as a call with an empty argument list and the audit reported
// "missing title / description / path" on a page that was correct. Strings are preserved
// verbatim (a `//` inside 'https://…' is not a comment) and lengths are preserved so the
// existing index/offset logic keeps working unchanged.
function stripComments(src) {
  let out = ''
  let i = 0
  while (i < src.length) {
    const ch = src[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      out += ch
      i++
      while (i < src.length) {
        if (src[i] === '\\') {
          out += src[i] + (src[i + 1] ?? '')
          i += 2
          continue
        }
        out += src[i]
        if (src[i] === quote) {
          i++
          break
        }
        i++
      }
      continue
    }
    if (ch === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') {
        out += ' '
        i++
      }
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      out += '  '
      i += 2
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        out += src[i] === '\n' ? '\n' : ' '
        i++
      }
      if (i < src.length) {
        out += '  '
        i += 2
      }
      continue
    }
    out += ch
    i++
  }
  return out
}

function extractSeoCalls(src) {  const calls = []
  const marker = 'seoMetadata('
  let from = 0
  while (true) {
    const start = src.indexOf(marker, from)
    if (start === -1) break
    const openIdx = start + marker.length - 1 // index of '('
    const end = findCallEnd(src, openIdx)
    const block = src.slice(openIdx + 1, end === -1 ? src.length : end)
    const grab = (field) => {
      const r = new RegExp(field + "\\s*:\\s*([\"'`])([\\s\\S]*?)\\1")
      const mm = block.match(r)
      if (mm) return mm[2]
      // Non-literal value (identifier, expression, or ES shorthand `{ title }`):
      // undefined => caller skips checks it cannot statically evaluate.
      return new RegExp(`\\b${field}\\b`).test(block) ? undefined : null
    }
    calls.push({
      title: grab('title'),
      description: grab('description'),
      path: grab('path'),
      // CHANGE: 2026-10-29 — the contact CTA is now per-page (lib/seo.ts `contactSuffix`).
      // A page that sets `contactSuffix: false` gets the full 160-char description budget
      // instead of 122, so the length check must know which case it is looking at.
      usesContactSuffix: !/\bcontactSuffix\s*:\s*false\b/.test(block),
    })
    from = end === -1 ? src.length : end
  }
  return calls
}

const files = walk(APP)
const problems = []
const warnings = []
const titles = new Map()
let checked = 0
// CHANGE: 2026-10-29 — split counters so the contact-CTA policy is visible on every run.
let withSuffix = 0
let withoutSuffix = 0

for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/')
  const src = readFileSync(file, 'utf8')
  if (!src.includes('seoMetadata(')) continue
  for (const c of extractSeoCalls(stripComments(src))) {
    checked++
    if (c.title === null) problems.push(`${rel}: seoMetadata missing title`)
    if (c.description === null) problems.push(`${rel}: seoMetadata missing description`)
    if (c.path === null) problems.push(`${rel}: seoMetadata missing path`)
    else if (typeof c.path === 'string' && !c.path.startsWith('/')) problems.push(`${rel}: path "${c.path}" must start with /`)

    if (typeof c.title === 'string') {
      // The FINAL <title> gets the brand appended unless the title is already branded.
      const finalTitle = /sarvadnya infotech/i.test(c.title) ? c.title : `${c.title}${BRAND_SUFFIX}`
      const len = finalTitle.length
      if (len < TITLE_MIN) problems.push(`${rel}: final title ${len} chars (<${TITLE_MIN}): "${finalTitle}"`)
      if (len > TITLE_MAX) warnings.push(`${rel}: final title ${len} chars (>${TITLE_MAX}): "${finalTitle}"`)
      if (titles.has(finalTitle)) problems.push(`${rel}: duplicate title also used by ${titles.get(finalTitle)}: "${finalTitle}"`)
      else titles.set(finalTitle, rel)
    }
    if (typeof c.description === 'string') {
      // CHANGE: 2026-10-29 — the budget depends on whether this page opted into the contact CTA.
      const suffixLen = c.usesContactSuffix ? CONTACT_SUFFIX.length : 0
      const full = c.description.length + suffixLen
      if (full > DESC_MAX) warnings.push(`${rel}: description ${full} chars${suffixLen ? ' incl. suffix' : ''} (>${DESC_MAX})`)
      if (c.description.length < DESC_MIN) warnings.push(`${rel}: description ${c.description.length} chars (<${DESC_MIN})`)
      if (c.usesContactSuffix) withSuffix++
      else withoutSuffix++
    }
  }
}

// Required plumbing
const required = [
  'app/robots.ts',
  'app/sitemap.ts',
  'app/opengraph-image.tsx',
  'app/favicon.ico',
]
for (const f of required) if (!existsSync(join(ROOT, f))) problems.push(`missing required file: ${f}`)

// --- Share image (og:image / twitter:image) -------------------------------------------
// CHANGE: 2026-10-27 — guard added. WHY: seoMetadata() returns an explicit `openGraph`
// object, and in Next.js a page-level `openGraph` WITHOUT `images` REPLACES the
// file-based app/opengraph-image.tsx inheritance instead of merging with it. Measured
// before the fix: og:image was present on 0 of the 48 seoMetadata() pages, while /demo
// and /cart (which declare no openGraph at all) still carried it — so the 2026-10-12
// share-image work was inert site-wide. The file existing is not enough; the helper has
// to declare the image, otherwise every share card silently loses its artwork again.
const seoSrc = readFileSync(join(ROOT, 'lib/seo.ts'), 'utf8')
const ogStart = seoSrc.indexOf('openGraph: {')
const twStart = seoSrc.indexOf('twitter: {')
const noindexStart = seoSrc.indexOf('...(noindex', twStart)
if (ogStart === -1) problems.push('lib/seo.ts: seoMetadata() has no openGraph block')
if (twStart === -1 || twStart < ogStart) problems.push('lib/seo.ts: seoMetadata() has no twitter block after openGraph')
if (ogStart !== -1 && twStart > ogStart) {
  const ogBlock = seoSrc.slice(ogStart, twStart)
  if (!/\bimages\s*:/.test(ogBlock)) {
    problems.push('lib/seo.ts: openGraph declares no `images` — that suppresses app/opengraph-image.tsx on every page (og:image disappears)')
  }
  const twBlock = seoSrc.slice(twStart, noindexStart === -1 ? seoSrc.length : noindexStart)
  if (!/\bimages\s*:/.test(twBlock)) {
    problems.push('lib/seo.ts: twitter declares no `images` — the X/Twitter card loses its artwork')
  }
  if (!/summary_large_image/.test(twBlock)) {
    problems.push('lib/seo.ts: twitter card is not `summary_large_image` (a small card crops a 1200x630 share image)')
  }
}
// The helper points at the file-based route, so the two must agree on the name.
if (!/OG_IMAGE_PATH\s*=\s*['"]\/opengraph-image['"]/.test(seoSrc)) {
  problems.push('lib/seo.ts: OG_IMAGE_PATH must be /opengraph-image (the app/opengraph-image.tsx route)')
}

// Root layout must export metadata
const rootLayout = readFileSync(join(APP, 'layout.tsx'), 'utf8')
if (!/export const metadata/.test(rootLayout)) problems.push('app/layout.tsx: no `export const metadata`')

// Utility routes must be noindex
for (const p of ['app/(site)/checkout/page.tsx', 'app/(site)/demo/page.tsx', 'app/(site)/theme-settings/page.tsx']) {
  const full = join(ROOT, p)
  if (!existsSync(full)) continue
  const s = readFileSync(full, 'utf8')
  if (!/noindex/.test(s)) problems.push(`${p}: utility page is indexable (expected noindex)`)
}

console.log(`[seo-audit] checked ${checked} seoMetadata() calls across the app`)
// CHANGE: 2026-10-29 — report the contact-CTA split (commercial pages keep it, answer-first
// pages opt out and get the full 160-char budget).
console.log(`[seo-audit] contact CTA: ${withSuffix} page(s) on, ${withoutSuffix} opt-ed out`)
if (warnings.length) {
  console.log(`\nWARN (${warnings.length}) — non-fatal (length nits; the brand/CTA at the end is what truncates):`)
  for (const w of warnings) console.log('  ~ ' + w)
}
if (problems.length) {
  console.error('\nFAIL: SEO problems found:')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log('\nPASS: titles, canonical paths, plumbing and noindex all OK.')
