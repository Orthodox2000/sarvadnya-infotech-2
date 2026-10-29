import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Plug In Tally Industry Modules",
  description: "Pre-built industry modules that turn Tally into a system tuned to your operations — install and start using.",
  path: "/modules",
  keywords: ["tally modules", "industry modules tally", "tally tdl modules", "tally customization", "tally add ons"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
