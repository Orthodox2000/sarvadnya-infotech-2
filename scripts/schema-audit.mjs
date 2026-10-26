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
//   4. `aggregateRating` is emitted ONLY where the page visibly shows that product's own
//      rating: gold 4.8/120 and server 4.7/85. The numbers must match the on-page list, so
//      the markup can never claim a rating a visitor cannot see.
//   5. Silver, TallyDrive and TSS emit NO aggregateRating (their 4.8/120 figures belong to
//      OTHER products in the sidebar block, and admitting that would be fake social proof).
//   6. /products/server emits NO Offer - the page shows no price, so the markup never
//      invents one ("Contact Sales").
//   7. Every Offer price derives from `payablePaise / 100` (the server-authoritative price),
//      never a hardcoded number that could drift from what the page displays.
//   8. The TallyDrive Product name matches its only Offer's `itemOffered` (the node describes
//      the item that is actually sold - Extra Storage - not the whole product family).
//   9. `sku` values are unique, so two pages cannot claim the same product identity.
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

// ── 4-9. per-call-site checks ─────────────────────────────────────────────────────────────

/** The only pages allowed to emit aggregateRating, with the figure their page displays. */
const RATING_ALLOWLIST = {
  'app/(site)/products/gold/page.tsx': { name: 'TallyPrime Gold', rating: '4.8', reviews: '120' },
  'app/(site)/products/server/page.tsx': { name: 'TallyPrime Server', rating: '4.7', reviews: '85' },
}

/** Pages that must never carry aggregateRating, even though 4.8/120 appears on them. */
const RATING_FORBIDDEN = [
  'app/(site)/products/silver/page.tsx',
  'app/(site)/products/tallydrive/page.tsx',
  'app/(site)/services/tss/page.tsx',
]

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

  const hasRating = /aggregateRating\s*:/.test(call)
  const allowed = RATING_ALLOWLIST[file]

  if (hasRating && !allowed) {
    problems.push(
      `${file}: emits aggregateRating but is not on the verified-ratings allowlist - ` +
        'only pages that visibly display that product\'s own rating may do so (gold, server)',
    )
  }
  if (!hasRating && allowed) {
    problems.push(`${file}: expected aggregateRating (${allowed.rating}/${allowed.reviews}) - it is shown on the page`)
  }
  if (RATING_FORBIDDEN.includes(file) && hasRating) {
    problems.push(
      `${file}: must NOT emit aggregateRating - the 4.8/120 figure on this page belongs to OTHER ` +
        'products in the "Most Popular Software" block, not to this product',
    )
  }

  if (allowed && hasRating) {
    const rv = call.match(/ratingValue:\s*'([^']+)'/)?.[1]
    const rc = call.match(/reviewCount:\s*'([^']+)'/)?.[1]
    if (rv !== allowed.rating || rc !== allowed.reviews) {
      problems.push(
        `${file}: aggregateRating ${rv ?? '?'}/${rc ?? '?'} does not match the allowlist ` +
          `${allowed.rating}/${allowed.reviews}`,
      )
    }
    // The same figure must be visible on the page, on a row naming THIS product.
    const { code } = source.get(path)
    const visible = code
      .split('\n')
      .some(
        (l) =>
          l.includes(`name: '${allowed.name}'`) &&
          l.includes(`rating: '${allowed.rating}'`) &&
          l.includes(`reviews: '${allowed.reviews}'`),
      )
    if (!visible) {
      problems.push(
        `${file}: aggregateRating ${allowed.rating}/${allowed.reviews} is NOT visible on the page for ` +
          `"${allowed.name}" - markup must never claim a rating a visitor cannot see`,
      )
    }
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

checked.push('aggregateRating allowlist matches the on-page ratings')
checked.push('no invented prices (Offer omitted where no price is shown)')
checked.push('TallyDrive node name matches its only Offer')

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
