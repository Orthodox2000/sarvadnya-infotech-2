'use client';

// CHANGE: 2026-10-02 — "successfully added to cart" popover (SP-1 cart build).
// WHY: every successful add fires a `lastAdd` event from the store; this component renders a
// compact bottom-right toast that confirms the add AND drives the Amazon-style upsell: the
// main item's "frequently paired" companions as one-tap quick chips, its related add-ons as
// links to /addons, and its modules as chips that explain, on click, that modules are not for
// sale yet. `addQuiet` on the chip keeps the toast on the original item — a chip add must not
// re-fire the event and swap the toast's subject.
//
// Auto-hides after POPOVER_TTL_MS like the ConsentBanner auto-collapse pattern.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { POPOVER_TTL_MS, useCart } from '@/lib/cart/store';
import { formatINR } from '@/lib/cart/format';
import { getAddonById } from '@/lib/addons';

export default function CartAddedPopover() {
  const { lastAdd, clearLastAdd, items, priceOf, addQuiet, openDrawer } = useCart();
  const [note, setNote] = useState<string | null>(null);

  // Auto-hide. A NEW add restarts the clock via the dependency on lastAdd.
  useEffect(() => {
    if (!lastAdd) return;
    const t = window.setTimeout(() => clearLastAdd(), POPOVER_TTL_MS);
    return () => window.clearTimeout(t);
  }, [lastAdd, clearLastAdd]);

  if (!lastAdd) return null;

  const main = priceOf(lastAdd.main);
  const inCart = new Set(items.map((i) => i.slug));
  const companions = (main?.pairsWith ?? [])
    .map((s) => priceOf(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && !inCart.has(p.slug));
  const addons = (main?.addonSlugs ?? [])
    .map((id) => ({ id, addon: getAddonById(id) }))
    .filter((x): x is { id: string; addon: NonNullable<ReturnType<typeof getAddonById>> } => Boolean(x.addon));
  const modules = (main?.moduleSlugs ?? [])
    .map((s) => priceOf(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const companionNote =
    lastAdd.addedCompanions.length > 0
      ? ` + ${lastAdd.addedCompanions.length} paired item${lastAdd.addedCompanions.length > 1 ? 's' : ''}`
      : '';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-2 bottom-[calc(10%+3.75rem)] z-[4000] w-[min(92vw,390px)] rounded-xl border border-[#E9F1FA] bg-white shadow-2xl shadow-slate-900/20 animate-cart-pop-in"
    >
      <div className="flex items-start gap-2.5 border-b border-slate-100 px-4 pt-3.5 pb-2.5">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#006569]/10 text-[#006569]">
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-slate-900">Added to cart{companionNote}</p>
          <p className="truncate text-xs text-slate-600">
            {main?.name ?? lastAdd.main}
            {main && main.priceStatus === 'priced' ? ` · ${formatINR(main.payablePaise)}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={clearLastAdd}
          aria-label="Dismiss"
          className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              clearLastAdd();
              openDrawer();
            }}
            className="flex-1 rounded-lg border border-[#006569] bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#006569] hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            View Cart
          </button>
          <Link
            href="/checkout"
            onClick={clearLastAdd}
            className="flex-1 rounded-lg bg-[#006569] px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            Checkout
          </Link>
        </div>

        {companions.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Often bought together</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {companions.map((companion) => (
                <button
                  key={companion.slug}
                  type="button"
                  onClick={() => addQuiet(companion.slug)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#D4EAEA] bg-[#E5F4F4]/60 px-2.5 py-1 text-[11px] font-semibold text-[#045A57] hover:bg-[#D4EAEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  + Add {companion.name}
                  <span className="text-[#006569]">{formatINR(companion.payablePaise)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {addons.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Popular add-ons</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {addons.map(({ id, addon }) => (
                <Link
                  key={id}
                  href={`/addons#${id}`}
                  onClick={clearLastAdd}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-[#006569] hover:text-[#006569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  {addon.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {modules.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Related modules</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {modules.map((mod) => (
                <button
                  key={mod.slug}
                  type="button"
                  onClick={() => setNote(`"${mod.name}" cannot be added now — modules are not for sale yet.`)}
                  className="inline-flex items-center rounded-full border border-dashed border-slate-300 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:border-[#006569] hover:text-[#006569] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  {mod.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {note && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800" role="status">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}