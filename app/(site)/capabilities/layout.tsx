import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime Capabilities",
  description: "Every feature you need. Nothing you don't. From invoicing to payroll, TallyPrime handles all your accounting features across every category — built for Indian businesses.",
  path: "/capabilities",
  keywords: ["tallyprime features", "tally capabilities", "tallyprime invoicing", "tallyprime payroll", "gst ready"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
