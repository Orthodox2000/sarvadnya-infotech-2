import type { Metadata } from 'next';
// CHANGE: 2026-11-26 — renamed module (was ChromePreview.tsx) to force a fresh dev chunk URL.
// The browser had cached the old chunk under the same URL and kept throwing "flatten is not
// defined" even though the source and the on-disk chunk were already correct.
import ChromePreview from '@/app/components/demo/ChromePreviewV2';

// CHANGE: 2026-11-26 — /demo main page is a SELF-CONTAINED preview of the owner's new chrome
// design (see app/components/demo/ChromePreviewV2.tsx). The live site chrome in app/(site)/layout.tsx
// is deliberately unchanged; the preview is a fixed layer rendered only on this route.
//
// The cart/payment harness still lives on at /demo/checkout (left intact). noindex stays —
// this is a test route, never indexable content.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Cart Test — Sarvadnya Infotech LLP',
  description: 'Test-mode scaffold. No real payments.',
};

export default function DemoPage() {
  return <ChromePreview />;
}
