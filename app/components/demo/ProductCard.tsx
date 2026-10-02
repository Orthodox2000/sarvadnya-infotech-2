'use client';

// CHANGE: 2026-10-02 — product card for the /demo cart scaffold (SP-1).
// WHY: renders one server-authoritative catalog entry. The price shown comes from
// catalog.ts, NOT from any client state — the same literal the order route reprices from.
//
// React.memo per the AGENTS.md performance convention: the catalog grid re-renders on every
// cart change, and without memo all 8 cards would re-render for a single quantity change.
// min-h-10 (40px) tap target and a real focus-visible ring per the accessibility rule.

import Image from 'next/image';
import { memo } from 'react';
import { useCart } from '@/lib/demo/cart-store.tsx';
import { formatINR } from '@/lib/demo/format.ts';
import type { CatalogProduct } from '@/lib/demo/catalog.ts';

function ProductCard({ product }: { product: CatalogProduct }) {
  const { add } = useCart();

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex h-32 items-center justify-center bg-teal-50 p-4">
        <Image
          src={product.image}
          alt=""
          width={96}
          height={96}
          className="h-20 w-auto max-w-full object-contain"
          // Sizes: the grid is 1-col at 360px, 2-col at sm, 3-col at lg.
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-teal-900">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-teal-900/70">{product.description}</p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="text-lg font-bold text-teal-700">
            {formatINR(product.pricePaise)}
            <span className="ml-1 text-xs font-normal text-teal-900/60">+{product.taxPct}% GST</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => add(product.id, 1)}
          className="mt-3 min-h-10 w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default memo(ProductCard);