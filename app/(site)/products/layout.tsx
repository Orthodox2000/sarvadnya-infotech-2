import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
// CHANGE: 2026-11-03 — GSC 28d: /products 115 impressions, 1 click, position 7.6. "Pick Your
// TallyPrime Edition" names no edition; the title now leads with the product names people
// compare ("tally prime silver", "tally gold", "tally server"). "Editions" keeps it textually
// distinct from the comparison post /news/tallyprime-silver-gold-server-difference.
export const metadata = seoMetadata({
  title: "Tally Prime Silver, Gold & Server Editions",
  description: "Compare TallyPrime Silver, Gold and Server editions: users, multi-user access and the right fit.",
  path: "/products",
  keywords: ["tallyprime products", "tally silver", "tally gold", "tally server", "tallyprime pricing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
