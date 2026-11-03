import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
// CHANGE: 2026-11-03 — GSC 28d: /services 27 impressions, 0 clicks, but average position 1.8.
// Ranking second and earning nothing means the snippet did not look like the answer; the
// title now names the three services the child pages actually sell.
export const metadata = seoMetadata({
  title: "Tally Services: AMC, Support, TDL",
  description: "Tally AMC, implementation, TDL customisation and corporate training from a certified Tally partner.",
  path: "/services",
  keywords: ["tally services", "tallyprime", "tally support", "amc", "tdl customization", "corporate training"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
