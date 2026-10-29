import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — description tightened to fit the display limit (title kept: a legal page
// should be named plainly, not sold).
export const metadata = seoMetadata({
  title: "Terms & Conditions",
  description: "The terms governing use of the Sarvadnya Infotech LLP website, Tally customization, implementation, training and support services.",
  path: "/terms",
  keywords: ["terms and conditions", "terms of use", "sarvadnya terms", "tally terms"],
  // CHANGE: 2026-10-29 — legal page: plain answer, no sales tail (see lib/seo.ts `contactSuffix`).
  contactSuffix: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
