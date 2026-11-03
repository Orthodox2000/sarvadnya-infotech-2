// CHANGE: 2026-11-03 — targeted SERP-title updater for the 2026-11-03 Search Console pass.
//
// WHY THIS EXISTS
// The live /news pages read their <title> and meta description from MongoDB
// (`seoTitle` / `description`), NOT from the repo. A change made only in
// scripts/seed_news.mjs is invisible until something writes it to the cluster. Running the
// full seed does that too, but it rewrites every post's whole document, which is far more
// blast radius than a title fix needs.
//
// WHAT IT TOUCHES
// Exactly two fields (`seoTitle`, `description`) on an explicit slug allow-list, and only
// where the live value differs from the canonical value in scripts/seed_news.mjs. No content,
// no slug, no tags, no link, no FAQ is ever written. The values are imported from the seed -
// there is no second copy to drift.
//
// USAGE
//   node scripts/update-news-seo.mjs            # dry run: prints every before/after pair
//   node scripts/update-news-seo.mjs --apply    # writes only the changed fields
//
// MONGODB_URI is read from the environment (.env is loaded, never overridden). This box has NO
// dev database - a local run reads the live cluster, so dry-run first and read the diff.

import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';
import { posts } from './seed_news.mjs';

loadEnv();

const APPLY = process.argv.includes('--apply');

// The slugs retitled in the 2026-11-03 GSC pass. Every one of these is a page that appeared
// in the 4-31 October export with impressions but a CTR far below its position.
const SLUGS = [
  'how-to-lock-data-in-tallyprime',
  'tally-tss-expiry-meaning',
  'how-to-add-gst-number-in-tally-erp-9',
  'tally-cloud-access',
  'what-is-tally-capital',
  'how-to-check-tss-expiry-date-tallyprime',
  'cbd-belapur-it-companies-list',
  // REMOVED 2026-11-03: 'it-companies-in-belapur' — retired into the list post by a 301 (see
  // RETIRED_NEWS_SLUGS in lib/news-utils.ts). Its title no longer reaches a visitor, so keeping it
  // here would just be a second, invisible copy of the same fix.
  'tally-tss-renewal-2026',
  'tallyprime-international-licenses',
  'tally-5-star-partner-mumbai',
];

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set (missing .env or environment variable).');
  process.exit(1);
}

const bySlug = new Map(posts.map((p) => [p.slug, p]));

// Fail before touching the cluster if the seed and this list disagree.
const missing = SLUGS.filter((s) => !bySlug.has(s));
if (missing.length) {
  console.error(`Slug(s) not found in scripts/seed_news.mjs: ${missing.join(', ')}`);
  process.exit(1);
}

// A duplicated SERP title on two URLs of the same site splits the signal; refuse to create one.
const titleCount = new Map();
for (const p of posts) {
  if (!p.seoTitle) continue;
  const key = p.seoTitle.toLowerCase();
  titleCount.set(key, (titleCount.get(key) ?? 0) + 1);
}
for (const slug of SLUGS) {
  const t = bySlug.get(slug).seoTitle;
  if (t && titleCount.get(t.toLowerCase()) > 1) {
    console.error(`Refusing: seoTitle "${t}" (${slug}) is used by more than one post.`);
    process.exit(1);
  }
}

const clip = (s, n = 78) => (s && s.length > n ? `${s.slice(0, n - 1)}...` : s ?? '(none)');

async function main() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  console.log(`Connected. Mode: ${APPLY ? 'APPLY (writes)' : 'DRY RUN (no writes)'}`);

  try {
    const col = client.db().collection('news');
    let changed = 0;
    let already = 0;

    for (const slug of SLUGS) {
      const src = bySlug.get(slug);
      const live = await col.findOne({ slug }, { projection: { seoTitle: 1, description: 1 } });
      if (!live) {
        console.log(`\n- ${slug}\n  NOT IN DATABASE - skipped (run scripts/seed_news.mjs to create it)`);
        continue;
      }

      const $set = {};
      if ((live.seoTitle ?? '') !== (src.seoTitle ?? '')) $set.seoTitle = src.seoTitle;
      if ((live.description ?? '') !== (src.description ?? '')) $set.description = src.description;

      if (!Object.keys($set).length) {
        already++;
        console.log(`\n= ${slug}\n  already up to date`);
        continue;
      }

      changed++;
      console.log(`\n* ${slug}`);
      if ('seoTitle' in $set) {
        console.log(`  title  before (${(live.seoTitle ?? '').length}): ${clip(live.seoTitle)}`);
        console.log(`  title  after  (${src.seoTitle.length}): ${clip(src.seoTitle)}`);
      }
      if ('description' in $set) {
        console.log(`  desc   before (${(live.description ?? '').length}): ${clip(live.description)}`);
        console.log(`  desc   after  (${src.description.length}): ${clip(src.description)}`);
      }

      if (APPLY) {
        await col.updateOne({ slug }, { $set: { ...$set, updatedAt: new Date() } });
        console.log('  written');
      }
    }

    console.log(
      `\n${APPLY ? 'Updated' : 'Would update'} ${changed} post(s); ${already} already current; ${SLUGS.length} checked.`
    );
    if (!APPLY && changed) console.log('Re-run with --apply to write.');
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('update-news-seo failed:', error);
  process.exitCode = 1;
});
