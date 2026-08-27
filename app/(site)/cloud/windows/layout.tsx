import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Windows Cloud Desktop for Tally",
  description: "A full Windows desktop in the cloud for teams that print invoices, use Excel with Tally, and work from anywhere — just like sitting at the office.",
  path: "/cloud/windows",
  keywords: ["windows cloud desktop", "tally windows cloud", "tally virtual desktop", "tally cloud desktop", "windows vps tally"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}