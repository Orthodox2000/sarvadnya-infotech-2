import type { Metadata } from 'next';
import CheckoutContents from './CheckoutContents';

// CHANGE: 2026-10-02 — /checkout for the real site cart (SP-1 cart build).
// WHY: a server shell around the client cart summary — the cart lives in localStorage and
// cannot be read during SSR. The page is noindex (robots.ts also disallows /checkout) because
// a live checkout is a transaction surface, not content to be indexed.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Checkout — Sarvadnya Infotech LLP',
};

export default function CheckoutPage() {
  return (
    <main className="min-h-[70vh] bg-slate-50 pb-16">
      <CheckoutContents />
    </main>
  );
}