import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Train Your Team on TallyPrime",
  description: "Product-based and scenario-based TallyPrime training built around your business, taught by certified experts.",
  path: "/services/corporate-training",
  keywords: ["tally training", "tally corporate training", "tallyprime training", "gst training", "tally certification"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
