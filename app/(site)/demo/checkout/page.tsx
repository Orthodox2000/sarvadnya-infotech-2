import type { Metadata } from 'next';
import CartContents from './CartContents';

// CHANGE: 2026-10-02 — /demo/checkout. Server shell (title + metadata) around a client
// component, because the cart lives in localStorage and cannot be read during SSR.
// noindex comes from the layout, repeated here per spec §3.7 for the nested route.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Checkout (Test) — Sarvadnya Infotech LLP',
};

export default function DemoCheckoutPage() {
  return (
    <main className="min-h-screen bg-[#FBFAF6]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-bold text-teal-900 sm:text-3xl">Checkout</h1>
        <p className="mt-2 text-sm leading-relaxed text-teal-900/70">
          Razorpay test mode. The mock bank page offers <strong>Success</strong> and{' '}
          <strong>Failure</strong> buttons — use both to check the happy path and the failure path.
        </p>
        <div className="mt-6">
          <CartContents />
        </div>
      </div>
    </main>
  );
}