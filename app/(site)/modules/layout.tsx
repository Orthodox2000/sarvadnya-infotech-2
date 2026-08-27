import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Tally Industry Modules",
  description: "Ready-to-run industry modules for Tally. Plug in our pre-built modules to transform your Tally into a complete, easy-to-use system that handles your daily operations instantly.",
  path: "/modules",
  keywords: ["tally modules", "industry modules tally", "tally tdl modules", "tally customization", "tally add ons"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
