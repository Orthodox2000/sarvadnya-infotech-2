'use client';

// CHANGE: 2026-10-02 — the "Buy Now!" CTA for priced pages (SP-1 cart build).
// WHY: on pages whose primary item has "frequently paired" companions (silver/gold/tallydrive)
// the button opens the Amazon-style bundle modal; for items with no pairings it adds directly
// and lets the popover do the upsell. One component, one teal visual language, used by the
// hero + bottom CTAs on every priced page.

import { useState } from 'react';
import { useCart } from '@/lib/cart/store';
import { isSellable } from '@/lib/prices';
import BuyBundleModal from './BuyBundleModal';

export default function BuyNowButton({
  slug,
  label = 'Buy Now!',
  className = '',
}: {
  slug: string;
  label?: string;
  className?: string;
}) {
  const { resolve, add } = useCart();
  const [open, setOpen] = useState(false);

  const item = resolve(slug);
  const hasPairs =
    item !== null &&
    isSellable(item) &&
    (item.pairsWith ?? []).some((s) => {
      const pair = resolve(s);
      return pair !== null && isSellable(pair);
    });

  const base = 'inline-flex items-center justify-center gap-2 rounded-lg bg-[#006569] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#045A57] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2';

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (hasPairs) setOpen(true);
          else {
            const r = e.currentTarget.getBoundingClientRect();
            const result = add(slug, 1, { x: r.x, y: r.y, w: r.width, h: r.height });
            // Unpriced items are never reachable here (callers gate on the page's own rows),
            // but the guard keeps a mis-wired page from silently doing nothing.
            if (!result.ok && result.reason === 'unpriced') setOpen(false);
          }
        }}
        className={`${base} ${className}`}
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
      {open && <BuyBundleModal slug={slug} onClose={() => setOpen(false)} />}
    </>
  );
}