import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Talk to a Tally Expert Today",
  description: "Questions on Tally pricing, TSS renewal or a custom module? Call, WhatsApp or send the form — we reply fast.",
  path: "/contact",
  keywords: ["contact sarvadnya", "tally support", "tally partner contact", "tally enquiry"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
