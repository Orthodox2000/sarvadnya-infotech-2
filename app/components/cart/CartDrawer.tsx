'use client';

// CHANGE: 2026-10-02 — the slide-over cart drawer (SP-1 cart build).
// WHY: there is deliberately NO /cart page — the drawer → /checkout flow keeps the cart with
// the user wherever they are. Rows are memoized (AGENTS.md performance discipline), the
// stepper mirrors the /demo decision (minus at qty 1 REMOVES the line, it is the delete),
// discounted rows show their saving, and the totals panel recomputes from the store's
// server-parity math. Empty + pre-hydration states render instead of flashing a wrong cart.

import { memo } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/store';
import { formatINR, formatPlainSlash } from '@/lib/cart/format';
import type { CartLine } from '@/lib/cart/math';

const CartLineRow = memo(function CartLineRow({
  line,
  onPlus,
  onMinus,
  onRemove,
  onOpen,
}: {
  line: CartLine;
  onPlus: () => void;
  onMinus: () => void;
  onRemove: () => void;
  onOpen: (slug: string) => void;
}) {
  return (
    <li className="flex items-start gap-3 py-3">
      <button
        type="button"
        onClick={() => onOpen(line.slug)}
        title={`View ${line.item.name}`}
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#006569]/10 font-black text-[#006569] hover:bg-[#006569]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
      >
        {line.item.name
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase()}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-slate-900">{line.item.name}</p>
            <p className="text-[11px] text-slate-500">
              {line.item.validity ?? line.item.category}
              {line.unitPaise !== line.item.payablePaise ? '' : ''}
            </p>
            <p className="text-[11px] text-slate-600">
              {formatINR(line.unitPaise)}
              {line.item.discountPaise > 0 && (
                <span className="ml-1.5 font-semibold text-[#006569]">Save {formatINR(line.item.discountPaise)}</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.item.name} from cart`}
            className="shrink-0 rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex items-center rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={onMinus}
              aria-label={line.qty === 1 ? `Remove ${line.item.name} from cart` : `Decrease quantity of ${line.item.name}`}
              className="flex size-7 items-center justify-center rounded-l-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900" aria-label={`${line.qty} in cart`}>
              {line.qty}
            </span>
            <button
              type="button"
              onClick={onPlus}
              aria-label={`Increase quantity of ${line.item.name}`}
              className="flex size-7 items-center justify-center rounded-r-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
            >
              +
            </button>
          </div>
          <p className="text-sm font-black text-slate-900">{formatINR(line.totalPaise)}</p>
        </div>
      </div>
    </li>
  );
});

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, items, totals, hydrated, setQty, remove } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[9000]" role="dialog" aria-modal="true" aria-label="Your cart">
      <button type="button" aria-label="Close cart" onClick={closeDrawer} className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-[2px]" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-900">
            Your Cart
            {hydrated && totals.itemCount > 0 && (
              <span className="ml-2 rounded-full bg-[#006569]/10 px-2 py-0.5 text-[11px] font-bold text-[#006569]">
                {totals.itemCount} item{totals.itemCount > 1 ? 's' : ''}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {!hydrated ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="size-4 animate-spin rounded-full border-2 border-[#006569]/20 border-t-[#006569]" aria-hidden="true" />
              <span className="text-xs font-semibold">Loading your cart…</span>
            </div>
          </div>
        ) : totals.itemCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </span>
            <p className="mt-3 text-sm font-bold text-slate-800">Your cart is empty</p>
            <p className="mt-1 text-xs text-slate-500">TallyPrime licences, TSS renewals and TallyDrive storage can all be added here.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/products/silver" onClick={closeDrawer} className="rounded-lg border border-[#006569] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#006569] hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]">
                TallyPrime Silver
              </Link>
              <Link href="/products/gold" onClick={closeDrawer} className="rounded-lg border border-[#006569] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#006569] hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]">
                TallyPrime Gold
              </Link>
              <Link href="/services/tss" onClick={closeDrawer} className="rounded-lg border border-[#006569] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#006569] hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]">
                Renew TSS
              </Link>
              <Link href="/products/tallydrive" onClick={closeDrawer} className="rounded-lg border border-[#006569] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#006569] hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]">
                TallyDrive
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {totals.lines.map((line) => (
                <CartLineRow
                  key={line.slug}
                  line={line}
                  onPlus={() => setQty(line.slug, line.qty + 1)}
                  onMinus={() => (line.qty === 1 ? remove(line.slug) : setQty(line.slug, line.qty - 1))}
                  onRemove={() => remove(line.slug)}
                  onOpen={() => undefined}
                />
              ))}
            </ul>

            {/* Totals + CTA */}
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
              <dl className="space-y-1.5 text-[13px]">
                <div className="flex items-center justify-between text-slate-600">
                  <dt>Subtotal (base)</dt>
                  <dd className="font-semibold text-slate-800">{formatPlainSlash(totals.subtotalPaise)}</dd>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <dt>GST</dt>
                  <dd className="font-semibold text-slate-800">{formatPlainSlash(totals.gstPaise)}</dd>
                </div>
                {totals.discountPaise > 0 && (
                  <div className="flex items-center justify-between text-[#006569]">
                    <dt>Discount</dt>
                    <dd className="font-bold">− {formatPlainSlash(totals.discountPaise)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <dt className="text-sm font-black uppercase tracking-wide text-slate-900">Total</dt>
                  <dd className="text-lg font-black text-[#006569]">{formatINR(totals.totalPaise)}</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#006569] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
              >
                Proceed to Checkout
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">Test Mode</span>
                Checkout runs on Razorpay test keys
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}