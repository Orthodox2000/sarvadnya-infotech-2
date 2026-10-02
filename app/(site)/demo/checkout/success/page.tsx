import type { Metadata } from 'next';
import VerifyResult from './VerifyResult';

// CHANGE: 2026-10-02 — post-payment success page (SP-1).
// WHY: the client NEVER asserts that a payment succeeded. This page re-verifies server-side
// via /api/demo/verify before showing a "verified" badge, because a redirect query string is
// entirely attacker-controlled — anyone can hand-craft /demo/checkout/success?… and land here.
//
// noindex from the layout; repeated here for the nested route (spec §3.7).

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Payment result (Test) — Sarvadnya Infotech LLP',
};

export default function DemoSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    // `demo-receipt-page` is the print hook — see the scoped @media print block in
    // app/globals.css. The receipt itself is produced with window.print().
    <main className="demo-receipt-page min-h-screen bg-[#FBFAF6]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <VerifyResult kind="success" searchParams={searchParams} />
      </div>
    </main>
  );
}