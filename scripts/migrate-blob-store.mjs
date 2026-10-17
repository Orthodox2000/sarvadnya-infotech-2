#!/usr/bin/env node
/**
 * CHANGE: 2026-10-17 — migrate Vercel Blob files from the OLD store(s) into the NEW store.
 *
 * WHY: the Blob read/write token was rotated to a new store, but the database still pointed at
 * files living in the old store(s) (e.g. the About/Team hero + partner images on
 * `7nmnibqapet2upei.public.blob.vercel-storage.com`). Any orphan files still sitting in an old
 * store were left unmanaged. This script downloads every referenced/orphan file and re-uploads it
 * to the NEW store, rewriting the database URLs in place.
 *
 * WHAT IT DOES
 *   1. Scans EVERY collection in the target DB for values that look like a Vercel Blob URL whose
 *      host is NOT the new store, and remembers the exact document + field path.
 *   2. (Optional) Lists each OLD store (given its read-write token) to also carry over ORPHAN
 *      blobs that are no longer referenced anywhere — so an old store can eventually be deleted.
 *   3. Downloads each file over its PUBLIC url (no token needed to read a public blob) and
 *      re-uploads it to the new store with the SAME pathname (so URLs stay human-recognisable).
 *   4. Rewrites every DB field that held an old URL to the new URL.
 *
 * SAFETY
 *   - DRY RUN BY DEFAULT. Pass `--apply` to actually upload + write.
 *   - Never deletes anything from the old store (owner decision).
 *   - Idempotent: a URL already on the new store is skipped; re-running `--apply` is safe.
 *   - Tokens are read from the environment ONLY — never hard-coded (see the 2026-10-09 secret
 *     incident in AGENTS.md §16). Do not commit a token into this file.
 *
 * USAGE
 *   # prod DB (the deployed frontend + admin share this one):
 *   MONGODB_URI="$(grep -m1 '^MONGODB_URI=' sarvadnya-advanced/.env | cut -d= -f2-)" \
 *   NEW_BLOB_TOKEN="vercel_blob_rw_<storeId>_<secret>" \
 *   OLD_BLOB_TOKENS="vercel_blob_rw_<oldId>_<secret>" \
 *   node scripts/migrate-blob-store.mjs            # dry run — prints the plan
 *
 *   # add --apply to perform the migration
 *
 * ENV
 *   MONGODB_URI       Target database (defaults to the local .env via dotenv/config).
 *   NEW_BLOB_TOKEN    REQUIRED. Read-write token of the NEW store (destination).
 *   OLD_BLOB_TOKENS   Optional, comma-separated read-write tokens of OLD stores — used to list
 *                     orphan blobs. Files reachable only by URL are still migrated without a token.
 */
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { put, list } from '@vercel/blob';
import fs from 'fs';

const APPLY = process.argv.includes('--apply');

const NEW_TOKEN = process.env.NEW_BLOB_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
if (!NEW_TOKEN || !NEW_TOKEN.startsWith('vercel_blob_rw_')) {
  console.error('ERROR: NEW_BLOB_TOKEN (or BLOB_READ_WRITE_TOKEN) must be a vercel_blob_rw_* token.');
  process.exit(1);
}
// store id is the segment between `vercel_blob_rw_` and the next `_`.
const newStoreId = NEW_TOKEN.replace(/^vercel_blob_rw_/, '').split('_')[0];
const NEW_HOST = `${newStoreId.toLowerCase()}.public.blob.vercel-storage.com`;

const OLD_TOKENS = (process.env.OLD_BLOB_TOKENS || '')
  .split(',')
  .map((s) => s.trim())
  .filter((s) => s.startsWith('vercel_blob_rw_'));

const BLOB_URL_RE = /https?:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>()\\]+/gi;

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI is not set.');
  process.exit(1);
}

/** Walk a document and collect every string that is a Vercel Blob URL, with its field path. */
function collectBlobUrls(obj, path, out) {
  if (obj == null) return;
  if (typeof obj === 'string') {
    if (obj.includes('.public.blob.vercel-storage.com')) {
      BLOB_URL_RE.lastIndex = 0;
      const matches = obj.match(BLOB_URL_RE);
      if (matches) for (const m of matches) out.push({ path, url: m });
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectBlobUrls(v, path ? `${path}.${i}` : String(i), out));
    return;
  }
  if (typeof obj === 'object') {
    for (const k of Object.keys(obj)) collectBlobUrls(obj[k], path ? `${path}.${k}` : k, out);
  }
}

function hostOf(url) {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return '';
  }
}

function pathnameOf(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));
  } catch {
    return '';
  }
}

