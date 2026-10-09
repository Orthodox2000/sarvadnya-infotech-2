// CHANGE: 2026-10-09 — one-time, idempotent repair for the JSON-dump import
// (commits 54ae9c3 / b81bc6f) that wrote BSON Dates as ISO **strings** into the live
// Atlas cluster. Consequences this fixes:
//
//   * lib/visitors.ts called `hit.expireAt.getTime()` -> TypeError
//     "c.expireAt.getTime is not a function" on /api/identify (production 500).
//   - the "today" KPIs (visitorsToday / ordersToday) compare a Date against a stored
//     string, so they were silently always 0;
//   - TTL indexes (ip_cache.expireAt, email_queue.expireAt, chat_logs.expiresAt, …)
//     never fire on string fields, so those docs never expired.
//
// It converts ONLY whitelisted date fields whose current stored value is a string and
// parses to a valid date, back to a BSON Date. Safe to re-run: non-strings and
// unparseable values are skipped untouched. `news.date` is intentionally NOT touched —
// the site treats it as a display string (`new Date(date.trim())` in lib/news-utils.ts),
// so converting it to a Date would break the blog.
//
// Usage:
//   node scripts/migrate-string-dates.mjs            # dry run (reports only)
//   node scripts/migrate-string-dates.mjs --apply     # write the repair
//
// ⚠️ .env points at the LIVE Atlas cluster (there is no dev DB) — this repairs PRODUCTION.

import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';

loadEnv();

const APPLY = process.argv.includes('--apply');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set (missing .env or environment variable).');
  process.exit(1);
}

// Collection -> top-level date fields the app reads/mutates AS Dates.
// Do NOT add news.date here (intentionally a string).
const TARGETS = {
  ip_cache: ['expireAt', 'fetchedAt'],
  visitors: ['firstSeen', 'lastSeen', 'geoAt', 'updatedAt'],
  orders: ['createdAt', 'updatedAt'],
  tss_renewals: ['createdAt', 'updatedAt'],
  email_queue: ['createdAt', 'updatedAt', 'expireAt', 'sentAt', 'nextRetryAt'],
  form_submissions: ['createdAt'],
  careers_users: ['createdAt', 'updatedAt'],
  careers_sessions: ['createdAt', 'expiresAt'],
  chat_logs: ['startedAt', 'lastActiveAt', 'endedAt', 'expiresAt'],
  drafts: ['createdAt', 'lastActiveAt', 'updatedAt', 'expiresAt'],
  modules: ['createdAt', 'updatedAt'],
  reviews: ['createdAt'],
  partners: ['createdAt'],
  learning_content: ['createdAt', 'updatedAt'],
};

// Array fields whose entries carry a date at `<array>[].at` (audit trails).
const NESTED_AT = { orders: ['statusHistory'], tss_renewals: ['statusHistory'] };

/** String -> Date if it parses, else null (never throws). */
function coerce(value) {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db();

  console.log(`\n=== string-date repair — ${APPLY ? 'APPLY' : 'DRY RUN'} ===\n`);

  let totalRepaired = 0;

  for (const [colName, fields] of Object.entries(TARGETS)) {
    const nested = NESTED_AT[colName] || [];
    const paths = [...fields, ...nested.map((n) => `${n}.at`)];

    const exists = await db.listCollections({ name: colName }).hasNext();
    if (!exists) continue;

    const col = db.collection(colName);
    const query = { $or: paths.map((p) => ({ [p]: { $type: 'string' } })) };

    const projection = { _id: 1 };
    for (const f of fields) projection[f] = 1;
    for (const n of nested) projection[n] = 1;

    const docs = await col.find(query, { projection }).toArray();
    if (docs.length === 0) {
      console.log(`  ${colName}: clean`);
      continue;
    }

    const ops = [];
    for (const doc of docs) {
      const $set = {};
      for (const f of Object.keys(projection)) {
        if (f === '_id') continue;
        if (nested.includes(f)) continue;
        const d = coerce(doc[f]);
        if (d) $set[f] = d;
      }
      for (const n of nested) {
        const arr = Array.isArray(doc[n]) ? doc[n] : null;
        if (!arr) continue;
        let touched = false;
        const next = arr.map((entry) => {
          if (entry && typeof entry.at === 'string') {
            const d = coerce(entry.at);
            if (d) {
              touched = true;
              return { ...entry, at: d };
            }
          }
          return entry;
        });
        if (touched) $set[n] = next;
      }
      if (Object.keys($set).length > 0) {
        ops.push({ updateOne: { filter: { _id: doc._id }, update: { $set } } });
      }
    }

    console.log(
      `  ${colName}: ${docs.length} doc(s) with string dates, ${ops.length} repairable${
        APPLY ? ' — applying' : ' (dry run)'
      }`,
    );
    if (APPLY && ops.length) {
      await col.bulkWrite(ops, { ordered: false });
    }
    totalRepaired += ops.length;
  }

  // Post-apply verification: report any remaining string dates in the whitelist.
  if (APPLY) {
    console.log('\n  Verification (remaining string dates):');
    for (const [colName, fields] of Object.entries(TARGETS)) {
      const exists = await db.listCollections({ name: colName }).hasNext();
      if (!exists) continue;
      const col = db.collection(colName);
      const paths = [...fields, ...(NESTED_AT[colName] || []).map((n) => `${n}.at`)];
      const remaining = await col.countDocuments({ $or: paths.map((p) => ({ [p]: { $type: 'string' } })) });
      if (remaining > 0) console.log(`  ⚠️ ${colName}: ${remaining} string date value(s) remain`);
    }
  }

  console.log(`\n${APPLY ? 'APPLIED' : 'DRY RUN complete'} — ${totalRepaired} doc(s) repairable, no news.date changes (deliberately excluded).`);
  await client.close();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
