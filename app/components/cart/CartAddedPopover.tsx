'use client';

// CHANGE: 2026-10-02 — compact "added to cart" toast + fly-to-cart animation (UX rework:
// owner: "too much click to checkout… close current modal and show animation of adding to
// cart"). The recommendations (companions / add-ons / modules) that used to live here are
// GONE from this toast — they moved into the CartDrawer below the line items (owner: "have
// recommendations and addons on but now opening modal"). This component now only:
//   1. flies a small teal glyph from the clicked button rect (the store's `add`/`addBundle`
//      capture the source rect into `lastAdd.from`) to the visible navbar cart button
//      (`[data-cart-target]` — one of the two variants is display:none at any width, so the
//      first element with a non-zero rect is the live one);
//   2. pulses the target button with `.animate-cart-pulse` when the glyph lands;
//   3. shows a compact confirmation toast (item name, price, View Cart / Checkout) that
//      auto-hides after POPOVER_TTL_MS.
// `prefers-reduced-motion` skips the fly/pulse (toast stays). `addQuiet` (drawer chips) does
// not fire `lastAdd`, so quiet adds never re-toast — the drawer stays the single surface.

import { useEffect } from 'react';
import Link from 'next/link';
import { POPOVER_TTL_MS, useCart } from '@/lib/cart/store';
import type { FlyRect } from '@/lib/cart/store';
import { formatINR } from '@/lib/cart/format';

/** The visible navbar cart button — the desktop variant is hidden at <lg, the mobile one at
 *  lg+, so exactly one candidate has a non-zero bounding rect at any viewport. */
function findCartTarget(): HTMLElement | null {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]'));
  return candidates.find((el) => el.getBoundingClientRect().width > 0) ?? null;
}

function flyToCart(from: FlyRect): void {
  const target = findCartTarget();
  if (!target) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fromCx = from.x + from.w / 2;
  const fromCy = from.y + from.h / 2;
  const toRect = target.getBoundingClientRect();
  const toCx = toRect.left + toRect.width / 2;
  const toCy = toRect.top + toRect.height / 2;

  // A small fixed teal glyph (mini cart) that travels from source to the badge.
  const glyph = document.createElement('div');
  glyph.setAttribute('aria-hidden', 'true');
  glyph.style.cssText = `position:fixed;left:${fromCx - 10}px;top:${fromCy - 10}px;width:20px;height:20px;z-index:9999;pointer-events:none;`;
  glyph.innerHTML = `<span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;border-radius:9999px;background:#006569;color:#fff;font-size:11px;font-weight:800;box-shadow:0 2px 6px rgba(0,101,105,.5)">+</span>`;
  document.body.appendChild(glyph);

  let removed = false;
  const finish = () => {
    if (removed) return;
    removed = true;
    glyph.remove();
    // Land → pulse the badge.
    target.classList.add('animate-cart-pulse');
    window.setTimeout(() => target.classList.remove('animate-cart-pulse'), 650);
  };

  if (typeof glyph.animate === 'function') {
    try {
      const anim = glyph.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${toCx - fromCx}px, ${toCy - fromCy}px) scale(0.35)`, opacity: 0.5 },
        ],
        { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      anim.onfinish = finish;
      return;
    } catch {
      // fall through to the instant-remove path
    }
  }
  finish();
}

export default function CartAddedPopover() {
  const { lastAdd, clearLastAdd, priceOf, openDrawer } = useCart();

  // Auto-hide. A NEW add restarts the clock via the dependency on lastAdd.
  useEffect(() => {
    if (!lastAdd) return;
    if (lastAdd.from) flyToCart(lastAdd.from);
    const t = window.setTimeout(() => clearLastAdd(), POPOVER_TTL_MS);
    return () => window.clearTimeout(t);
  }, [lastAdd, clearLastAdd]);

  if (!lastAdd) return null;

  const main = priceOf(lastAdd.main);
  const companionNote =
    lastAdd.addedCompanions.length > 0
      ? ` + ${lastAdd.addedCompanions.length} paired item${lastAdd.addedCompanions.length > 1 ? 's' : ''}`
      : '';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-2 bottom-[calc(10%+3.75rem)] z-[4000] w-[min(92vw,360px)] rounded-xl border border-[#E9F1FA] bg-white shadow-2xl shadow-slate-900/20 animate-cart-pop-in"
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#006569]/10 text-[#006569]">
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
      <div className="flex gap-2 border-t border-slate-100 px-4 py-2.5">
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
    </div>
  );
}