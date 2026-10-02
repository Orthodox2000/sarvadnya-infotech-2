import type { Metadata } from 'next';
import DemoScopeBanner from '@/app/components/demo/DemoScopeBanner';
import { CartProvider } from '@/lib/demo/cart-store.tsx';

// CHANGE: 2026-10-02 — layout for the /demo cart scaffold (SP-1).
// WHY: the test-mode banner must appear on EVERY /demo page, not just the catalog, or a
// visitor landing straight on /demo/checkout via an old link would never see the notice.
// CartProvider wraps the subtree so the banner stays a server component.

export const metadata: Metadata = {
  // /demo is a test harness, not content. noindex on the layout covers every child route,
  // and robots.ts additionally disallows /demo and /demo/ (Task 3).
  robots: { index: false, follow: false },
  title: 'Cart Test — Sarvadnya Infotech LLP',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <DemoScopeBanner />
      {children}
    </CartProvider>
  );
}