// CHANGE: 2026-10-17 — "remove it properly" tool for the TEMPORARY ₹1 live payment trial.
// WHY (owner): "do no.2 but we will remove it properly and document it as well". The catalogue
// entry + the trial page are removed by a code change; the only irreversible part is the
// MongoDB document that seed_prices.mjs created ($setOnInsert — the seeder NEVER deletes).
// This script is that one step, and it is DRY-RUN BY DEFAULT so it can't delete by accident.
//
// Usage:
//   npm run remove:payment-trial                 # DRY RUN — reports what WOULD be deleted
//   npm run remove:payment-trial -- --apply      # actually deletes the doc
//
// Database target: MONGODB_URI from .env (or the environment), same as seed:prices. The
// DEPLOYED site + admin read the nested admin cluster, so pass the production URI explicitly
// when cleaning up production, e.g.:
//   MONGODB_URI=$(grep -m1 '^MONGODB_URI=' sarvadnya-advanced/.env | cut -d= -f2-) \
//     npm run remove:payment-trial -- --apply
//
// Full removal checklist lives in AGENTS.md §25 ("₹1 live payment-trial item") and in the
// header of app/(site)/checkout/trial/page.tsx.

import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';
import { PAYMENT_TRIAL_SLUG } from '../lib/prices-catalog.mjs';

loadEnv();

const APPLY = process.argv.includes('--apply');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment (checked .env and process.env)');
    process.exit(1);
  }

  // Mask the credentials when echoing the target so a CI log can never leak them.
  const safeTarget = uri.replace(/\/\/[^@]*@/, '//***:***@');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('prices');

    const existing = await collection.findOne({ slug: PAYMENT_TRIAL_SLUG });
    console.log(`remove:payment-trial — target ${safeTarget}`);
    console.log(`  slug: ${PAYMENT_TRIAL_SLUG}`);

    if (!existing) {
      console.log('  No such document. Nothing to remove (already clean).');
      return;
    }

    console.log(`  Found: "${existing.name}" (${existing.payablePaise} paise, status ${existing.priceStatus}).`);

    if (!APPLY) {
      console.log('\nDRY RUN — no changes made. Re-run with `-- --apply` to delete this document.');
      console.log('Remember the code-side steps: delete app/(site)/checkout/trial/, and the');
      console.log('PAYMENT_TRIAL_SLUG catalogue block (+ .d.mts / prices.ts re-export / cart-test).');
      return;
    }

    const result = await collection.deleteOne({ slug: PAYMENT_TRIAL_SLUG });
    console.log(`\nAPPLIED — deleted ${result.deletedCount} document(s) for "${PAYMENT_TRIAL_SLUG}".`);
    console.log('Now finish the code-side removal (see AGENTS.md §25) and deploy.');
  } catch (error) {
    console.error('Error removing the payment trial:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
