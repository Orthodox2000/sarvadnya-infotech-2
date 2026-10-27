// CHANGE: 2026-10-26 - static guard for the schema.org Product/Offer decisions.
//
// WHY THIS EXISTS: Google Search Console raised structured-data issues on /products/silver,
// /products/tallydrive and /services/tss. Each one was resolved by a deliberate, argued
// decision - some fields were corrected, and three were dropped ON PURPOSE because the honest
// value is unknowable or would require publishing a policy the owner has ruled out. Those
// decisions are invisible in a code review (an absent field looks like an oversight), so this
// audit pins them. Without it, the next person who sees a GSC "missing field" warning will
// "fix" it by inventing a return window or a price-validity date, and the markup becomes a lie.
//
// WHAT IT CHECKS (static, no network, no build):
//   1. Exactly ONE Product builder exists (lib/seo.ts) - no page hand-rolls a second node.
//   2. `itemCondition: NewCondition` IS emitted on every Offer (licences are always new stock).
//   3. `hasMerchantReturnPolicy`, `shippingDetails` and `priceValidUntil` appear NOWHERE in
//      app/ or lib/ (comment-stripped, so the explanatory comment in lib/seo.ts is allowed).
//      These are permanent omissions, not TODOs - see the comment block in lib/seo.ts.
//   4. `aggregateRating` appears NOWHERE in app/ or lib/. Every per-product star count was
//      hand-typed with no review records behind it, so it was all removed - the honest markup
//      omits the field (see the note above productJsonLd() in lib/seo.ts).
//   5. No hand-typed `rating: '…'` / `reviews: '…'` figures survive anywhere in app/, and the
//      one permitted rating path is wired: lib/rating-summary.mjs exports the helpers and the
//      review wall computes its average with summariseRatings(). That number moves by itself
//      when reviews change, which is the whole point.
//   6. /products/server emits NO Offer - the page shows no price, so the markup never
//      invents one ("Contact Sales").
//   7. Every Offer price derives from `payablePaise / 100` (the server-authoritative price),
//      never a hardcoded number that could drift from what the page displays.
//   8. The TallyDrive Product name matches its only Offer's `itemOffered` (the node describes
//      the item that is actually sold - Extra Storage - not the whole product family).
//   9. `sku` values are unique, so two pages cannot claim the same product identity.
//  10. articleJsonLd() never receives a path as its `slug` (that produced
//      /news/<full-path> URLs which Google reported as failed indexing); and the builder
//      offers the `path` parameter non-/news articles need.
//
// Run: npm run check:schema   (exit 1 on any violation)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['app', 'lib']

const problems = []
const warnings = []
const checked = []

// ── helpers ────────────────────────────────────────────────────────────────────────────────

/**
 * Remove // and block comments so that a field NAMED in an explanatory comment is not
 * mistaken for a field that is actually emitted. Quote-aware enough for this codebase:
 * `https://` is skipped via the preceding-colon rule, and a `//` is only treated as a comment
 * when the line has an even number of quote characters before it.
 */
function stripComments(src) {
  let out = ''
  let inBlock = false
  for (const rawLine of src.split('\n')) {
    let line = rawLine
    if (inBlock) {
      const end = line.indexOf('*/')
      if (end === -1) {
        out += '\n'
        continue
      }
      line = line.slice(end + 2)
      inBlock = false
    }
    for (;;) {
      const start = line.indexOf('/*')
      if (start === -1) break
      const end = line.indexOf('*/', start + 2)
      if (end === -1) {
        line = line.slice(0, start)
        inBlock = true
        break
      }
      line = line.slice(0, start) + line.slice(end + 2)
    }
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] !== '/' || line[i + 1] !== '/') continue
      if (line[i - 1] === ':') continue // https:// / http://
      const before = line.slice(0, i)
      const quotes = (before.match(/["'`]/g) || []).length
      if (quotes % 2 === 0) {
        line = line.slice(0, i)
        break
      }
    }
    out += line + '\n'
  }
  return out
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, acc)
    else if (/\.(ts|tsx)$/.test(entry)) acc.push(full)
  }
  return acc
}

