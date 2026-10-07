// CHANGE: 2026-10-07 — Task 6: read-only verification that the news seed data is
// actually live in the shared `news` collection. Asserts the SP-3 international
// licensing post exists, the collection has >= 19 documents, and (2026-10-07 P1)
// the retitled TSS post carries its new answer-form title + faqs and the companion
// "how to check" post exists. Never writes.
// Run AFTER `node scripts/seed_news.mjs` (MONGODB_URI from .env, dotenv).
// CHANGE: 2026-10-07 — extended for the P1 TSS-cluster work (retitle + companion post).
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let passed = 0;
let failed = 0;
const check = (name, cond, extra = '') => {
  if (cond) {
    passed += 1;
    console.log(`PASS  — ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  — ${name}${extra ? ` (${extra})` : ''}`);
  }
};

if (!uri) {
  console.error('MONGODB_URI not found in environment — is .env present?');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

try {
  await client.connect();
  const db = client.db();
  const news = db.collection('news');
  const total = await news.countDocuments();
  const exists = await news.findOne({ slug: 'tallyprime-international-licenses' }, { projection: { slug: 1, title: 1 } });
  const tss = await news.findOne({ slug: 'tally-tss-expiry-meaning' }, { projection: { slug: 1, title: 1, faqs: 1 } });
  const howTo = await news.findOne({ slug: 'how-to-check-tss-expiry-date-tallyprime' }, { projection: { slug: 1, title: 1 } });

  check('news collection reachable + total count >= 19', total >= 19, `count ${total}`);
  check('tallyprime-international-licenses document exists', !!exists, exists ? exists.title : 'missing');
  check('tally-tss-expiry-meaning carries the P1 answer-form retitle', !!tss && tss.title === 'TSS in Tally: What It Means, Why It Expires, and How to Renew', tss ? `title "${tss.title}"` : 'missing');
  check('tally-tss-expiry-meaning has a faqs array (FAQPage source)', !!tss && Array.isArray(tss.faqs) && tss.faqs.length >= 4, tss && tss.faqs ? `${tss.faqs.length} faqs` : 'missing');
  check('how-to-check-tss-expiry-date-tallyprime companion post exists', !!howTo, howTo ? howTo.title : 'missing');

  console.log(`\n${failed === 0 ? 'ALL NEWS-SEED VERIFICATIONS PASSED' : `${failed} VERIFICATIONS FAILED`} (${passed} passed / ${failed} failed)`);
  process.exitCode = failed === 0 ? 0 : 1;
} catch (err) {
  console.error('VERIFY ERROR:', err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}