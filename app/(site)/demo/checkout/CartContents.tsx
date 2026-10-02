'use client';

// CHANGE: 2026-10-02 — checkout body for /demo (SP-1).
// WHY: the cart, the totals and the pay button all read client state, so this must be a
// client component. It also owns the real EMPTY state the plan requires — an empty cart on
// the checkout page is a normal thing to arrive at (expired tab, cleared storage, a direct
// link), and it must not render a pay button that 400s at the order route.

import CartLine from '@/app/components/demo/CartLine';
import TotalsPanel from '@/app/components/demo/TotalsPanel';
import RazorpayButton from '@/app/components/demo/RazorpayButton';
import { useCart } from '@/lib/demo/cart-store.tsx';

export default function CartContents() {
  const { totals, hydrated } = useCart();

  if (!hydrated) {
    return <p className="text-sm text-teal-900/50">Reading your saved cart…</p>;
  }

  if (totals.lines.length === 0) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-white p-6 text-center shadow-sm">
        <h2 className="text-base font-semibold text-teal-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-teal-900/70">
          There is nothing to pay for. Add an item to the test cart first.
        </p>
        <a
          href="/demo"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Back to products
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px] md:items-start">
      <ul className="space-y-3">
        {totals.lines.map((line) => (
          <CartLine key={line.id} line={line} />
        ))}
      </ul>

      <div className="space-y-3 md:sticky md:top-24">
        <TotalsPanel totals={totals} />
        <RazorpayButton />
      </div>
    </div>
  );
}