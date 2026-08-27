import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Learn Sara — TallyPrime Learning Assistant",
  description: "Hi! I'm Sara, your TallyPrime learning assistant. I can walk you through GST setup, invoicing, inventory, payroll, bank reconciliation, reports, and much more.",
  path: "/learn-sara",
  keywords: ["learn tally", "tallyprime learning assistant", "sara tally", "learn sara", "tally tutorials"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
