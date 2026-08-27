import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Search — Sarvadnya Infotech",
  description: "Search products, services, tutorials and more across the Sarvadnya Infotech website of Tally solutions.",
  path: "/search",
  keywords: ["sarvadnya search", "site search", "search tally", "tally search"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
