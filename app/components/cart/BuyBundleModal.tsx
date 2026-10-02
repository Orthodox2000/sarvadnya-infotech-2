'use client';

// CHANGE: 2026-10-02 — Amazon-style "frequently bought together" bundle modal (SP-1 cart build).
// WHY: the Buy Now CTA on priced product pages offers the main item PLUS its curated pairings
// in one cart action, instead of a lonely single-line add. The main item is always included;
// companions already in the cart are shown as present (not re-added); the bundle total is
// recomputed live from the checked rows; "You save" reflects the companions' discounts.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart/store';
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

  // Default: every pairable companion NOT already in the cart is pre-checked.
  const [selected, setSelected] = useState<Set<string>>(() => {
    const start = new Set<string>();
    for (const c of companions) if (!inCart.has(c.slug)) start.add(c.slug);
    return start;
  });
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

  const confirm = (companionSlugs: string[]) => {
    addBundle(main.slug, companionSlugs);
    const present = new Set(companionSlugs.filter((s) => inCart.has(s)));
    setAdded(new Set(companionSlugs.filter((s) => !present.has(s))));
    setJustMain(companionSlugs.length === 0);
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
                  onClick={() => confirm(selectedCompanions.map((c) => c.slug))}
                  className="flex-1 rounded-lg bg-[#006569] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  Add {1 + selectedCompanions.length} item{selectedCompanions.length > 0 ? 's' : ''} to cart
                </button>
                <button
                  type="button"
                  onClick={() => confirm([])}
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