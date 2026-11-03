import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (owner: pages get
// impressions but few clicks). Description trimmed under the 160-char display limit incl. suffix.
// CHANGE: 2026-11-03 — GSC 28d: /about 194 impressions, 1 click, position 4.0. A position-4
// page with 0.5% CTR is a snippet problem: brand queries ("sarvadnya", 228 impressions, 0
// clicks) were answered by a title that only carried the name in the truncated tail. The name
// now leads, so seoMetadata()'s `alreadyBranded` check skips the duplicate suffix.
export const metadata = seoMetadata({
  title: "About Sarvadnya Infotech: Tally Partner Since 2008",
  description: "Certified Tally partner since 2008 in CBD Belapur. 1,500+ businesses rely on us for TallyPrime, cloud, AMC and TDL.",
  path: "/about",
  keywords: ["about sarvadnya", "sarvadnya infotech", "tally certified partner", "tally partner navi mumbai"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
