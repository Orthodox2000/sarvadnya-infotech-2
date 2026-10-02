'use client';

// CHANGE: 2026-10-02 — cancelled/failed payment panel (SP-1).
// WHY: a dismissed Razorpay modal and a declined payment are both ordinary, expected
// outcomes of exercising a test checkout. Presenting them as a normal state — with a clear
// way back — is what keeps the failure path usable instead of looking like a defect.

import Link from 'next/link';

export default function CancelResult({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
        Test mode
      </span>
      <h1 className="mt-3 text-xl font-bold text-teal-900">Payment cancelled</h1>
      <p className="mt-2 text-sm leading-relaxed text-teal-900/70">
        The Razorpay test checkout was dismissed or the payment was declined. Nothing was charged
        and no order was created — in test mode nothing ever leaves your card.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-teal-900/70">
        To try again, return to the cart and choose <strong>Success</strong> on the mock bank
        page to exercise the verified path.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/demo/checkout"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Back to checkout
        </Link>
        <Link
          href="/demo"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-teal-300 px-5 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Back to products
        </Link>
      </div>
    </div>
  );
}