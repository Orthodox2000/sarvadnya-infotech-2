import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Get TallyPrime Add-ons That Work",
  description: "Ready-made TDL add-ons for extra controls, prints, reports and automation. Tell us the gap and we set it up.",
  path: "/addons",
  keywords: ["tally addons", "tally tdl addons", "tallyprime add-ons", "tally customization"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
