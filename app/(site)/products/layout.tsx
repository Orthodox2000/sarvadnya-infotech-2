import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Pick Your TallyPrime Edition",
  description: "Compare TallyPrime Silver, Gold and Server editions and choose the one that fits your users and workload.",
  path: "/products",
  keywords: ["tallyprime products", "tally silver", "tally gold", "tally server", "tallyprime pricing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
