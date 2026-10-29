import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-09-17 — title switched to the hero line "Every feature you need.
// Nothing you don't." so the tab/SERP title sells the benefit instead of a generic label.
// CHANGE: 2026-09-17 (rev-2) — last clause replaced with positive framing per owner
// ("Nothing you don't" reads negatively for a feature page): "Every feature you need.
// Built for growth."
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "See What TallyPrime Can Do",
  description: "Invoicing, inventory, payroll, GST and reports. See every TallyPrime capability and pick what your business needs.",
  path: "/capabilities",
  keywords: ["tallyprime features", "tally capabilities", "tallyprime invoicing", "tallyprime payroll", "gst ready"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
