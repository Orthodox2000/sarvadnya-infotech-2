// CHANGE: 2026-10-16 — careers referral system: one-time (idempotent) backfill that gives
// every EXISTING careers_users account its own unique 8-char referral code. Accounts created
// after this change get one at signup; this script (plus the lazy path in the login route)
// covers everyone who existed before it.
//
// Safe to re-run: only users missing a well-formed `referralCode` are touched.
//
// Usage:
//   node scripts/backfill-referral-codes.mjs           # dry run (reports only)
//   node scripts/backfill-referral-codes.mjs --apply    # write codes + create indexes
//
// ⚠️ .env points at the frontend's cluster; the DEPLOYED site reads the nested admin's DB
// (AGENTS.md §18). To target production, override the URI explicitly:
//   MONGODB_URI=$(grep -m1 '^MONGODB_URI=' sarvadnya-advanced/.env | cut -d= -f2-) \
//     node scripts/backfill-referral-codes.mjs --apply
// `dotenv/config` never overrides an already-set variable, so the override wins.

import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';
import { generateUniqueReferralCode, isValidReferralCodeFormat } from '../lib/careers-referral.mjs';

loadEnv();

const APPLY = process.argv.includes('--apply');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set (missing .env or environment variable).');
  process.exit(1);
}

/** Keep logs PII-light: ab●●●@domain. */
function maskEmail(email) {
  const [local, domain] = String(email || '').split('@');
  if (!domain) return '(no email)';
  return `${local.slice(0, 2)}${'\u25cf'.repeat(Math.max(1, local.length - 2))}@${domain}`;
}

async function main() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db();
  const users = db.collection('careers_users');

  const docs = await users.find({}, { projection: { _id: 1, email: 1, referralCode: 1 } }).toArray();

  // Every code already in use (valid ones only) — so new codes never collide with a stale
  // malformed value that validation would reject anyway.
  const taken = new Set(docs.map((d) => d.referralCode).filter((c) => typeof c === 'string' && c));

  const needCode = docs.filter((d) => !isValidReferralCodeFormat(d.referralCode));
  console.log(`careers_users total: ${docs.length}`);
  console.log(`missing/invalid referralCode: ${needCode.length}`);
  console.log(`mode: ${APPLY ? 'APPLY (writes)' : 'DRY RUN (no writes)'}`);

  const assigned = [];
  for (const doc of needCode) {
    const code = await generateUniqueReferralCode(async (candidate) => taken.has(candidate));
    taken.add(code);
    assigned.push({ _id: doc._id, email: doc.email, code });
  }

  for (const a of assigned) {
    console.log(`  ${a._id.toString()}  ${maskEmail(a.email)}  ->  ${a.code}`);
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write these codes.');
    await client.close();
    return;
  }

  let updated = 0;
  for (const a of assigned) {
    // Guard on the same predicate so a concurrent signup/login (which may have already
    // assigned a code) can never be overwritten.
    const res = await users.updateOne(
      { _id: a._id, $or: [{ referralCode: { $exists: false } }, { referralCode: { $not: { $type: 'string' } } }] },
      { $set: { referralCode: a.code, updatedAt: new Date() } }
    );
    if (res.modifiedCount === 1) updated++;
  }
  console.log(`\nupdated: ${updated}`);

  // Indexes (idempotent createIndex). The UNIQUE index is PARTIAL — only docs that HAVE the
  // code participate — which is exactly what keeps the unique constraint valid here.
  await users.createIndex(
    { referralCode: 1 },
    { unique: true, partialFilterExpression: { referralCode: { $type: 'string' } }, name: 'careers_users_referralcode_unique' }
  );
  await users.createIndex({ referredBy: 1 }, { name: 'careers_users_referredby' });
  console.log('indexes ensured: careers_users_referralcode_unique (partial unique), careers_users_referredby');

  await client.close();
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
