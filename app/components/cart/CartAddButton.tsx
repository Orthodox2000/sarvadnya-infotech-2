'use client';

// CHANGE: 2026-10-02 — compact per-row "Add to Cart" control for pricing tables (SP-1 cart build).
// WHY: every priced row on the silver/gold/tss/tallydrive tables gets one of these. It adds
// the exact row (via the store so unpriced/inactive items are refused) and lets the popover
// do the cross-sell. `label` lets the TSS page render "Add" while the product pages render
// "Add to Cart"; `quiet` suppresses the popover for the TallyDrive inline-storage row.

import { useCart } from '@/lib/cart/store';
import type { FlyRect } from '@/lib/cart/store';
import { isSellable } from '@/lib/prices';

export default function CartAddButton({
  slug,
  label = 'Add to Cart',
  quiet = false,
  className = '',
}: {
  slug: string;
  label?: string;
  quiet?: boolean;
  className?: string;
}) {
  const { resolve, add, addQuiet } = useCart();
  const item = resolve(slug);
  const sellable = item !== null && isSellable(item);

  return (
    <button
      type="button"
      disabled={!sellable}
      title={sellable ? `Add ${item.name} to cart` : 'This item cannot be added yet'}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const from: FlyRect = { x: r.x, y: r.y, w: r.width, h: r.height };
        if (quiet) addQuiet(slug);
        else add(slug, 1, from);
      }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#006569] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#006569] transition-colors hover:bg-[#006569] hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] ${className}`}
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      {label}
    </button>
  );
}