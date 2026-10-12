// CHANGE: 2026-10-12 — "exactly one H1 per page" guard.
// WHY: a page with two <h1> elements splits the document outline, which confuses both
// screen readers and search engines. The homepage had two (a hidden layout-measurement
// copy alongside the visible typing headline) and /learn-sara had none.
//
// WHAT THIS CHECKS: every *.tsx under app/ that renders a heading must render exactly ONE
// <h1>. Files in ALLOWLIST are exempt because their multiple <h1>s live in MUTUALLY
// EXCLUSIVE early-return branches (only one is ever rendered for a given request).
//
// Run: npm run check:h1   (exit 1 on any violation)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const APP = join(ROOT, 'app')

// Files whose multiple <h1>s are provably in mutually exclusive render branches:
//   - search / reset-password: early `if (...) return` before the main return
//   - both VerifyResult: one <h1> per payment state (verifying | success | failed)
const ALLOWLIST = new Set([
  'app/(site)/search/page.tsx',
  'app/(site)/careers/reset-password/page.tsx',
  'app/(site)/checkout/success/VerifyResult.tsx',
  'app/(site)/demo/checkout/success/VerifyResult.tsx',
])

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (name.endsWith('.tsx')) out.push(full)
  }
  return out
}

// Strip comments so an <h1> mentioned in prose (e.g. a CHANGE note) is never counted.
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '') // block + JSX {/* */} comments
    .replace(/\/\/[^\n]*/g, '')       // line comments
}

const files = walk(APP)
const violations = []
const missing = []
let headingFiles = 0

for (const file of files) {
  const src = stripComments(readFileSync(file, 'utf8'))
  // Count opening <h1 tags (self-closing or normal; ignore JSX like <h1x)
  const count = (src.match(/<h1(?=[\s/>])/g) || []).length
  const rel = relative(ROOT, file).replaceAll('\\', '/')
  if (count === 0) continue
  headingFiles++
  if (count > 1 && !ALLOWLIST.has(rel)) violations.push({ rel, count })
}

// Pages that should own an H1 but render none (heuristic: page.tsx with visible headings).
for (const file of files) {
  const rel = relative(ROOT, file).replaceAll('\\', '/')
  if (!rel.endsWith('page.tsx')) continue
  if (rel.includes('/api/')) continue
  const src = stripComments(readFileSync(file, 'utf8'))
  const h1 = (src.match(/<h1(?=[\s/>])/g) || []).length
  // Only flag a page that renders its OWN headings but no H1 (pages delegating to a
  // client component legitimately have 0 here; those components are scanned above).
  const ownsHeadings = /<h[23](?=[\s/>])/.test(src)
  if (h1 === 0 && ownsHeadings) missing.push(rel)
}

console.log(`[h1-audit] scanned ${files.length} .tsx files; ${headingFiles} render an H1`)
if (missing.length) {
  console.log('\nPages rendering sub-headings but no H1 (add one):')
  for (const m of missing) console.log('  - ' + m)
}
if (violations.length) {
  console.error('\nFAIL: files with more than one <h1> (mutually-exclusive allowlist does not cover them):')
  for (const v of violations) console.error(`  - ${v.rel}  (${v.count} H1s)`)
  process.exit(1)
}
if (missing.length) {
  console.error('\nFAIL: page(s) with sub-headings but no H1.')
  process.exit(1)
}
console.log('\nPASS: exactly one H1 per rendered page (allowlist: mutually-exclusive branches).')
