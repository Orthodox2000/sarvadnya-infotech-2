'use client';

// CHANGE: 2026-10-02 — navbar cart button (SP-1 cart build).
// WHY: the navbar is `sticky top-0 z-[2000]` and appears on every page; the trigger must be
// reachable everywhere (badge + open). BOTH variants are pure triggers now — the drawer
// itself is mounted ONCE in app/(site)/layout.tsx.
//
// CHANGE: 2026-10-02 — drawer mount moved out. It used to live inside variant="desktop",
// which sits in the navbar's `hidden lg:flex` container — at <1024px that ancestor is
// display:none, so an open drawer rendered with ZERO size on phones (no descendant, fixed or
// not, renders inside a display:none box). One layout-level mount, always visible.

import { useCart } from '@/lib/cart/store';

export default function NavCartButton({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const { totals, hydrated, openDrawer } = useCart();
  const count = hydrated ? totals.itemCount : 0;

  const badge = count > 0 && (
    <span
      className="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-[#006569] px-1 text-[9px] font-black leading-4 text-white ring-2 ring-white"
      aria-hidden="true"
    >
      {count > 99 ? '99+' : count}
    </span>
  );

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        data-cart-target=""
        aria-label={`Open cart${count > 0 ? `, ${count} item${count > 1 ? 's' : ''}` : ''}`}
        className={`relative inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] ${
          variant === 'desktop'
            ? 'gap-2 border-[0.5px] border-slate-200 bg-white px-3.5 py-2 text-[11px] text-[#006569] shadow-sm hover:border-[#006569] hover:bg-teal-50 hover:text-[#006569]'
            : 'size-8 rounded-full text-slate-700 hover:bg-slate-100 hover:text-[#006569]'
        }`}
      >
        <svg className={variant === 'desktop' ? 'size-4' : 'size-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        {variant === 'desktop' && <span className="hidden xl:inline">Cart</span>}
        {badge}
      </button>
    </>
  );
}