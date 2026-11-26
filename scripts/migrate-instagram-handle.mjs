// CHANGE: 2026-11-26 — Owner: "update insta as sarvadnya_infotech everywhere".
// WHY A SCRIPT: every live reader is `settingsMap[key] || process.env[key] || fallback`,
// so the DB value WINS over the repo files. Updating code/.env alone would leave the
// live site, /api/settings and /api/social-links still serving the old handle.
// Safety: touches ONLY the two Instagram keys, only rewrites the known legacy value
// (or inserts a missing key), prints old -> new, and is a no-op when already canonical.
// Run:  node scripts/migrate-instagram-handle.mjs   (needs MONGODB_URI in .env)
// The nested admin fork's local .env points at a DIFFERENT Atlas cluster (see its
// AGENTS §16). MIGRATION_ENV_PATH=<abs path> runs the SAME guarded migration there,
// so no second cluster is silently left on the old handle.
import { createRequire } from 'module';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
const dotenv = require('../node_modules/dotenv/lib/main.js');
// decodeURIComponent: the repo path contains a space ("TESGTING 1/…") and
// `new URL().pathname` percent-encodes it, so dotenv would silently skip .env.
const envPath = process.env.MIGRATION_ENV_PATH
  ? path.resolve(process.env.MIGRATION_ENV_PATH)
  : decodeURIComponent(new URL('../.env', import.meta.url).pathname);
dotenv.config({ path: envPath, override: true });
console.log(`Using env file: ${envPath}`);

const TARGETS = {
  NEXT_PUBLIC_INSTAGRAM_URL: {
    next: 'https://www.instagram.com/sarvadnya_infotech/',
    legacy: ['https://www.instagram.com/sarvadnya.infotech/', 'https://instagram.com/sarvadnyainfotech'],
  },
  NEXT_PUBLIC_INSTAGRAM_HANDLE: {
    next: '@sarvadnya_infotech',
    legacy: ['@sarvadnya.infotech'],
  },
};

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set — aborting.');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI, { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  const settings = client.db().collection('settings');
  let changed = 0;

  for (const [key, { next, legacy }] of Object.entries(TARGETS)) {
    const doc = await settings.findOne({ key });
    if (!doc) {
      await settings.updateOne({ key }, { $set: { value: next, updatedAt: new Date() } }, { upsert: true });
      console.log(`INSERTED ${key} = ${next}`);
      changed += 1;
      continue;
    }
    const current = String(doc.value ?? '');
    if (current === next) {
      console.log(`${key} already canonical — no write.`);
      continue;
    }
    if (!legacy.includes(current)) {
      console.error(`UNEXPECTED current value for ${key} — aborting without writes:\n  ${current}`);
      process.exitCode = 1;
      break;
    }
    const result = await settings.updateOne({ key }, { $set: { value: next, updatedAt: new Date() } });
    console.log(`UPDATED ${key}: ${current} -> ${next} (matched=${result.matchedCount} modified=${result.modifiedCount})`);
    changed += 1;
  }

  if (!process.exitCode) {
    const readback = await settings
      .find({ key: { $in: Object.keys(TARGETS) } })
      .project({ key: 1, value: 1, _id: 0 })
      .toArray();
    console.log('READBACK:', JSON.stringify(readback));
    const ok = Object.entries(TARGETS).every(([key, { next }]) => readback.some((d) => d.key === key && d.value === next));
    if (!ok) {
      console.error('Readback did not match — aborting.');
      process.exitCode = 1;
    } else {
      console.log(`Done. ${changed} key(s) changed; both values verified canonical.`);
    }
  }
} finally {
  await client.close();
}
