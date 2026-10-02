import type { Metadata } from 'next';
import VerifyResult from './VerifyResult';

// CHANGE: 2026-10-02 — post-payment success page for the real cart (SP-1 cart build).
// WHY: the client NEVER asserts that a payment succeeded. This page re-verifies server-side
// via /api/cart/verify before showing a verified badge, because a redirect query string is
// entirely attacker-controlled — anyone can hand-craft /checkout/success?… and land here.
//
// noindex metadata + robots.ts disallow; the main carries `.cart-receipt-page` so the print
// scope in globals.css can strip the site chrome and print ONLY the receipt.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Payment result — Sarvadnya Infotech LLP',
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="cart-receipt-page min-h-[70vh] bg-slate-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <VerifyResult searchParams={searchParams} />
      </div>
    </main>
  );
}