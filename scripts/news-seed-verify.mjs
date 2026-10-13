// CHANGE: 2026-10-07 — Task 6: read-only verification that the news seed data is
// actually live in the shared `news` collection. Asserts the SP-3 international
// licensing post exists, the collection has >= 19 documents, and (2026-10-07 P1)
// the retitled TSS post carries its new answer-form title + faqs and the companion
// "how to check" post exists. Never writes.
// Run AFTER `node scripts/seed_news.mjs` (MONGODB_URI from .env, dotenv).
// CHANGE: 2026-10-07 — extended for the P1 TSS-cluster work (retitle + companion post).
// CHANGE: 2026-10-13 — extended for the Search Console batch: the 4 new posts
// (lock data in TallyPrime, GST number in Tally ERP 9, what is TallyCapital, document
// management for Tally) plus the tag/FAQ enrichment on tally-tss-expiry-meaning.
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

// CHANGE: 2026-10-13 — the Search Console batch (see seed_news.mjs header note).
const NEW_SLUGS_2026_10_13 = [
  'how-to-lock-data-in-tallyprime',
  'how-to-add-gst-number-in-tally-erp-9',
  'what-is-tally-capital',
  'document-management-system-for-tally',
];

try {
  await client.connect();
  const db = client.db();
  const news = db.collection('news');
  const total = await news.countDocuments();
  const exists = await news.findOne({ slug: 'tallyprime-international-licenses' }, { projection: { slug: 1, title: 1 } });
  const tss = await news.findOne({ slug: 'tally-tss-expiry-meaning' }, { projection: { slug: 1, title: 1, tags: 1, faqs: 1 } });
  const howTo = await news.findOne({ slug: 'how-to-check-tss-expiry-date-tallyprime' }, { projection: { slug: 1, title: 1 } });
  const newDocs = await news
    .find({ slug: { $in: NEW_SLUGS_2026_10_13 } }, { projection: { slug: 1, title: 1, tags: 1, faqs: 1 } })
    .toArray();

  // --- pre-existing assertions (unchanged) ---
  check('news collection has >= 19 documents', total >= 19, `total ${total}`);
  check('tallyprime-international-licenses exists', !!exists, exists ? exists.title : 'missing');
  check('tally-tss-expiry-meaning carries the P1 answer-form title', !!tss && tss.title === 'TSS in Tally: What It Means, Why It Expires, and How to Renew', tss ? tss.title : 'missing');
  check('tally-tss-expiry-meaning has faqs (>= 4)', !!tss && Array.isArray(tss.faqs) && tss.faqs.length >= 4, tss && tss.faqs ? `${tss.faqs.length} faqs` : 'missing');
  check('how-to-check-tss-expiry-date-tallyprime companion post exists', !!howTo, howTo ? howTo.title : 'missing');

  // CHANGE: 2026-10-13 — the `tss` projection above also pulls `tags`; the post gained a
  // 5th FAQ (licence vs TSS) plus the Search Console question variants as tags.
  check('tally-tss-expiry-meaning now carries >= 5 faqs', !!tss && Array.isArray(tss.faqs) && tss.faqs.length >= 5, tss && tss.faqs ? `${tss.faqs.length} faqs` : 'missing');
  check(
    'tally-tss-expiry-meaning declares "what is tally tss" + "what does tss mean"',
    !!tss &&
      Array.isArray(tss.tags) &&
      tss.tags.includes('what is tally tss') &&
      tss.tags.includes('what does tss mean'),
    tss && tss.tags ? `${tss.tags.length} tags` : 'missing'
  );

  // CHANGE: 2026-10-13 — the 4 new posts must be live, each with title + tags + faqs
  // (the article page renders tags and the FAQ block from exactly these fields).
  check('2026-10-13 batch: all 4 new posts are live', newDocs.length === NEW_SLUGS_2026_10_13.length, `found ${newDocs.length}/4`);
  for (const slug of NEW_SLUGS_2026_10_13) {
    const doc = newDocs.find((d) => d.slug === slug);
    check(
      `  2026-10-13 post "${slug}" has title + tags + faqs`,
      !!doc && !!doc.title && Array.isArray(doc.tags) && doc.tags.length > 0 && Array.isArray(doc.faqs) && doc.faqs.length > 0,
      doc ? doc.title : 'missing'
    );
  }

  console.log(`\n${failed === 0 ? 'ALL NEWS-SEED VERIFICATIONS PASSED' : `${failed} VERIFICATIONS FAILED`} (${passed} passed / ${failed} failed)`);
  process.exitCode = failed === 0 ? 0 : 1;
} catch (err) {
  console.error('VERIFY ERROR:', err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
