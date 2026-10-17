import type { Metadata } from 'next';
import { isLiveMode } from '@/lib/cart/payment';
import CheckoutContents from './CheckoutContents';

// CHANGE: 2026-10-02 — /checkout for the real site cart (SP-1 cart build).
// WHY: a server shell around the client cart summary — the cart lives in localStorage and
// cannot be read during SSR. The page is noindex (robots.ts also disallows /checkout) because
// a live checkout is a transaction surface, not content to be indexed.
//
// CHANGE: 2026-10-17 (go-live) — the Razorpay mode is read PER REQUEST and passed to the client
// as a boolean prop, so the test-mode banner can never be frozen into a static build from the
// wrong environment. `isLiveMode()` only reads RAZORPAY_MODE (never a key), so importing the
// payment seam here leaks nothing and constructs no SDK client.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Checkout — Sarvadnya Infotech LLP',
};

// Read the mode at request time rather than prerendering the banner into the HTML.
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const testMode = !isLiveMode();
  return (
    <main className="min-h-[70vh] bg-slate-50 pb-16">
      <CheckoutContents testMode={testMode} />
    </main>
  );
}
