// CHANGE: 2026-10-07 — Owner: "this is final and only address everywhere" — the
// office address is now canonically "73, Vindhya Commercial Premises, Sector - 11,
// Plot No - 1, CBD Belapur, Mumbai, Maharashtra". The code/env fallbacks were
// updated in the repo, but the DB settings map NEXT_PUBLIC_OFFICE_ADDRESS still
// carried the legacy value ("Shop No. 73, Plot No. 1, Vindhya Commercial Premises,
// Sector 11, CBD Belapur"), and because every reader is
// `settings.X || process.env.X || fallback`, the DB value WINS over env. This
// ONE-TIME, idempotent migration rewrites that key on the settings doc.
// Safety: only touches the NEXT_PUBLIC_OFFICE_ADDRESS key, only when its current
// value equals one of the known legacy strings (does no blind writes), prints the
// old -> new pair, and writes nothing when already canonical.
//
// Run:  node scripts/migrate-office-address.mjs   (needs MONGODB_URI in .env)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
const dotenv = require('../node_modules/dotenv/lib/main.js');
// decodeURIComponent: the repo path contains a space ("TESGTING 1/…"), and
// `new URL().pathname` percent-encodes it, which made dotenv silently skip .env.
dotenv.config({ path: decodeURIComponent(new URL('../.env', import.meta.url).pathname) });

const KEY = 'NEXT_PUBLIC_OFFICE_ADDRESS';
const NEW_ADDRESS = '73, Vindhya Commercial Premises, Sector - 11, Plot No - 1, CBD Belapur, Mumbai, Maharashtra';
const LEGACY = [
  'Shop No. 73, Plot No. 1, Vindhya Commercial Premises, Sector 11, CBD Belapur',
  '212, Sai Chamber, Sector 11, Plot No. 44, CBD Belapur, Navi Mumbai - 400614',
];

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set — aborting.');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI, { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  const db = client.db();
  const settings = db.collection('settings');
  const doc = await settings.findOne({ key: KEY });
  if (!doc) {
    console.log(`settings key ${KEY} not found — inserting canonical value.`);
    await settings.updateOne(
      { key: KEY },
      { $set: { value: NEW_ADDRESS, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(`Inserted ${KEY} = ${NEW_ADDRESS}`);
    process.exit(0);
  }

  const current = String(doc.value);
  if (current === NEW_ADDRESS) {
    console.log(`${KEY} already canonical — nothing to migrate.`);
    process.exit(0);
  }
  if (!LEGACY.includes(current)) {
    console.error(`Unexpected current value for ${KEY} — aborting without writes:\n  ${current}`);
    process.exit(1);
  }

  console.log(`Migrating ${KEY}:`);
  console.log(`  - ${current}\n    -> ${NEW_ADDRESS}`);
  const result = await settings.updateOne({ key: KEY }, { $set: { value: NEW_ADDRESS, updatedAt: new Date() } });
  console.log(`updateOne matched=${result.matchedCount} modified=${result.modifiedCount}`);
  console.log('Migration complete.');
} finally {
  await client.close();
}