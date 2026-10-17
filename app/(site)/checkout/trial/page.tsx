import type { Metadata } from 'next';
import TrialPay from './TrialPay';

// CHANGE: 2026-10-17 — TEMPORARY ₹1 live payment-trial route.
// WHY (owner): "create a 1rs trial in demo route for pament and testing of route" — option 2,
// a REAL ₹1 item in the live cart catalogue, reachable through this one noindex page so the
// build is [cart] -> /checkout -> live Razorpay for exactly one rupee.
//
// ⚠️ TEMPORARY — remove after testing. Full removal (documented in AGENTS.md §25):
//   1. npm run remove:payment-trial -- --apply   (deletes the DB doc; dry-run without --apply)
//   2. delete the folder app/(site)/checkout/trial/ (this file + TrialPay.tsx)
//   3. remove the PAYMENT_TRIAL_SLUG block from lib/prices-catalog.mjs + its .d.mts/prices.ts
//      re-export + the cart-test assertion
//   4. commit + deploy
//
// Indexing: `noindex` metadata here, and app/robots.ts already disallows the whole /checkout
// subtree — so this route (and the /checkout/ prefix) can never be indexed. It is deliberately
// absent from app/sitemap.ts. `dynamic` keeps it out of any stale static snapshot.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Payment Trial — Sarvadnya Infotech LLP',
};

export const dynamic = 'force-dynamic';

export default function PaymentTrialPage() {
  return <TrialPay />;
}
