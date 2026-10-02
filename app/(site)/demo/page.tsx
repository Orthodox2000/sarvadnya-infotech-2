import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/app/components/demo/ProductCard';
import CartSummary from './CartSummary';
import { CATALOG } from '@/lib/demo/catalog';

// CHANGE: 2026-10-02 — /demo is now a cart scaffold, replacing the 43-line homepage clone
// that used to live here (Task 3 deleted it). It is a TEST-ONLY payment harness.
//
// The catalog is a literal imported from lib/demo/catalog.ts — the same source the order
// route reprices from, so what is displayed and what is charged cannot diverge.
// noindex is declared on the layout AND here (belt and braces, per spec §3.7).

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Cart Test — Sarvadnya Infotech LLP',
  description: 'Isolated test-mode cart scaffold. No real payments.',
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#FBFAF6]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-teal-900 sm:text-3xl">Cart test harness</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-900/70">
            Add items to exercise the cart, the totals and a Razorpay test-mode payment end to
            end. This route is isolated from the live site and is not indexed.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <section aria-label="Products">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATALOG.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24">
            <CartSummary />
            <p className="mt-4 text-sm text-teal-900/70">
              Looking for the real thing?{' '}
              <Link
                href="/contact"
                className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-900"
              >
                Book a real demo
              </Link>
              .
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}