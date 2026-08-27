import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Tally Tutorials & Learning Hub",
  description: "Professional guides, webinars, and technical documentation to master TallyPrime and scale your business.",
  path: "/tutorials",
  keywords: ["tally tutorials", "learn tally", "tallyprime training", "tally videos", "tally guides"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
