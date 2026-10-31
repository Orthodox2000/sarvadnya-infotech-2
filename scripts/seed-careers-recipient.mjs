// CHANGE: 2026-10-30 — Careers email routing seed.
// WHY: recipient resolution is destination-first and OPT-IN. A destination key
// that is absent from the settings map `EMAIL_DESTINATION_RECIPIENTS` resolves to
// NO recipients, so sendEmailDirect() returns 'no-recipient-configured' and sends
// nothing at all — including the candidate confirmation, because it rides the same
// jobKey claim. The new `careers` destination (job applications + resume uploads)
// therefore stays silent until this runs. The admin panel can also set it by hand
// (Email Config → Other Pages → Careers / Job Applications); this script exists so
// the value can be seeded idempotently from the CLI.
//
// SAFETY
//   - Dry-run by default. Pass --apply to write.
//   - Never overwrites a non-empty existing value (admin edits win).
//   - Touches ONE key inside ONE settings document.
//   - Never sends email. It only writes a recipient address.
//
// USAGE
//   node scripts/seed-careers-recipient.mjs            # show what would change
//   node scripts/seed-careers-recipient.mjs --apply    # write it
//
// The URI comes from the repo .env. To target the OTHER cluster, pass it inline
// (dotenv never overrides an already-set variable):
//   MONGODB_URI="$(grep -m1 '^MONGODB_URI=' sarvadnya-advanced/.env | cut -d= -f2-)" \
//     node scripts/seed-careers-recipient.mjs --apply
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
const dotenv = require('../node_modules/dotenv/lib/main.js');
// decodeURIComponent: the repo path contains a space ("TESGTING 1/…") and
// `new URL().pathname` percent-encodes it, which makes dotenv skip .env silently.
dotenv.config({ path: decodeURIComponent(new URL('../.env', import.meta.url).pathname) });

const SETTINGS_KEY = 'EMAIL_DESTINATION_RECIPIENTS';
const DESTINATION = 'careers';
// CHANGE: 2026-10-31 — owner asked for job applications to reach HR directly.
const ADDRESS = 'hr@sarvadnyainfotech.com';
const APPLY = process.argv.includes('--apply');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set — aborting.');
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

  const settings = db.collection('settings');
  const doc = await settings.findOne({ key: SETTINGS_KEY });

  let map = {};
  if (doc && typeof doc.value === 'string' && doc.value.trim()) {
    try {
      const parsed = JSON.parse(doc.value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) map = parsed;
      else throw new Error('not a JSON object');
    } catch (err) {
      console.error(`${SETTINGS_KEY} on the settings doc is not a JSON object — aborting without writes:`, err.message);
      process.exit(1);
    }
  }

  const current = typeof map[DESTINATION] === 'string' ? map[DESTINATION].trim() : '';
  console.log(`${SETTINGS_KEY}.${DESTINATION} = ${current ? JSON.stringify(current) : '(not set)'}`);

  if (current) {
    console.log('Already configured — nothing to do. (Admin edits are never overwritten.)');
    process.exit(0);
  }

  map[DESTINATION] = ADDRESS;
  console.log(`would set ${SETTINGS_KEY}.${DESTINATION} -> ${ADDRESS}`);

  if (!APPLY) {
    console.log('Dry run complete. Re-run with --apply to write.');
    process.exit(0);
  }

  const now = new Date();
  const result = doc
    ? await settings.updateOne(
        { key: SETTINGS_KEY },
        { $set: { value: JSON.stringify(map, null, 2), updatedAt: now } }
      )
    : await settings.insertOne({
        key: SETTINGS_KEY,
        value: JSON.stringify(map, null, 2),
        createdAt: now,
        updatedAt: now,
      });

  const matched = doc ? result.matchedCount ?? 0 : 0;
  console.log(`write ok (matched=${matched}, modified=${result.modifiedCount ?? 0})`);
  console.log(`${DESTINATION} recipient seeded. Job applications and resume uploads will now email ${ADDRESS} and the candidate.`);
} finally {
  await client.close();
}
