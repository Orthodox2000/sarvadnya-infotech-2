import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "HRMS for TallyPrime",
  description: "A complete Human Resource Management System integrated with TallyPrime to manage payroll, attendance, employee lifecycle, statutory compliance, and more — on a single platform designed for growing businesses.",
  path: "/hrms",
  keywords: ["tally hrms", "tallyprime hrms", "tally payroll", "payroll software", "attendance software"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
