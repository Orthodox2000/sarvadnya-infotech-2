import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — buy-intent title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Buy TallyPrime Gold — Multi-User",
  description: "Multi-user TallyPrime for growing teams — everyone works on the same live data in real time on your LAN.",
  path: "/products/gold",
  keywords: ["tallyprime gold", "tally multi user", "tally for teams", "tally lan", "tally team collaboration"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
