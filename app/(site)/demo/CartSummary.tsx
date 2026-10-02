'use client';

// CHANGE: 2026-10-02 — sticky cart summary sidebar for /demo (SP-1).
// WHY: the running total must be visible while scrolling the product grid, and the figure
// must come from computeTotals() — never from anything the browser supplies.
//
// The `hydrated` gate is load-bearing: before the persisted cart is read, `totals` is
// legitimately zero. Rendering "Cart is empty" then would flash a lie at anyone with a
// saved cart, which is the same class of bug as the ConsentBanner hydration mismatch.

import Link from 'next/link';
import { useCart } from '@/lib/demo/cart-store.tsx';
import { formatINR } from '@/lib/demo/format.ts';

export default function CartSummary() {
  const { totals, hydrated } = useCart();

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-teal-900">
        Your cart{' '}
        {!hydrated ? (
          <span className="text-sm font-normal text-teal-900/50">(loading…)</span>
        ) : (
          <span className="text-sm font-normal text-teal-900/60">
            ({totals.itemCount} item{totals.itemCount === 1 ? '' : 's'})
          </span>
        )}
      </h2>

      {!hydrated ? (
        <p className="mt-3 text-sm text-teal-900/50">Reading your saved cart…</p>
      ) : totals.lines.length === 0 ? (
        <p className="mt-3 text-sm text-teal-900/60">Nothing added yet.</p>
      ) : (
        <>
          <ul className="mt-3 space-y-1.5">
            {totals.lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-teal-900/80">
                  {l.qty} × {l.product.name}
                </span>
                <span className="shrink-0 tabular-nums text-teal-900/70">{formatINR(l.totalPaise)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-teal-100 pt-3 text-base font-bold text-[#006569]">
            <span>Total</span>
            <span className="tabular-nums">{formatINR(totals.totalPaise)}</span>
          </div>
        </>
      )}

      <Link
        href="/demo/checkout"
        aria-disabled={!hydrated || totals.itemCount === 0}
        className={`mt-4 flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
          hydrated && totals.itemCount > 0
            ? 'bg-teal-700 text-white hover:bg-teal-800'
            : 'pointer-events-none bg-teal-100 text-teal-900/40'
        }`}
      >
        Proceed to checkout
      </Link>
    </div>
  );
}