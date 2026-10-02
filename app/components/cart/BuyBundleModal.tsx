'use client';

// CHANGE: 2026-10-02 — Amazon-style "frequently bought together" bundle modal (SP-1 cart build).
// WHY: the Buy Now CTA on priced product pages offers the main item PLUS its curated pairings
// in one cart action, instead of a lonely single-line add. The main item is always included;
// companions already in the cart are shown as present (not re-added); the bundle total is
// recomputed live from the checked rows; "You save" reflects the companions' discounts.
// CHANGE: 2026-10-02 — NO auto-add (owner: "don't auto add all items, keep all checkboxes
// unticked, let them add"). selected now starts EMPTY (was: every pairable companion not
// already in the cart pre-checked). The shopper ticks exactly what they want; with nothing
// ticked the primary button adds just the main item. A "Browse all add-ons" Link was added
// under the frequently-paired list so shoppers can explore the full /addons catalogue before
// deciding (owner: "keep options to see more add-ons or frequently paired add-ons").

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/store';
import type { FlyRect } from '@/lib/cart/store';
import { formatINR } from '@/lib/cart/format';
import type { PriceItem } from '@/lib/prices-catalog.mjs';

export default function BuyBundleModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { resolve, items, addBundle } = useCart();
  const main = resolve(slug);
  const inCart = useMemo(() => new Set(items.map((i) => i.slug)), [items]);

  const companions = useMemo(
    () =>
      (main?.pairsWith ?? [])
        .map((s) => resolve(s))
        .filter((p): p is PriceItem => Boolean(p) && p.priceStatus === 'priced'),
    [main, resolve],
  );

  // Default: NOTHING is pre-checked (owner: "keep all checkboxes unticked, let them add").
  // The shopper ticks exactly the companions they want; the main item is always included.
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [added, setAdded] = useState<Set<string> | null>(null);
  const [justMain, setJustMain] = useState(false);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggle = useCallback((companionSlug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(companionSlug)) next.delete(companionSlug);
      else next.add(companionSlug);
      return next;
    });
  }, []);

  if (!main) return null; // Unknown slug — the caller only opens this for known priced items.

  const selectedCompanions = companions.filter((c) => selected.has(c.slug));
  const bundleTotal = main.payablePaise + selectedCompanions.reduce((sum, c) => sum + c.payablePaise, 0);
  const bundleSavings = selectedCompanions.reduce((sum, c) => sum + c.discountPaise, 0);

  const confirm = (companionSlugs: string[], from?: FlyRect) => {
    const addedCompanions = addBundle(main.slug, companionSlugs, from).addedCompanions;
    const mainAlreadyIn = inCart.has(main.slug);
    const addedAny = companionSlugs.length > 0 ? addedCompanions.length > 0 : !mainAlreadyIn;
    if (addedAny) {
      // Something went into the cart → close the modal so the fly-to-cart + toast take
      // over (owner: "close current modal and show animation of adding to cart").
      // The fly anchor is the button that just fired addBundle.
      onClose();
    } else {
      // Everything requested was already in the cart → keep the "already in your cart" screen.
      setAdded(new Set());
      setJustMain(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Frequently bought together"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Frequently bought together</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {added && added.size === 0 && !justMain ? (
          // Everything requested was already in the cart.
          <div className="space-y-4 px-5 py-6 text-center">
            <svg className="mx-auto size-10 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-slate-800">These items are already in your cart.</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[#006569] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="max-h-[52vh] overflow-y-auto px-5 py-4">
              {/* Main item — always included, never unchecked. */}
              <div className="flex items-center gap-3 rounded-xl border border-[#006569]/30 bg-[#E5F4F4]/50 p-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded border border-[#006569] bg-[#006569] text-white">
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-slate-900">{main.name}</p>
                  <p className="text-xs text-slate-500">{main.validity ?? ''}</p>
                </div>
                <p className="shrink-0 text-[13px] font-bold text-slate-900">{formatINR(main.payablePaise)}</p>
              </div>

              {companions.length > 0 && (
                <div className="mt-1.5 space-y-1.5">
                  {companions.map((companion) => {
                    const alreadyIn = inCart.has(companion.slug);
                    const checked = selected.has(companion.slug);
                    return (
                      <label
                        key={companion.slug}
                        className={`flex items-center gap-3 rounded-xl border p-3 ${
                          alreadyIn ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white hover:border-[#006569]/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={alreadyIn || checked}
                          disabled={alreadyIn}
                          onChange={() => toggle(companion.slug)}
                          className="size-4 shrink-0 accent-[#006569]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-slate-800">{companion.name}</span>
                          <span className="block text-xs text-slate-500">
                            {alreadyIn ? 'In your cart ✓' : (companion.validity ?? '')}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[13px] font-bold text-slate-900">{formatINR(companion.payablePaise)}</span>
                          {companion.discountPaise > 0 && (
                            <span className="block text-[11px] font-semibold text-[#006569]">Save {formatINR(companion.discountPaise)}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* "See more" affordance (owner request): explore the full add-on catalogue before
                  deciding. Navigates away — the modal unmounts with the page. */}
              <Link
                href="/addons"
                onClick={onClose}
                className="mt-2.5 inline-flex items-center gap-1 rounded-lg px-1 py-1 text-xs font-bold uppercase tracking-wide text-[#006569] hover:text-[#045A57] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
              >
                Browse all add-ons
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Bundle total (incl. GST)</p>
                <p className="text-lg font-black text-slate-900">{formatINR(bundleTotal)}</p>
              </div>
              {bundleSavings > 0 && (
                <p className="mt-0.5 text-right text-[11px] font-semibold text-[#006569]">You save {formatINR(bundleSavings)}</p>
              )}
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    confirm(
                      selectedCompanions.map((c) => c.slug),
                      { x: r.x, y: r.y, w: r.width, h: r.height },
                    );
                  }}
                  className="flex-1 rounded-lg bg-[#006569] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  Add {1 + selectedCompanions.length} item{selectedCompanions.length > 0 ? 's' : ''} to cart
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    confirm([], { x: r.x, y: r.y, w: r.width, h: r.height });
                  }}
                  className="flex-1 rounded-lg border border-[#006569] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#006569] hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  Just {main.name.split(' ')[0]}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}