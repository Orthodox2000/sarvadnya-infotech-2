// CHANGE: 2026-11-17 — owner: "ensure DMS prices are never mentioned anywhere".
// Static guard (no DB, no network): the DMS module is quote-led, like every other
// add-on in lib/tdl-catalog.mjs. A price can only reach /modules/document-management
// through the curated `pricing` field, so that field and every DMS-facing copy
// block are checked here. Run: npm run check:dms-prices (wired into test:all).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

// Currency amounts only. Plain "price list" is a document-format example in the
// seed copy, not a DMS price, so it must not trip the guard.
const MONEY = /(?:₹|\bRs\.?\s?\d|\bINR\s?\d|\d[\d,]*\s*\/\s*-|\b\d[\d,]*\s*rupees?\b)/i
const PRICE_FIELD = /\bpricing\s*:/
const problems = []

const fail = (where, text) => {
  const hit = text.match(MONEY)?.[0] ?? 'pricing field'
  problems.push(`${where}: DMS price mention found (${hit})`)
}

// 1. Curated module detail — the only object that feeds the DMS route.
const detail = read('lib/module-details.ts')
const marker = 'const DOCUMENT_MANAGEMENT: ModuleDetail = {'
const start = detail.indexOf(marker)
if (start < 0) {
  problems.push('lib/module-details.ts: DOCUMENT_MANAGEMENT block not found')
} else {
  let depth = 0
  let end = -1
  for (let i = detail.indexOf('{', start); i < detail.length; i++) {
    if (detail[i] === '{') depth++
    else if (detail[i] === '}' && --depth === 0) { end = i; break }
  }
  const block = detail.slice(start, end < 0 ? detail.length : end)
  if (PRICE_FIELD.test(block)) problems.push('lib/module-details.ts: DMS has a pricing field (ModuleCta would render a price)')
  if (MONEY.test(block)) fail('lib/module-details.ts DOCUMENT_MANAGEMENT', block)
}

// 2. Every news post that links to the DMS page (the older product intro + the
//    2026-11-17 audit cluster) must stay free of amounts.
const seed = read('scripts/seed_news.mjs')
const dmsSlugs = [
  'document-management-system-for-tally',
  'audit-preparation-checklist-small-business',
  'attach-documents-in-tallyprime',
  'audit-document-struggles-and-solutions',
]
for (const slug of dmsSlugs) {
  const from = seed.indexOf(`slug: '${slug}'`)
  if (from < 0) {
    problems.push(`scripts/seed_news.mjs: DMS post "${slug}" missing`)
    continue
  }
  const next = seed.indexOf("    slug: '", from + 1)
  const block = seed.slice(from, next < 0 ? seed.length : next)
  if (MONEY.test(block)) fail(`scripts/seed_news.mjs "${slug}"`, block)
}

// 3. Navigation, popup and the module template must not carry DMS price copy.
for (const file of [
  'lib/greeting-popup.ts',
  'app/components/GreetingPopup.tsx',
  'lib/product-nav.ts',
  'app/components/Productbar.tsx',
  'app/sitemap.ts',
  'app/(site)/modules/[slug]/page.tsx',
]) {
  read(file).split(/\r?\n/).forEach((line, i) => {
    if (/document-management|Document Management/i.test(line) && MONEY.test(line)) {
      fail(`${file}:${i + 1}`, line)
    }
  })
}

if (problems.length) {
  console.error('FAIL: DMS price guard:')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log('PASS: no DMS price mentioned on the module page, in DMS articles, nav, popup or sitemap.')