/** Download a public blob and re-upload it to the new store under the same pathname. */
async function copyToNewStore(url) {
  const pathname = pathnameOf(url);
  if (!pathname) throw new Error(`Cannot derive pathname from ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const blob = await put(pathname, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: NEW_TOKEN,
  });
  return { newUrl: blob.url, size: body.length, pathname };
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db();
console.log(`Target DB : ${db.databaseName}`);
console.log(`New store : ${newStoreId}  (host ${NEW_HOST})`);
console.log(`Mode      : ${APPLY ? 'APPLY (uploads + DB writes)' : 'DRY RUN (reads only)'}`);

// ---------------------------------------------------------------------------------------------
// 1. DB-referenced blob URLs that are NOT on the new store
// ---------------------------------------------------------------------------------------------
const refs = []; // { collection, _id, path, url }
for (const c of await db.listCollections().toArray()) {
  const col = db.collection(c.name);
  if ((await col.countDocuments()) === 0) continue;
  for await (const doc of col.find({})) {
    const found = [];
    collectBlobUrls(doc, '', found);
    for (const f of found) {
      if (hostOf(f.url) !== NEW_HOST) refs.push({ collection: c.name, _id: doc._id, path: f.path, url: f.url });
    }
  }
}

// De-duplicate by URL (a file may be referenced from several fields).
const byUrl = new Map(); // url -> { url, refs: [...] }
for (const r of refs) {
  if (!byUrl.has(r.url)) byUrl.set(r.url, { url: r.url, refs: [] });
  byUrl.get(r.url).refs.push(r);
}
console.log(`\nDB-referenced old-store files: ${byUrl.size}`);

// ---------------------------------------------------------------------------------------------
// 2. Orphan blobs listed from old-store tokens (carried over for completeness; no DB rows change)
// ---------------------------------------------------------------------------------------------
const orphans = []; // { url, pathname }
for (const token of OLD_TOKENS) {
  try {
    const { blobs } = await list({ token });
    for (const b of blobs) {
      if (hostOf(b.url) === NEW_HOST) continue;
      if (byUrl.has(b.url)) continue;
      orphans.push({ url: b.url, pathname: b.pathname });
    }
    console.log(`Old store listed  : ${blobs.length} blob(s), ${orphans.length} orphan(s) so far`);
  } catch (e) {
    console.warn(`  ! could not list an old store token: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------------------------
// 3. Build the plan / execute it
// ---------------------------------------------------------------------------------------------
const report = { newStore: newStoreId, db: db.databaseName, applied: APPLY, migrated: [], orphans: [], errors: [] };

for (const { url, refs: fieldRefs } of byUrl.values()) {
  const pathname = pathnameOf(url);
  try {
    if (!APPLY) {
      // Dry run: verify the source is reachable without writing anything.
      const head = await fetch(url, { method: 'HEAD' });
      console.log(`  [plan] ${url}\n         -> https://${NEW_HOST}/${pathname}  (${head.status})`);
      report.migrated.push({ from: url, to: `https://${NEW_HOST}/${pathname}`, status: head.status, applied: false });
      continue;
    }
    const { newUrl, size } = await copyToNewStore(url);
    // Rewrite every field that held the old URL.
    for (const r of fieldRefs) {
      await db.collection(r.collection).updateOne({ _id: r._id }, { $set: { [r.path]: newUrl } });
    }
    console.log(`  [done] ${url}\n         -> ${newUrl}  (${size} B, ${fieldRefs.length} field(s) updated)`);
    report.migrated.push({ from: url, to: newUrl, size, fields: fieldRefs.length, applied: true });
  } catch (e) {
    console.error(`  [FAIL] ${url}: ${e.message}`);
    report.errors.push({ url, error: e.message });
  }
}

for (const o of orphans) {
  try {
    if (!APPLY) {
      console.log(`  [plan] orphan ${o.url}  -> (${o.pathname})`);
      report.orphans.push({ from: o.url, to: `https://${NEW_HOST}/${o.pathname}`, applied: false });
      continue;
    }
    const { newUrl, size } = await copyToNewStore(o.url);
    console.log(`  [done] orphan ${o.url}\n         -> ${newUrl}  (${size} B)`);
    report.orphans.push({ from: o.url, to: newUrl, size, applied: true });
  } catch (e) {
    console.error(`  [FAIL] orphan ${o.url}: ${e.message}`);
    report.errors.push({ url: o.url, error: e.message });
  }
}

const reportPath = '/tmp/opencode/blob-migration-report.json';
try {
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
} catch {}
console.log(
  `\nSummary: ${report.migrated.length} referenced file(s), ${report.orphans.length} orphan(s), ` +
    `${report.errors.length} error(s). Report: ${reportPath}`
);
if (!APPLY) console.log('DRY RUN — re-run with --apply to perform the migration.');

await client.close();