const files = SCAN_DIRS.filter((d) => existsSync(join(ROOT, d))).flatMap((d) => walk(join(ROOT, d)))
const source = new Map() // absolute path -> { raw, code }
for (const f of files) {
  const raw = readFileSync(f, 'utf8')
  source.set(f, { raw, code: stripComments(raw) })
}

const rel = (p) => relative(ROOT, p)

/** Extract the text of a `productJsonLd({ ... })` call, stopping at the closing `});`. */
function extractCall(code, index) {
  const start = code.indexOf('(', index)
  let depth = 0
  for (let i = start; i < code.length; i++) {
    const ch = code[i]
    if (ch === '(' || ch === '{' || ch === '[') depth++
    else if (ch === ')' || ch === '}' || ch === ']') {
      depth--
      if (depth === 0) return code.slice(index, i + 1)
    }
  }
  return code.slice(index)
}

// ── 1. exactly one Product builder ─────────────────────────────────────────────────────────

const productTypeFiles = []
for (const [path, { code }] of source) {
  // Matches `'@type': 'Product'` and `"@type": "Product"`.
  if (/['"]@type['"]\s*:\s*['"]Product['"]/.test(code)) productTypeFiles.push(path)
}

if (!productTypeFiles.some((p) => rel(p) === 'lib/seo.ts')) {
  problems.push('lib/seo.ts: the Product JSON-LD builder is missing')
}
const foreignBuilders = productTypeFiles.filter((p) => rel(p) !== 'lib/seo.ts')
if (foreignBuilders.length) {
  problems.push(
    `Product nodes are hand-built outside lib/seo.ts (use productJsonLd() instead): ${foreignBuilders
      .map(rel)
      .join(', ')}`,
  )
}
checked.push('single Product builder (lib/seo.ts)')

// ── 2. itemCondition is emitted ───────────────────────────────────────────────────────────

const seoPath = join(ROOT, 'lib/seo.ts')
const seoCode = source.get(seoPath)?.code ?? ''
if (!/itemCondition\s*:\s*'https:\/\/schema\.org\/NewCondition'/.test(seoCode)) {
  problems.push("lib/seo.ts: Offer must carry itemCondition 'https://schema.org/NewCondition'")
}
checked.push('Offer.itemCondition = NewCondition')

// ── 3. the three permanent omissions ──────────────────────────────────────────────────────

const FORBIDDEN = ['hasMerchantReturnPolicy', 'shippingDetails', 'priceValidUntil']
for (const field of FORBIDDEN) {
  const hits = []
  for (const [path, { code }] of source) {
    if (code.includes(field)) hits.push(rel(path))
  }
  if (hits.length) {
    problems.push(
      `${field} must stay OUT of the markup (see the omission rationale in lib/seo.ts) - found in: ${hits.join(', ')}`,
    )
  }
}
checked.push('hasMerchantReturnPolicy / shippingDetails / priceValidUntil absent')

// ── 4-5. ratings: the site may only display a computed one ────────────────────────────────
//
// CHANGE: 2026-10-26 — every hand-typed star count was removed from the site (product
// sidebars, product JSON-LD, /contact). Owner: "remove rating as most of them are fake, we only
// have testimonials and user rating as real, also ensure those dashboard rating and auto moving
// and not manual." Two rules keep the fakes from creeping back.

for (const [path, { code }] of source) {
  if (/aggregateRating\s*:/.test(code)) {
    problems.push(
      `${rel(path)}: emits aggregateRating - no per-product review records exist, so a Product ` +
        'rating cannot be honest. The only supported rating is the review-wall average computed ' +
        'by lib/rating-summary.mjs (see the note in lib/seo.ts)',
    )
  }
}
checked.push('aggregateRating emitted nowhere (no real per-product reviews to back it)')

// A hand-typed figure always looked like `rating: '4.8', reviews: '120'` in an item object.
// Quoted literals only, so TS annotations (`rating: number`) and log strings stay legal.
const HARDCODED_STARS = /\b(?:rating|reviews)\s*:\s*['"`]\s*\d/
for (const [path, { code }] of source) {
  for (const line of code.split('\n')) {
    if (HARDCODED_STARS.test(line)) {
      problems.push(
        `${rel(path)}: hard-coded star figure (${line.trim()}) - ratings must be computed from ` +
          'real reviews via lib/rating-summary.mjs, never typed by hand',
      )
    }
  }
}

// The permitted path must actually exist and actually be used, otherwise the two rules above
// would pass simply because nothing displays a rating at all.
const RATING_HELPER = join(ROOT, 'lib', 'rating-summary.mjs')
if (!existsSync(RATING_HELPER)) {
  problems.push('lib/rating-summary.mjs is missing - it is the only permitted rating source')
} else {
  const helper = readFileSync(RATING_HELPER, 'utf8')
  for (const fn of ['normalizeRating', 'summariseRatings', 'formatRating']) {
    if (!new RegExp(`export function ${fn}\\b`).test(helper)) {
      problems.push(`lib/rating-summary.mjs: expected exported ${fn}()`)
    }
  }
  const wall = readFileSync(join(ROOT, 'app', 'components', 'CustomerReviews.tsx'), 'utf8')
  if (!/from '@\/lib\/rating-summary\.mjs'/.test(wall) || !/summariseRatings\(/.test(wall)) {
    problems.push(
      'app/components/CustomerReviews.tsx: the review wall must compute its average with ' +
        'summariseRatings() - a manual figure would defeat the whole rule',
    )
  }
}
checked.push('review-wall average computed from lib/rating-summary.mjs')

// ── 6-9. per-call-site checks ─────────────────────────────────────────────────────────────

/** The only page allowed to ship a Product with no Offer (it displays no price). */
const NO_OFFER_ALLOWLIST = ['app/(site)/products/server/page.tsx']

const callSites = []
for (const [path, { code }] of source) {
  let idx = code.indexOf('productJsonLd(')
  while (idx !== -1) {
    // Skip the import line.
    const lineStart = code.lastIndexOf('\n', idx) + 1
    const lineText = code.slice(lineStart, code.indexOf('\n', idx))
    if (!/^\s*import\b/.test(lineText) && !/export function productJsonLd/.test(lineText)) {
      callSites.push({ path, call: extractCall(code, idx) })
    }
    idx = code.indexOf('productJsonLd(', idx + 1)
  }
}

if (!callSites.length) problems.push('no productJsonLd() call sites found - did the API change?')
checked.push(`${callSites.length} productJsonLd() call site(s)`)

const skus = new Map()

for (const { path, call } of callSites) {
  const file = rel(path)

  for (const field of ['name:', 'description:', 'url:']) {
    if (!call.includes(field)) problems.push(`${file}: productJsonLd() call is missing \`${field}\``)
  }

  const sku = call.match(/sku:\s*'([^']+)'/)?.[1]
  if (sku) {
    if (skus.has(sku)) problems.push(`${file}: sku '${sku}' is already used by ${skus.get(sku)}`)
    else skus.set(sku, file)
  }

  const hasOffers = /offers\s*:/.test(call)
  if (!hasOffers && !NO_OFFER_ALLOWLIST.includes(file)) {
    problems.push(
      `${file}: Product has no Offer - a priced page must emit one (only /products/server may omit it)`,
    )
  }
  if (hasOffers && NO_OFFER_ALLOWLIST.includes(file)) {
    problems.push(`${file}: must NOT emit an Offer - the page shows no price, so none may be invented`)
  }

  // Prices must come from the server-authoritative paise figure, never a literal.
  const offerBlocks = call.split('offers').slice(1).join('offers')
  if (hasOffers) {
    const usesPayable = /payablePaise\s*\/\s*100/.test(offerBlocks)
    if (!usesPayable) {
      problems.push(
        `${file}: Offer price is not derived from \`payablePaise / 100\` - hardcoded prices drift ` +
          'from the DB-driven figure the page displays',
      )
    }
    if (/priceRupees\s*:\s*\d/.test(offerBlocks)) {
      problems.push(`${file}: Offer price is a hardcoded number - use the resolved payable price`)
    }
  }

  // TallyDrive: the node describes the item actually sold, so its name must match the offer.
  if (file === 'app/(site)/products/tallydrive/page.tsx') {
    const name = call.match(/name:\s*'([^']+)'/)?.[1]
    const itemOffered = call.match(/itemOffered:\s*'([^']+)'/)?.[1]
    // Compare the bare product names: the Offer legitimately adds the duration qualifier
    // ("TallyDrive Extra Storage (10 GB)" sold as "(10 GB, 1 Year)"), but the item the node
    // describes must be the same one the Offer sells.
    const core = (s) => s.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    if (!name || !itemOffered) {
      problems.push(`${file}: expected both a Product name and a single Offer itemOffered`)
    } else if (core(itemOffered) !== core(name)) {
      problems.push(
        `${file}: Product name "${name}" does not match its only Offer "${itemOffered}" - ` +
          'the node must describe the item that is actually sold',
      )
    }
  }

  // TSS sells six durations; every Offer must say which one it is.
  if (file === 'app/(site)/services/tss/page.tsx') {
    if (!/itemOffered/.test(call)) {
      problems.push(`${file}: every TSS Offer must carry itemOffered (the plan name)`)
    }
  }
}

checked.push('no invented prices (Offer omitted where no price is shown)')
checked.push('TallyDrive node name matches its only Offer')

// ── 10. articleJsonLd(): a slug is a slug, never a path ──────────────────────────────────
//
// CHANGE: 2026-10-27 — rule added. WHY: articleJsonLd() prefixes `/news/` onto its `slug`
// (that is where articles originally lived), so the Tally Insights lesson page passing its
// full path as `slug` produced `url`/`mainEntityOfPage` like
// `/news/tally-insights/gst-compliance/tally-gst` - URLs that do not exist. Google crawled
// them and listed 10 of them in Search Console as failed indexing (23-24 Oct 2026). The
// builder now also accepts an explicit `path` (which wins over `slug`); this rule makes the
// mistake impossible to reintroduce, because any slash inside a `slug` value is a path.
const articleCallSites = []
for (const [path, { code }] of source) {
  let idx = code.indexOf('articleJsonLd(')
  while (idx !== -1) {
    const lineStart = code.lastIndexOf('\n', idx) + 1
    const lineText = code.slice(lineStart, code.indexOf('\n', idx))
    if (!/^\s*import\b/.test(lineText) && !/export function articleJsonLd/.test(lineText)) {
      articleCallSites.push({ path, call: extractCall(code, idx) })
    }
    idx = code.indexOf('articleJsonLd(', idx + 1)
  }
}

if (!articleCallSites.length) {
  problems.push('no articleJsonLd() call sites found - did the API change?')
}
if (!/export function articleJsonLd/.test(seoCode)) {
  problems.push('lib/seo.ts: articleJsonLd() is missing')
} else if (!/\bpath\??\s*:/.test(seoCode.slice(seoCode.indexOf('export function articleJsonLd')))) {
  problems.push(
    'lib/seo.ts: articleJsonLd() must accept an optional `path` - without it a non-/news ' +
      'article has no honest URL to declare',
  )
}

for (const { path, call } of articleCallSites) {
  const file = rel(path)
  const slug = call.match(/\bslug\s*:\s*(['"`])([\s\S]*?)\1/)
  if (slug && slug[2].includes('/')) {
    problems.push(
      `${file}: articleJsonLd() received slug "${slug[2]}" - a slug must not contain a slash. ` +
        'Slugs are appended to /news/, so a path here declares a URL that does not exist ' +
        '(pass `path:` instead)',
    )
  }
}

checked.push(`${articleCallSites.length} articleJsonLd() call site(s) carry a real slug`)

// ── report ────────────────────────────────────────────────────────────────────────────────

console.log(`[schema-audit] checked ${checked.length} rule group(s) across ${source.size} source files:`)
for (const c of checked) console.log('  ✓ ' + c)

if (warnings.length) {
  console.log(`\nWARN (${warnings.length}):`)
  for (const w of warnings) console.log('  ~ ' + w)
}

if (problems.length) {
  console.error(`\nFAIL: ${problems.length} structured-data problem(s):`)
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}

console.log('\nPASS: Product/Offer markup matches the documented decisions.')
