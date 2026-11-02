import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
// CHANGE: 2026-11-02 — action-oriented listing title/description to lift low click-through.
// WHY: impressions were high but clicks low; the old title read generic, the new one names
// the outcome (billing/operations) and stays under the brand-truncated limit.
export const metadata = seoMetadata({
  title: "TallyPrime Industry Modules — Add Billing, LR & More",
  description:
    "Ready-made TallyPrime modules for CFA, transport, container handling, societies, agents and garments — with a free demo.",
  path: "/modules",
  keywords: [
    "tally modules",
    "tallyprime modules",
    "industry modules tally",
    "tally tdl modules",
    "tally customization",
    "tally add ons",
    "tallyprime addons",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
