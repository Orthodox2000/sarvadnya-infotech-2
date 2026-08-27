import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime Products",
  description: "Explore TallyPrime Silver, Gold, and Server — and choose the right Tally product for your business needs.",
  path: "/products",
  keywords: ["tallyprime products", "tally silver", "tally gold", "tally server", "tallyprime pricing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
