import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-09-17 — title switched to the positive hero line "Every feature you need.
// Nothing you don't." so the tab/SERP title sells the benefit instead of a generic label.
export const metadata = seoMetadata({
  title: "Every feature you need. Nothing you don't.",
  description: "Every feature you need. Nothing you don't. From invoicing to payroll, TallyPrime handles all your accounting features across every category — built for Indian businesses.",
  path: "/capabilities",
  keywords: ["tallyprime features", "tally capabilities", "tallyprime invoicing", "tallyprime payroll", "gst ready"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
