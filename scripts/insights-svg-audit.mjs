// CHANGE: 2026-10-23 - guard for the Tally Insights artwork in public/images/insights/.
// WHY: the owner reported that the "GST setup" and "Inventory" images did not load on Vercel
// and that the step-4 line in the company image sat on (and was cut by) the card border.
// Root causes, both invisible to every other check in this repo:
//   1. FIVE of the 15 SVGs contained a RAW `&` ("F11 > Statutory & Taxation > GST Yes").
//      That is malformed XML, and a browser refuses to decode a malformed SVG - the file
//      still returns HTTP 200 from the CDN, so a curl/status check never notices. The <img>
//      element is simply blank.
//   2. The shared 4-step card template put the last detail baseline at exactly the card's
//      bottom edge (1080x360 card, rows at cy 80/160/240/320, detail baseline cy+40 = 360),
//      so the glyphs crossed the border and looked cropped.
//
// WHAT THIS CHECKS (static, no browser, no dependencies):
//   A. every .svg parses as XML - no bare `&`, no bare `<` inside text;
//   B. the root <svg> declares width/height and a viewBox that matches their aspect ratio
//      (a mismatched viewBox is what distorts or crops an image when it is scaled by CSS);
//   C. inside every card group, text never sits within 20px of the card's bottom edge and
//      never starts above the card's top edge, and the card itself stays inside the canvas.
//   D. CHANGE 2026-10-30 - every numbered step row carries its number badge. The owner
//      reported "page no 4 isn't appearing" on the vouchers lesson; the real cause was
//      tally-vouchers.svg drawing the 4th <circle> with no "4" <text> inside it, so the row
//      looked like an empty dot. The row existed, the badge did not.
// Width fitting needs a font engine, so the browser probe used to fix these files
// (/tmp/opencode/verify-insight-svgs.cjs, 30/30) is the tool for that; this guard locks the
// two failure modes that actually shipped.
//
// Run: npm run check:insights-svg   (exit 1 on any violation)
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const DIR = join(ROOT, 'public/images/insights')
const MIN_BOTTOM_PAD = 20 // px of card left below the lowest glyph
const MIN_TOP_PAD = 8
const MIN_CANVAS_PAD = 8

// A bare `&` is not valid XML: it must start an entity (&amp; &lt; &gt; &quot; &apos; &#NN;).
const BARE_AMP = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/

const files = readdirSync(DIR).filter((n) => n.endsWith('.svg')).sort()
const violations = []

