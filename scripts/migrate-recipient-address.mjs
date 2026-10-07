// CHANGE: 2026-10-07 — Owner asked to replace every tallycertified RECIPIENT
// address with info@sarvadnyainfotech.com. The .env fallbacks were updated in
// code (RESEND_INTERNAL_TO) but the DB settings map EMAIL_FORM_RECIPIENTS still
// carried two legacy values (callback + demo -> ankit@tallycertified.com).
// This ONE-TIME, idempotent migration rewrites those values on the settings doc.
// Safety: it only touches the EMAIL_FORM_RECIPIENTS key, only changes values
// that match /@tallycertified\.com$/i, prints the old -> new map, and writes
// nothing when there is nothing to change.
//
// Run:  node scripts/migrate-recipient-address.mjs   (needs MONGODB_URI in .env)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
const dotenv = require('../node_modules/dotenv/lib/main.js');
// decodeURIComponent: the repo path contains a space ("TESGTING 1/…"), and
// `new URL().pathname` percent-encodes it, which made dotenv silently skip .env.
dotenv.config({ path: decodeURIComponent(new URL('../.env', import.meta.url).pathname) });

const OLD_DOMAIN = '@tallycertified.com';
const NEW_ADDRESS = 'info@sarvadnyainfotech.com';
const KEY = 'EMAIL_FORM_RECIPIENTS';

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
    console.log(`settings key ${KEY} not found — nothing to migrate.`);
    process.exit(0);
  }
  let map;
  try {
    map = JSON.parse(String(doc.value));
  } catch (e) {
    console.error(`${KEY} value is not valid JSON — aborting without writes.`, e.message);
    process.exit(1);
  }
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    console.error(`${KEY} is not a JSON object — aborting without writes.`);
    process.exit(1);
  }

  const changes = [];
  for (const [formType, address] of Object.entries(map)) {
    if (typeof address === 'string' && address.trim().toLowerCase().endsWith(OLD_DOMAIN)) {
      changes.push({ formType, old: address.trim(), next: NEW_ADDRESS });
    }
  }

  if (changes.length === 0) {
    console.log(`No tallycertified recipients in ${KEY} — nothing to migrate.`);
    process.exit(0);
  }

  console.log(`Migrating ${changes.length} recipient(s) in ${KEY}:`);
  for (const c of changes) {
    map[c.formType] = NEW_ADDRESS;
    console.log(`  - ${c.formType}: ${c.old} -> ${NEW_ADDRESS}`);
  }

  // Write only when something actually changed (idempotent on re-runs).
  const result = await settings.updateOne({ key: KEY }, { $set: { value: JSON.stringify(map, null, 2), updatedAt: new Date() } });
  console.log(`updateOne matched=${result.matchedCount} modified=${result.modifiedCount}`);
  console.log('Migration complete.');
} finally {
  await client.close();
}