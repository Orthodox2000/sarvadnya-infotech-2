// CHANGE: 2026-10-02 — negative-control harness for scripts/check-demo-independence.mjs.
// WHY: the first version of that guard silently passed every probe — its `//`-comment
// stripper treated the `//` in `https://` as a comment, truncating the line and hiding
// the very hit it was meant to catch. A guard that cannot fail is worse than no guard.
// Each case below MUTATES, ASSERTS THE MUTATION LANDED, runs the guard, asserts the exit
// code, and restores — so a probe that never got applied can never read as a pass.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const GUARD = 'scripts/check-demo-independence.mjs';
const scratch = mkdtempSync(join(tmpdir(), 'demo-guard-'));

let pass = 0;
let fail = 0;
function report(name, ok, detail) {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  ok ? pass++ : fail++;
}

function runGuard() {
  try {
    execFileSync(process.execPath, [GUARD], { cwd: process.cwd(), stdio: 'pipe' });
    return { code: 0, out: '' };
  } catch (e) {
    return { code: e.status, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

/** Files this run has mutated and not yet restored, flushed on any exit path. */
const pending = new Map();
function flush() {
  for (const [file, content] of pending) {
    try {
      writeFileSync(file, content);
    } catch {
      /* best effort */
    }
  }
  pending.clear();
}
for (const sig of ['exit', 'SIGINT', 'SIGTERM', 'uncaughtException']) {
  process.on(sig, flush);
}

/** Apply a mutation, prove it changed the file, run the guard, then restore. */
function probe(name, target, mutate, expectCode) {
  const before = readFileSync(target, 'utf8');
  const mutated = mutate(before);
  if (mutated === before) {
    report(name, false, 'MUTATION DID NOT APPLY — probe is invalid, not a pass');
    return;
  }
  pending.set(target, before);
  writeFileSync(target, mutated);
  try {
    const { code, out } = runGuard();
    report(name, code === expectCode, `expected exit ${expectCode}, got ${code}${code === expectCode ? '' : `\n${out.split('\n').filter((l) => l.includes('demo')).slice(0, 3).join('\n')}`}`);
  } finally {
    writeFileSync(target, before);
    pending.delete(target);
  }
}

// Baseline must be green before any probe means anything.
const base = runGuard();
report('baseline: clean tree passes', base.code === 0, `exit ${base.code}`);

probe(
  'https:// URL ending in /demo is caught (the original bug)',
  'app/(site)/contact/page.tsx',
  (s) => `${s}\nconst probe = "https://example.com/demo"\n`,
  1,
);

probe(
  'plain string /demo is caught',
  'lib/sara-topics.ts',
  (s) => `${s}\nconst probe = "/demo";\n`,
  1,
);

probe(
  'allowlist drift: extra /demo on a NEW line in an allowlisted file is caught',
  'app/robots.ts',
  (s) => s.replace('disallow: [', "disallow: ['/demo', "),
  1,
);

probe(
  'allowlist drift: 2nd /demo on an ALREADY allowlisted line is caught',
  'app/robots.ts',
  (s) => s.replace("'/demo/',", "'/demo/', '/demo',"),
  1,
);

probe(
  'allowlist drift: a link repointed BACK to /demo on an allowlisted line is caught',
  'lib/sara-topics.ts',
  (s) => s.replace('[[Book a Demo|/contact]]', '[[Book a Demo|/demo]]'),
  1,
);

probe(
  'comment-only /demo is ignored',
  'app/sitemap.ts',
  (s) => `${s}\n// prose mentioning /demo here\n`,
  0,
);

probe(
  'a URL that merely CONTAINS demo elsewhere is ignored',
  'app/sitemap.ts',
  (s) => `${s}\nconst unrelated = "https://example.com/democracy";\n`,
  0,
);

flush();
rmSync(scratch, { recursive: true, force: true });
const after = runGuard();
report('post-run: tree restored, guard green again', after.code === 0, `exit ${after.code}`);

console.log(`\n  ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);