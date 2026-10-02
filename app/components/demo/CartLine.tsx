'use client';

// CHANGE: 2026-10-02 — cart row with quantity stepper and remove control (SP-1).
// WHY: one line item in the cart. The stepper clamps through the pure setQty/removeItem
// functions, so a user cannot drive quantity past MAX_QTY by holding the button, and a
// tampered localStorage qty is re-clamped on every read.
//
// React.memo: the cart list re-renders on every quantity change; without memo every row
// re-renders instead of just the one that changed.

import { memo } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/demo/cart-store.tsx';
import { formatINR } from '@/lib/demo/format.ts';
import { MAX_QTY, type CartLine as CartLineType } from '@/lib/demo/cart.ts';

function CartLine({ line }: { line: CartLineType }) {
  const { setQty, remove } = useCart();
  const { id, product, qty, totalPaise } = line;

  const btn =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-200 bg-white text-lg font-bold text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-teal-100 bg-white p-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-teal-50">
        <Image src={product.image} alt="" width={40} height={40} className="h-9 w-auto object-contain" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-teal-900">{product.name}</p>
        <p className="text-xs text-teal-900/60">{formatINR(line.unitPaise)} each</p>
      </div>

      <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${product.name}`}>
        {/* CHANGE: 2026-10-02 — the minus button now REMOVES the line when qty is already 1,
             instead of sitting disabled. Owner request: step below 1 and the item leaves the
             cart. Previously the stepper dead-ended at 1 and deleting required a second,
             separate "Remove" button further along the row — two targets for one intent, and
             the dead-end was the more natural place to press.

             The clamp in the pure setQty() is DELIBERATELY UNCHANGED and still floors at 1.
             That function is the server-side defence against a tampered qty of 0 or -5, so it
             must never mean "delete" — only this UI does that, via the explicit remove(). */}
        <button
          type="button"
          className={btn}
          onClick={() => (qty <= 1 ? remove(id) : setQty(id, qty - 1))}
          // The label states what the button will actually DO, so a screen-reader user is
          // not told "decrease" by a control that is about to delete the row.
          aria-label={qty <= 1 ? `Remove ${product.name} from cart` : `Decrease quantity of ${product.name}`}
        >
          &minus;
        </button>
        <span
          aria-live="polite"
          className="w-8 text-center text-sm font-semibold tabular-nums text-teal-900"
        >
          {qty}
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => setQty(id, qty + 1)}
          disabled={qty >= MAX_QTY}
          aria-label={`Increase quantity of ${product.name}`}
        >
          +
        </button>
      </div>

      <p className="w-24 text-right text-sm font-bold tabular-nums text-teal-800">
        {formatINR(totalPaise)}
      </p>

      {/* Kept alongside the stepper rather than replaced by it: after this change the minus
          button removes the item, but "remove" still deserves a plainly-named target that
          does not require counting down to 1 first. */}
      <button
        type="button"
        onClick={() => remove(id)}
        className="min-h-10 rounded-lg px-3 text-sm font-medium text-teal-900/60 underline-offset-2 transition-colors hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        aria-label={`Remove ${product.name} from cart`}
      >
        Remove
      </button>
    </li>
  );
}

export default memo(CartLine);