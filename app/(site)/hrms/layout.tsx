import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Get HRMS Built Into TallyPrime",
  description: "Manage payroll, attendance, employee lifecycle and statutory compliance inside TallyPrime on one platform.",
  path: "/hrms",
  keywords: ["tally hrms", "tallyprime hrms", "tally payroll", "payroll software", "attendance software"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
