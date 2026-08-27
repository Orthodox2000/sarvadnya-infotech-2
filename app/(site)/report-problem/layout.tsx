import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Report a Problem",
  description: "Tell us what went wrong — no technical details needed. We'll figure out the rest and get it fixed.",
  path: "/report-problem",
  keywords: ["report problem", "report issue", "report bug", "tally support"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
