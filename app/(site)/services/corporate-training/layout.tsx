import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
export const metadata = seoMetadata({
  title: "Tally Corporate Training",
  description: "Empower your team with expert knowledge. Product-based and scenario-based TallyPrime training tailored to your business, taught by certified experts.",
  path: "/services/corporate-training",
  keywords: ["tally training", "tally corporate training", "tallyprime training", "gst training", "tally certification"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
