// CHANGE: 2026-10-31 — Point every module at its real PDF brochure.
// WHY: the owner replaced the old brochure IMAGES with designed PDFs. The live
// `modules` documents still pointed at `/brochures/<name>.png`, so the "Brochure"
// button on /modules opened a picture instead of a document. This script updates
// ONLY `brochureUrl` (plus `updatedAt`) on the six known module ids.
//
// SAFETY
//   - Dry-run by default. Pass --apply to write.
//   - Never inserts, never deletes, never touches any other field.
//   - Refuses to write a path whose file is missing from public/ (so a typo can
//     never ship a dead link).
//   - Idempotent: a module already pointing at the right PDF is left alone.
//
// USAGE
//   node scripts/update-module-brochures.mjs            # show what would change
//   node scripts/update-module-brochures.mjs --apply    # write it
//
// The URI comes from the repo .env (the cluster the public site reads).
import { createRequire } from 'module';
import { existsSync, statSync } from 'fs';
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
const dotenv = require('../node_modules/dotenv/lib/main.js');
// decodeURIComponent: the repo path contains a space ("TESGTING 1/…") and
// `new URL().pathname` percent-encodes it, which makes dotenv skip .env silently.
dotenv.config({ path: decodeURIComponent(new URL('../.env', import.meta.url).pathname) });

const APPLY = process.argv.includes('--apply');
const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);

// module id -> brochure path served from public/
const BROCHURES = {
  'cf-agencies': '/brochures/cfa-module-brochure.pdf',
  'housing-societies': '/brochures/housing-society-module-brochure.pdf',
  'sales-commission': '/brochures/salesman-agent-module-brochure.pdf',
  'logistics-transport': '/brochures/transport-module-brochure.pdf',
  'container-handling': '/brochures/container-handling-module-brochure.pdf',
  'garment-retail': '/brochures/garment-footwear-module-brochure.pdf',
};

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set — aborting.');
  process.exit(1);
}

// Validate every file BEFORE touching the database.
let bad = 0;
for (const [id, url] of Object.entries(BROCHURES)) {
  const file = `${ROOT}public${url}`;
  if (!existsSync(file)) {
    console.error(`MISSING FILE for ${id}: public${url}`);
    bad++;
    continue;
  }
  const { size } = statSync(file);
  if (size < 1024) {
    console.error(`SUSPICIOUS FILE for ${id}: public${url} is only ${size} bytes`);
    bad++;
  }
}
if (bad > 0) {
  console.error(`${bad} brochure file(s) failed validation — aborting without writes.`);
  process.exit(1);
}

const maskUri = (uri) => uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');

const client = new MongoClient(process.env.MONGODB_URI, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

try {
  await client.connect();
  const db = client.db();
  console.log(`target: ${maskUri(process.env.MONGODB_URI)} (db "${db.databaseName}")`);
  console.log(`mode:   ${APPLY ? 'APPLY' : 'DRY RUN (pass --apply to write)'}`);

  const modules = db.collection('modules');
  const docs = await modules
    .find({ id: { $in: Object.keys(BROCHURES) } }, { projection: { id: 1, title: 1, brochureUrl: 1 } })
    .toArray();

  if (docs.length === 0) {
    console.error('No matching module documents found — aborting.');
    process.exit(1);
  }

  const found = new Set(docs.map((d) => d.id));
  for (const id of Object.keys(BROCHURES)) {
    if (!found.has(id)) console.warn(`WARN module id not in DB: ${id}`);
  }

  const now = new Date();
  const ops = [];
  for (const doc of docs) {
    const target = BROCHURES[doc.id];
    const current = String(doc.brochureUrl || '');
    if (current === target) {
      console.log(`  ${doc.id}: already ${target} — skip`);
      continue;
    }
    console.log(`  ${doc.id}: ${current || '(empty)'} -> ${target}`);
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { brochureUrl: target, updatedAt: now } },
      },
    });
  }

  if (ops.length === 0) {
    console.log('Nothing to update — all modules already point at their PDF brochure.');
    process.exit(0);
  }

  console.log(`${APPLY ? 'updating' : 'would update'} ${ops.length} module(s)`);
  if (!APPLY) {
    console.log('Dry run complete. Re-run with --apply to write.');
    process.exit(0);
  }

  const result = await modules.bulkWrite(ops);
  console.log(`write ok (matched=${result.matchedCount ?? 0}, modified=${result.modifiedCount ?? 0})`);

  const after = await modules
    .find({ id: { $in: Object.keys(BROCHURES) } }, { projection: { id: 1, brochureUrl: 1, _id: 0 } })
    .toArray();
  console.log('final state:');
  for (const row of after) console.log(`  ${row.id}: ${row.brochureUrl}`);
} finally {
  await client.close();
}
