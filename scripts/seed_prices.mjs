// CHANGE: 2026-10-02 — seed the prices catalogue into MongoDB (SP-1 cart build).
// WHY: the site cart, pricing pages and admin price manager all read the `prices` collection.
// This script bootstraps it from lib/prices-catalog.mjs — the SAME catalogue the pages fall
// back to — so "DB down / empty" and "fresh deploy" both present identical numbers.
//
// IDEMPOTENT AND ADMIN-SAFE: upsert by slug with `$setOnInsert` only. If a document already
// exists (because the admin edited the price, renamed a slug, re-paired items…), this script
// does NOT touch it — a re-run can never clobber admin edits. It only ever ADDS missing docs.
// (The modules seed deleteMany+inserts because its catalogue is static; prices are not.)
//
// Usage: npm run seed:prices   (reads MONGODB_URI from .env via dotenv, or the environment)

import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRICES_FALLBACK, computePayablePaise } from '../lib/prices-catalog.mjs';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function docFor(item) {
  return {
    slug: item.slug,
    name: item.name,
    category: item.category,
    validity: item.validity ?? null,
    basePaise: item.basePaise,
    gstPct: item.gstPct,
    discountPaise: item.discountPaise,
    payablePaise: computePayablePaise(item.basePaise, item.gstPct, item.discountPaise),
    pairsWith: item.pairsWith ?? [],
    addonSlugs: item.addonSlugs ?? [],
    moduleSlugs: item.moduleSlugs ?? [],
    priceStatus: item.priceStatus,
    discountLabel: item.discountLabel ?? null,
    sortOrder: item.sortOrder,
    updatedAt: new Date(),
    seededAt: new Date(),
  };
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment (checked .env and process.env)');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  const started = Date.now();

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('prices');

    let inserted = 0;
    let skipped = 0;
    for (const item of PRICES_FALLBACK) {
      const result = await collection.updateOne(
        { slug: item.slug },
        { $setOnInsert: docFor(item) },
        { upsert: true },
      );
      if (result.upsertedCount > 0) inserted += 1;
      else skipped += 1;
    }

    const total = await collection.countDocuments({});
    console.log(
      `seed:prices done in ${Date.now() - started}ms — inserted ${inserted}, kept ${skipped} existing, ${total} docs in 'prices'.`,
    );
    console.log('Existing docs were NOT overwritten: admin price edits survive re-runs.');
  } catch (error) {
    console.error('Error seeding prices:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();