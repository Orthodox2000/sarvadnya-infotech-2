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
//   6. WARN: description longer than 160 chars AFTER the auto-appended CONTACT_SUFFIX (Google
//      truncates / rewrites descriptions anyway — trimming that copy is the owner's call).
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

function extractSeoCalls(src) {
  const calls = []
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
    calls.push({ title: grab('title'), description: grab('description'), path: grab('path') })
    from = end === -1 ? src.length : end
  }
  return calls
}

const files = walk(APP)
const problems = []
const warnings = []
const titles = new Map()
let checked = 0

for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/')
  const src = readFileSync(file, 'utf8')
  if (!src.includes('seoMetadata(')) continue
  for (const c of extractSeoCalls(src)) {
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
      const full = c.description.length + CONTACT_SUFFIX.length
      if (full > DESC_MAX) warnings.push(`${rel}: description ${full} chars incl. suffix (>${DESC_MAX})`)
      if (c.description.length < DESC_MIN) warnings.push(`${rel}: description ${c.description.length} chars (<${DESC_MIN})`)
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
