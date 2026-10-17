'use client';

// CHANGE: 2026-10-17 — TEMPORARY ₹1 live payment-trial UI.
// WHY (owner): "create a 1rs trial in demo route for pament and testing of route" — option 2,
// a REAL ₹1 item in the live cart catalogue plus this one-click page, so the whole live route
// (order -> Razorpay -> webhook -> verify -> receipt) can be exercised for one rupee.
//
// ⚠️ TEMPORARY: see page.tsx and AGENTS.md §25 for the "remove it properly" steps. The whole
// feature is deleted by removing app/(site)/checkout/trial/ + the catalogue entry + the DB doc
// (`npm run remove:payment-trial`). Deliberately self-contained: it adds no behaviour anywhere
// else on the site and no other page links to it.

import Link from 'next/link';
import { useCart } from '@/lib/cart/store';
import { formatRupeesPlain, isSellable, PAYMENT_TRIAL_SLUG } from '@/lib/prices';
import CartAddButton from '@/app/components/cart/CartAddButton';

export default function TrialPay() {
  const { resolve, items, pricesReady } = useCart();
  const item = resolve(PAYMENT_TRIAL_SLUG);
  const sellable = item !== null && isSellable(item);
  const inCart = items.some((l) => l.slug === PAYMENT_TRIAL_SLUG);
  const priceLabel = sellable ? formatRupeesPlain(item.payablePaise) : '1';

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-[#033B38] md:text-4xl">
        &#8377;1 Live Payment Trial
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        A temporary <strong>&#8377;1</strong> test product used to exercise the real checkout
        route end to end &mdash; order creation, Razorpay, the webhook backstop and the receipt.
        This page is intentionally not indexed and is removed once testing is complete.
      </p>

      <div className="mt-8 rounded-2xl border border-[#E9F1FA] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-[#033B38]">
              {item?.name ?? 'Payment Trial (Rs. 1)'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {sellable
                ? `Payable ${formatRupeesPlain(item.payablePaise)} INR (incl. GST)`
                : 'Trial item is not currently available in the price catalogue.'}
            </p>
          </div>
          <span className="shrink-0 text-2xl font-bold text-[#006569]">&#8377;{priceLabel}</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CartAddButton slug={PAYMENT_TRIAL_SLUG} label="Add ₹1 trial to cart" />
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#006569] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
          >
            Go to checkout &rarr;
          </Link>
        </div>

        {inCart && (
          <p className="mt-4 text-xs font-medium text-[#006569]">
            The &#8377;1 trial is in your cart &mdash; continue to checkout to pay.
          </p>
        )}

        {/* After the live price list settles, a missing/inactive row means the DB seed did not
            land for this deployment — surfaced here so the tester is never left guessing. */}
        {pricesReady && !sellable && (
          <p className="mt-4 text-xs font-medium text-amber-700">
            Not sellable right now &mdash; the <code>{PAYMENT_TRIAL_SLUG}</code> row is missing or
            inactive in the live price catalogue. Re-run <code>npm run seed:prices</code> against
            the deployed database.
          </p>
        )}
      </div>
    </main>
  );
}
