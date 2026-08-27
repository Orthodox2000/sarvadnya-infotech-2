import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime Add-ons",
  description: "Ready-made TDL add-ons that extend TallyPrime with extra controls, prints, reports and automation. Found what you need? Submit your requirement and our team will set it up for you.",
  path: "/addons",
  keywords: ["tally addons", "tally tdl addons", "tallyprime add-ons", "tally customization"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