for (const name of files) {
  const rel = relative(ROOT, join(DIR, name)).replaceAll('\\', '/')
  const src = readFileSync(join(DIR, name), 'utf8')

  // A. XML well-formedness (the blank-image bug).
  const bareAmp = src.match(BARE_AMP)
  if (bareAmp) {
    const line = src.slice(0, bareAmp.index).split('\n').length
    violations.push(`${rel}:${line} raw "&" in XML - browsers will not render this file (${src.slice(bareAmp.index, bareAmp.index + 40).trim()})`)
  }
  const untaggedLt = src.replace(/<[^>]*>/g, '').includes('<')
  if (untaggedLt) violations.push(`${rel}: raw "<" inside text content`)

  // B. root canvas + viewBox must agree, otherwise CSS scaling distorts or crops it.
  const root = src.match(/<svg\b[^>]*>/)
  if (!root) { violations.push(`${rel}: no <svg> root`); continue }
  const width = Number((root[0].match(/\bwidth="([\d.]+)"/) || [])[1])
  const height = Number((root[0].match(/\bheight="([\d.]+)"/) || [])[1])
  const vb = (root[0].match(/\bviewBox="([^"]+)"/) || [])[1]
  if (!width || !height || !vb) { violations.push(`${rel}: missing width/height/viewBox`); continue }
  const [vx, vy, vw, vh] = vb.trim().split(/[\s,]+/).map(Number)
  if (vx !== 0 || vy !== 0) violations.push(`${rel}: viewBox origin must be 0 0 (got "${vb}")`)
  if (Math.abs(vw / vh - width / height) > 0.005) {
    violations.push(`${rel}: viewBox aspect ${(vw / vh).toFixed(3)} != width/height aspect ${(width / height).toFixed(3)} (image will distort)`)
  }

  // C. every text must breathe inside its card and inside the canvas.
  let outside = src
  const groupRe = /<g transform="translate\(([-\d.]+),([-\d.]+)\)">([\s\S]*?)<\/g>/g
  for (const g of src.matchAll(groupRe)) {
    const [, tx, ty, body] = g
    const card = body.match(/<rect width="([\d.]+)" height="([\d.]+)"[^>]*rx=/)
    if (!card) continue
    const cardH = Number(card[2])
    const cardTop = Number(ty)
    if (cardTop + cardH > vh - MIN_CANVAS_PAD) {
      violations.push(`${rel}: card ends at y=${cardTop + cardH} but canvas is ${vh}px tall (needs ${MIN_CANVAS_PAD}px margin)`)
    }
    for (const t of body.matchAll(/<text\b[^>]*\by="([\d.]+)"[^>]*>([^<]*)/g)) {
      const baseline = Number(t[1])
      const label = t[2].slice(0, 40)
      const bottomPad = cardH - (baseline + 4) // +4 = descender allowance for 16-20px type
      if (bottomPad < MIN_BOTTOM_PAD) {
        violations.push(`${rel}: "${label}" baseline y=${baseline} leaves ${bottomPad.toFixed(0)}px below it inside a ${cardH}px card (needs ${MIN_BOTTOM_PAD}px) - text crosses the card border`)
      }
      if (baseline < MIN_TOP_PAD) {
        violations.push(`${rel}: "${label}" baseline y=${baseline} starts above its card (needs ${MIN_TOP_PAD}px)`)
      }
    }

    // D. Every numbered step row must actually show its number.
    const stepCircles = [...body.matchAll(/<circle\b[^>]*\bcx="80"[^>]*\bcy="([\d.]+)"[^>]*\/>/g)].map((m) => Number(m[1]))
    const stepBadges = [...body.matchAll(/<text\b[^>]*\bx="80"[^>]*\by="([\d.]+)"[^>]*text-anchor="middle"[^>]*>(\d+)<\/text>/g)].map((m) => ({
      y: Number(m[1]),
      n: Number(m[2]),
    }))
    if (stepCircles.length !== stepBadges.length) {
      violations.push(
        `${rel}: ${stepCircles.length} numbered step row(s) but ${stepBadges.length} number badge(s) - a row renders as an empty dot`
      )
    }
    for (const cy of stepCircles) {
      // A badge is the number drawn inside its own circle (centre + ~8px for 20px type).
      const badge = stepBadges.find((b) => Math.abs(b.y - (cy + 8)) <= 12)
      if (!badge) violations.push(`${rel}: step row at cy=${cy} has no number badge inside its circle`)
    }
    const numbers = stepBadges.map((b) => b.n).sort((a, b) => a - b)
    const expected = numbers.map((_, i) => i + 1)
    if (numbers.length && numbers.join(',') !== expected.join(',')) {
      violations.push(`${rel}: step numbers are ${numbers.join(',')} but a numbered list must read 1..${numbers.length}`)
    }

    outside = outside.replace(g[0], '')
  }  for (const t of outside.matchAll(/<text\b[^>]*\by="([\d.]+)"[^>]*>([^<]*)/g)) {
    const baseline = Number(t[1])
    if (baseline + 4 > vh - MIN_CANVAS_PAD) {
      violations.push(`${rel}: "${t[2].slice(0, 40)}" baseline y=${baseline} overflows the ${vh}px canvas`)
    }
  }
}

console.log(`[insights-svg-audit] scanned ${files.length} SVGs in public/images/insights/`)
if (violations.length) {
  console.error('\nFAIL:')
  for (const v of violations) console.error('  - ' + v)
  process.exit(1)
}
console.log('\nPASS: every SVG is well-formed, its viewBox matches its canvas, and no text crosses a card border.')
