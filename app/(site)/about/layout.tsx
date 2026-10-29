import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (owner: pages get
// impressions but few clicks). Description trimmed under the 160-char display limit incl. suffix.
export const metadata = seoMetadata({
  title: "Meet Your Tally Partner Since 2008",
  description: "Certified Tally partner since 2008. 1,500+ businesses rely on us for TallyPrime, cloud, AMC and TDL support.",
  path: "/about",
  keywords: ["about sarvadnya", "sarvadnya infotech", "tally certified partner", "tally partner navi mumbai"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
