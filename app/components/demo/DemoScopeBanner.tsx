'use client';

// CHANGE: 2026-10-02 — prominent test-scope notice for the /demo cart scaffold (SP-1).
// WHY: /demo was a "Book a Demo" page until 2026-10-02 and is now a payment test harness.
// A visitor arriving from an old link or a search result must be told immediately, in
// plain words, that no real money moves. Silently taking test payments as if they were real
// is the single worst failure this scaffold could have.
//
// Readable at 360px: the copy is short and the badge wraps rather than overflowing.

export default function DemoScopeBanner() {
  return (
    <div
      role="note"
      aria-label="Test mode notice"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-950"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Test route
        </span>
        <p className="text-sm leading-relaxed">
          <strong className="font-semibold">This is a payment test page.</strong>{' '}
          Checkout runs in Razorpay <strong>test mode</strong> — no real money is charged and no
          order is fulfilled. Prices shown are illustrative, not quotes.
        </p>
      </div>
    </div>
  );
}