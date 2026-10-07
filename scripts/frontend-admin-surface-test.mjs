// CHANGE: 2026-10-06 — static regression guard for the public frontend's attack surface.
// WHY (SP-4 Task 1): commit 1112177 added app/api/admin/careers/users (PII list) and
// app/api/admin/careers/[id]/visibility (unauthenticated job-state write) to THIS repo,
// where proxy.ts is dormant (Next 15 reads middleware.ts, which had no admin logic) —
// both shipped live with zero auth (probed 200 bare). The routes are deleted and
// middleware.ts gains a segment-exact /admin + /api/admin 404 block; this script fails
// the suite if either ever comes back, if the middleware block is removed/weakened, or
// if /api/careers/list starts leaking hidden (visible:false) jobs again.
//
// Checks are source-level (like scripts/check-demo-independence.mjs): no server needed,
// deterministic, and they run locally without touching the production database.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();

let failures = 0;
function pass(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); failures += 1; }
function check(label, condition, hint) {
  if (condition) pass(label);
  else fail(hint ? `${label} — ${hint}` : label);
}

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

// ─── 1. No admin route files anywhere under app/ ──────────────────────────────
console.log('\n🛡️  1. Frontend has zero admin route handlers');
function* walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name === 'sarvadnya-advanced') continue;
    const full = join(dir, name);
    if (isDir(full)) yield* walk(full);
    else yield full;
  }
}

const adminRouteFiles = [];
if (existsSync(join(ROOT, 'app', 'api', 'admin'))) {
  for (const f of walk(join(ROOT, 'app', 'api', 'admin'))) {
    if (f.endsWith('route.ts')) {
      adminRouteFiles.push(relative(ROOT, f).split(sep).join('/'));
    }
  }
}
check(
  'no app/api/admin/**/route.ts files exist',
  adminRouteFiles.length === 0,
  `found: ${adminRouteFiles.join(', ')} — public frontend must not host admin endpoints (they belong in sarvadnya-advanced, behind the middleware guard)`
);
check(
  'no app/admin/ page directory exists',
  !existsSync(join(ROOT, 'app', 'admin')),
  'admin pages were deliberately removed from this deployment (AGENTS §10)'
);

// ─── 2. middleware.ts carries the segment-exact admin block ───────────────────
console.log('\n🛡️  2. middleware.ts admin 404 block');
const mwRaw = readFileSync(join(ROOT, 'middleware.ts'), 'utf8');
// Comment prose may quote the clauses (the isAdminPath doc does) — strip line comments
// so only real code can satisfy these checks.
const mw = mwRaw.replace(/^\s*\/\/.*$/gm, '');

const ADMIN_CLAUSES = [
  "pathname === '/admin'",
  "pathname.startsWith('/admin/')",
  "pathname === '/api/admin'",
  "pathname.startsWith('/api/admin/')",
];
for (const clause of ADMIN_CLAUSES) {
  check(
    `block contains segment-exact clause: ${clause}`,
    mw.includes(clause),
    'a bare startsWith("/admin") would also match "/administrator" — keep all four clauses'
  );
}
check(
  'isAdminPath() is actually called inside middleware()',
  /export function middleware[\s\S]*?\bisAdminPath\(pathname\)/.test(mw),
  'defining the helper without calling it is a no-op'
);
const callIdx = mw.indexOf('isAdminPath(pathname)');
const corsIdx = mw.indexOf('const origin = request.headers.get');
check(
  'admin block runs BEFORE CORS/origin logic',
  callIdx !== -1 && corsIdx !== -1 && callIdx < corsIdx,
  'admin requests must short-circuit before any header work'
);
check(
  'admin API paths answer 404 (not 401/403 — the surface must look absent)',
  /isAdminPath[\s\S]{0,400}?404/.test(mw.slice(Math.max(0, callIdx - 200), callIdx + 600)),
  'return 404 for admin paths; 401 would confirm the routes exist'
);

// ─── 3. /api/careers/list must not leak hidden jobs ───────────────────────────
console.log('\n🛡️  3. /api/careers/list hides invisible jobs');
const listRoute = readFileSync(join(ROOT, 'app', 'api', 'careers', 'list', 'route.ts'), 'utf8');
// CHANGE-comment prose may legitimately mention the old query (e.g. "was find({})"),
// so scan code with line comments stripped — same rule as check-demo-independence.
const listCode = listRoute.replace(/^\s*\/\/.*$/gm, '');
const filter = 'visible: { $ne: false }';
const occurrences = listCode.split(filter).length - 1;
check(
  'both find() calls filter with `visible: { $ne: false }`',
  occurrences >= 2,
  `expected the filter on the pre-seed and post-seed queries (same shape as /api/careers/visible), found ${occurrences} occurrence(s)`
);
check(
  'no unfiltered `collection.find({})` remains in the list route',
  !listCode.includes('find({})'),
  'an unfiltered find() re-introduces the hidden-job leak'
);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n' + '━'.repeat(60));
if (failures > 0) {
  console.log(`❌ frontend admin surface: ${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('✅ frontend admin surface: all checks passed');
