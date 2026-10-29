import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Report a Tally Problem — We Fix It",
  description: "Tell us what went wrong — no technical details needed. Our team works out the rest and gets it fixed.",
  path: "/report-problem",
  keywords: ["report problem", "report issue", "report bug", "tally support"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
