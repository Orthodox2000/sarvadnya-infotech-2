// CHANGE: 2026-10-29 — image alt-text guard (new).
// WHY: alt text is the only thing a screen reader, an image search result and an AI crawler
// have to go on. A missing alt breaks WCAG 1.1.1; a generic alt ("logo", "banner",
// "screenshot") is technically present and therefore invisible to every existing linter,
// while telling nobody anything. This audit makes both classes fail the build instead of
// relying on review.
//
// WHAT IT CHECKS: every <img> and next/image <Image> tag under app/ must carry an `alt`
// prop. `alt=""` is VALID — that is the correct markup for a purely decorative image and
// is deliberate wherever used. What fails:
//   1. no `alt` prop at all                       (WCAG 1.1.1 violation)
//   2. a generic placeholder value                ("image", "logo", "banner", ...)
//   3. a filename value                           ("hero.png", "aws-cloud.webp", ...)
//
// Static values only. `alt={expr}` cannot be evaluated without running the app, so an
// expression is treated as VALID (the probe is deliberately not a type checker); a
// `{...spread}` on the tag is also skipped for the same reason.
//
// Run: npm run check:alt   (exit 1 on any violation)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const APP = join(ROOT, 'app')

// Words that are "an alt exists" but communicate nothing. Compared case-insensitively
// against the WHOLE normalised value, so "Cloud Access" or "TallyPrime Gold logo" pass:
// the failure is a value that is nothing BUT the generic word.
const GENERIC = new Set([
  'image',
  'img',
  'picture',
  'pic',
  'photo',
  'logo',
  'icon',
  'banner',
  'hero',
  'screenshot',
  'screen shot',
  'placeholder',
  'thumbnail',
  'thumb',
  'graphic',
  'untitled',
  'alt',
])

const FILENAME_RE = /^[^\s]+\.(png|jpe?g|webp|svg|gif|avif|bmp|tiff?)$/i

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

// Quote-aware comment stripper, identical in behaviour to scripts/seo-audit.mjs.
// A `//` inside 'https://…' is NOT a comment; lengths are preserved so reported line
// numbers stay accurate.
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

// Returns the source text of an image tag starting at `start` (index of '<').
// Tracks quotes and JSX braces so a `>` inside `className={"a > b"}` or inside a
// template literal does not terminate the tag early. Returns null when unterminated.
function readTag(src, start) {
  let i = start + 1
  let depth = 0
  let quote = null
  while (i < src.length) {
    const ch = src[i]
    if (quote) {
      if (ch === '\\') {
        i += 2
        continue
      }
      if (ch === quote) quote = null
      i++
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      i++
      continue
    }
    if (ch === '{') depth++
    else if (ch === '}') depth = Math.max(0, depth - 1)
    else if (ch === '>' && depth === 0) return src.slice(start, i + 1)
    i++
  }
  return null
}

function lineOf(src, index) {
  let line = 1
  for (let i = 0; i < index && i < src.length; i++) if (src[i] === '\n') line++
  return line
}

// Extracts the alt prop value from a tag body.
// => { kind: 'missing' | 'expression' | 'string' | 'spread', value }
function readAlt(tag) {
  if (/\{\s*\.\.\.[^}]*\}/.test(tag)) return { kind: 'spread', value: null }

  // alt="x" | alt='x' | alt={`x`} | alt={"x"} | alt={expr}
  const m = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\}|\{([\s\S]*?)\})/)
  if (!m) {
    // An `alt` mentioned without `=` cannot be valid JSX; treat as missing.
    return { kind: 'missing', value: null }
  }
  if (m[1] !== undefined) return { kind: 'string', value: m[1] }
  if (m[2] !== undefined) return { kind: 'string', value: m[2] }
  if (m[3] !== undefined) return { kind: 'string', value: m[3] }
  if (m[4] !== undefined) return { kind: 'string', value: m[4] }
  if (m[5] !== undefined) return { kind: 'string', value: m[5] }
  return { kind: 'expression', value: null }
}

const files = walk(APP)
const failures = []
let tags = 0
let decorated = 0
let expressionAlt = 0

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const src = stripComments(raw)
  const rel = relative(ROOT, file).replaceAll('\\', '/')

  const re = /<(img|Image)(?=[\s/>])/g
  let match
  while ((match = re.exec(src)) !== null) {
    const tag = readTag(src, match.index)
    if (!tag) continue
    tags++
    const line = lineOf(src, match.index)
    const where = `${rel}:${line}`
    const alt = readAlt(tag)

    if (alt.kind === 'spread') continue
    if (alt.kind === 'missing') {
      failures.push({ where, reason: 'no alt prop', tag: tag.replace(/\s+/g, ' ').slice(0, 100) })
      continue
    }
    if (alt.kind === 'expression') {
      expressionAlt++
      continue
    }

    const value = alt.value.trim()
    if (value === '') {
      decorated++ // explicitly decorative — correct markup, not a defect
      continue
    }
    const normalised = value.toLowerCase().replace(/\s+/g, ' ')
    if (GENERIC.has(normalised)) {
      failures.push({ where, reason: `generic alt "${value}"`, tag: '' })
      continue
    }
    if (FILENAME_RE.test(value)) {
      failures.push({ where, reason: `alt is a filename "${value}"`, tag: '' })
    }
  }
}

console.log(
  `[alt-audit] scanned ${files.length} .tsx files; ${tags} image tag(s) — ` +
    `${decorated} empty (decorative), ${expressionAlt} dynamic (not statically checkable)`
)

if (failures.length) {
  console.error(`\nFAIL: ${failures.length} image(s) without a meaningful alt:`)
  for (const f of failures) {
    console.error(`  - ${f.where}  ${f.reason}${f.tag ? `\n      ${f.tag}` : ''}`)
  }
  console.error(
    '\nFix: describe what the image SHOWS. Use alt="" only for genuinely decorative images.'
  )
  process.exit(1)
}

console.log('\nPASS: every image has a meaningful alt (or is explicitly decorative).')
