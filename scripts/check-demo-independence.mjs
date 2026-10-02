// CHANGE: 2026-10-02 — permanent guard that the live site can never depend on /demo again.
// WHY: /demo used to be a homepage clone that 5 live chatbot/Sara code paths linked to as
// "Book a Demo". SP-1 repurposes /demo as a test-only cart scaffold, so a lingering link
// would send a customer who asks for a booking into a shopping cart. Convention is not
// enough — this fails the build/test run instead.
//
// SCAN: every /demo reference in app/, lib/ and components/, excluding the demo route itself.
// A hit inside a `//` comment is ignored (prose about /demo is fine). Anything else is a
// violation UNLESS the file is allowlisted below.
//
// ALLOWLIST: each entry must carry a `why` (no bare suppressions) AND an `expectedCount`.
// The count is pinned so the allowlist cannot rot: adding a new /demo reference to an
// allowlisted file trips the guard, instead of being silently permitted forever.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SCAN_ROOTS = ['app', 'lib', 'components'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'sarvadnya-advanced']);

// Paths that are allowed to contain /demo because they ARE the /demo implementation.
// Note `lib/demo` and `app/components/demo` are included: a demo component importing
// `@/lib/demo/cart.ts` matches `/demo` in the specifier, which is not a link target.
const DEMO_ROUTE_PREFIXES = [
  'app/(site)/demo',
  'app/api/demo',
  'app/components/demo',
  'lib/demo',
];

const ALLOWLIST = [
  {
    file: 'app/robots.ts',
    // 2 occurrences on one line: '/demo' and '/demo/'. Pinned per occurrence, not per line.
    expectedCount: 2,
    why: 'must actively disallow /demo so the test-only cart is never indexed',
  },
  {
    file: 'lib/form-destinations.ts',
    expectedCount: 1,
    why: 'the "demo" destination key is kept on purpose: deleting it would orphan the stored EMAIL_DESTINATION_RECIPIENTS.demo recipient in MongoDB and silently stop email routing',
  },
  {
    file: 'lib/sara-topics.ts',
    expectedCount: 1,
    why: 'NOT a route — this is the regex alternative /demo|trial|free|try|test/ matching the user\'s own word "demo". The link target was repointed to /contact; the regex must keep matching.',
  },
];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/**
 * Strip a trailing `//` comment.
 * A `//` directly preceded by `:` is a URL scheme (`https://`), NOT a comment — treating
 * it as one truncates the line and hides real hits. (A `//` inside a string literal is
 * still a blind spot; acceptable for a link-target guard, and noted in ALLOWLIST above.)
 */
function stripLineComment(line) {
  const m = line.match(/(^|[^:])\/\//);
  if (!m) return line;
  return line.slice(0, m.index + m[1].length);
}

// `/demo` as a route: must not be followed by an alphanumeric, so `/democracy` and
// `/demoPage` are not false positives. `/demo`, `/demo/`, `/demo?x` and `/demo#y` still match.
// Counted as OCCURRENCES, not lines — otherwise a second /demo appended to an already
// allowlisted line would slip past the pinned count.
const DEMO_RE = /\/demo(?![A-Za-z0-9])/g;

const allowByFile = new Map(ALLOWLIST.map((e) => [e.file, e]));
const violations = [];
const counts = new Map();
const allowedHits = [];

for (const scanRoot of SCAN_ROOTS) {
  for (const abs of walk(join(ROOT, scanRoot))) {
    const rel = relative(ROOT, abs).split(sep).join('/');
    if (DEMO_ROUTE_PREFIXES.some((p) => rel.startsWith(p))) continue;
    if (!EXTS.has(rel.slice(rel.lastIndexOf('.')))) continue;

    const lines = readFileSync(abs, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      const code = stripLineComment(line);
      const matches = code.match(DEMO_RE);
      if (!matches) return;
      const lineNo = idx + 1;
      const entry = allowByFile.get(rel);
      if (entry) {
        counts.set(rel, (counts.get(rel) ?? 0) + matches.length);
        allowedHits.push(
          `${rel}:${lineNo}  ${code.trim().slice(0, 88)}${matches.length > 1 ? `   [+${matches.length - 1} more on this line]` : ''}`,
        );
      } else {
        for (const _m of matches) {
          violations.push(`${rel}:${lineNo}  ${code.trim().slice(0, 88)}`);
        }
      }
    });
  }
}

// Allowlist drift: a pinned count that no longer matches means someone added a reference
// to a file we thought we had fully accounted for. Fail rather than trust it.
for (const entry of ALLOWLIST) {
  const seen = counts.get(entry.file) ?? 0;
  if (seen !== entry.expectedCount) {
    violations.push(
      `ALLOWLIST DRIFT  ${entry.file}: expected ${entry.expectedCount} /demo reference(s), found ${seen}. ` +
        `Re-review every hit and update expectedCount.`,
    );
  }
}

console.log('check:demo — /demo independence guard\n');

if (allowedHits.length) {
  console.log(`  Allowed (${allowedHits.length}) — each is deliberate:`);
  for (const h of allowedHits) console.log(`    ${h}`);
  console.log('');
}

if (violations.length) {
  console.error(`  FAILED — ${violations.length} production reference(s) to /demo:\n`);
  for (const v of violations) console.error(`    ${v}`);
  console.error(
    '\n  /demo is a TEST-ONLY cart scaffold. Point the link at /contact instead.\n' +
      '  If a hit is legitimate, add a { file, expectedCount, why } entry to ALLOWLIST in\n' +
      '  scripts/check-demo-independence.mjs — a `why` is mandatory.',
  );
  process.exit(1);
}

console.log('  PASS — no production code references /demo.');