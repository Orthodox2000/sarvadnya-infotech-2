#!/usr/bin/env node
// CHANGE: 2026-10-02 — standalone CSV append + validator for "daily logs/excel logs.csv" (SP-1 Task 9).
// WHY A SCRIPT AND NOT A HEREDOC: Thread C of "daily logs/2026-10-02.md" records that this file was
// silently corrupt for three months because appends were never parsed afterwards — and that an
// INLINE parser once reported a contradictory row count because of a typo in the heredoc, not
// because the file was wrong. The failure mode was indistinguishable from real corruption, so this
// is versioned, re-runnable code.
//
// WHY THE BRITTLE INVARIANTS: every one below was observed in the wild.
//   BOM        — Excel needs it to read the file as UTF-8.
//   CRLF, zero bare LF — mixed endings make Excel show phantom rows.
//   no trailing newline — a final newline yields an empty 80th row.
//   exactly 2 fields — the header is DATE,PROGRESS; anything else is a real malformation.
//   DD-MM-YY   — the established format; ISO sorts wrongly for a human reader.
//
// USAGE:  node scripts/excel-log-append.mjs --dry-run "02-10-26" "text..."
//         node scripts/excel-log-append.mjs "02-10-26" "text..."
// Aborts WITHOUT writing if any pre-flight invariant fails. Post-write re-validates and, if the
// on-disk state no longer matches, reports loudly rather than pretending success.
//
// EXCEL_LOG_PATH overrides the target file. That exists so the negative controls below can run
// against a throwaway copy — a validator you cannot test on a corrupt input is a validator you
// have not tested at all.

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';

const CSV = process.env.EXCEL_LOG_PATH || 'daily logs/excel logs.csv';
// Written as an escape, not a literal glyph: a real BOM character in source is invisible and
// survives or dies at the mercy of whichever tool next saves the file.
const BOM = '﻿';
const EXPECTED_FIELDS = 2;
const DATE_RE = /^\d{2}-\d{2}-\d{2}$/;

/** Minimal RFC-4180 field splitter: honours quoting and "" escapes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r' && text[i + 1] === '\n') { row.push(field); field = ''; rows.push(row); row = []; i++; }
    else if (c === '\n') { row.push(field); field = ''; rows.push(row); row = []; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function quote(v) {
  // Always quote the PROGRESS column: it routinely contains commas, quotes and newlines.
  return `"${v.replace(/"/g, '""')}"`;
}

function inspect(raw) {
  const problems = [];
  // NOTE: `raw` is a Buffer. Two traps live here and both bit during development of this file:
  //   1. Buffer has no .endsWith — hence the decoded `str`.
  //   2. `bufA !== bufB` compares object identity, so a BOM check written that way is ALWAYS
  //      true. It must be `.equals()`.
  // The BOM is 3 bytes but exactly 1 character once decoded, so the body is `str.slice(1)` —
  // not `.slice(3)`, which would cut into the first date.
  const str = raw.toString('utf8');
  const hasBom = raw.subarray(0, 3).equals(Buffer.from(BOM, 'utf8'));
  if (!hasBom) problems.push('BOM missing');
  if (str.endsWith('\n')) {
    problems.push('file ends with a newline — that produces an empty trailing row');
  }
  const crlf = countAll(raw, '\r\n');
  const totalLf = countAll(raw, '\n');
  if (crlf === 0) problems.push('no CRLF endings at all');
  if (totalLf !== crlf) problems.push(`bare LF present: ${totalLf - crlf} of ${totalLf} LFs are unpaired`);

  const rows = parseCsv(hasBom ? str.slice(1) : str);
  const badWidth = rows.filter((r) => r.length !== EXPECTED_FIELDS);
  if (badWidth.length) {
    problems.push(`${badWidth.length} row(s) do not have ${EXPECTED_FIELDS} fields (first: ${JSON.stringify(badWidth[0].slice(0, 2))})`);
  }
  const badDates = rows.slice(1).filter((r) => !DATE_RE.test(r[0] || ''));
  if (badDates.length) {
    problems.push(`${badDates.length} row(s) have a non-DD-MM-YY date (first: ${JSON.stringify(badDates[0][0])})`);
  }
  if ((rows[0] || []).join(',') !== 'DATE,PROGRESS') {
    problems.push(`unexpected header: ${JSON.stringify(rows[0])}`);
  }
  return { problems, rows, crlf, totalLf, hasBom };
}

function countAll(buf, needle) {
  let n = 0;
  let i = 0;
  const s = Buffer.isBuffer(buf) ? buf.toString('latin1') : buf;
  while ((i = s.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
  return n;
}

// ────────────────────────────── main ──────────────────────────────
const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const rest = argv.filter((a) => a !== '--dry-run');
const [date, ...textParts] = rest;

if (!date || textParts.length === 0) {
  console.error('usage: node scripts/excel-log-append.mjs [--dry-run] DD-MM-YY "progress text"');
  process.exit(2);
}
if (!DATE_RE.test(date)) {
  console.error(`ABORT: date "${date}" is not DD-MM-YY.`);
  process.exit(2);
}
const progress = textParts.join(' ').trim();
if (!progress) {
  console.error('ABORT: progress text is empty.');
  process.exit(2);
}

const before = readFileSync(CSV);
const pre = inspect(before);
console.log(`  pre-flight: ${pre.rows.length} rows, ${pre.crlf} CRLF, BOM ${before.slice(0, 3).equals(Buffer.from(BOM, 'utf8')) ? 'present' : 'MISSING'}`);
if (pre.problems.length) {
  console.error('\nABORT — the file is already malformed, refusing to append:');
  for (const p of pre.problems) console.error(`  - ${p}`);
  process.exit(1);
}

if (dryRun) {
  console.log(`\n  DRY RUN — would append row (${pre.rows.length}) ${date}`);
  console.log(`  field count would be ${EXPECTED_FIELDS}; progress length ${progress.length} chars`);
  process.exit(0);
}

// Append. The existing file has NO trailing newline, so the separator is added here.
const rowText = `${quote(date)},${quote(progress)}`;
const appended = Buffer.concat([before, Buffer.from(`\r\n${rowText}`, 'utf8')]);
const backup = `${CSV}.bak`;
copyFileSync(CSV, backup);
writeFileSync(CSV, appended);

const post = inspect(readFileSync(CSV));
console.log(`\n  appended row (${pre.rows.length}) ${date}`);
console.log(`  post-write: ${post.rows.length} rows, ${post.crlf} CRLF, progress length ${progress.length}`);
if (post.problems.length) {
  console.error('\nPOST-WRITE VALIDATION FAILED — restore from the backup:');
  for (const p of post.problems) console.error(`  - ${p}`);
  console.error(`  backup: ${backup}`);
  process.exit(1);
}
if (post.rows.length !== pre.rows.length + 1) {
  console.error(`\nROW COUNT WRONG: expected ${pre.rows.length + 1}, got ${post.rows.length}. Restore from ${backup}`);
  process.exit(1);
}
console.log('  OK — BOM, CRLF, field count, date format and trailing-newline invariants all hold.');
console.log(`  backup written: ${backup}`);