import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "About Sarvadnya Infotech",
  description: "Certified Tally Partner since 2008, serving 1,500+ clients with transparent consultancy and expert solutions. We specialize in understanding business pain areas quickly to deliver maximum saturation and satisfaction through system automation and right technology adoption.",
  path: "/about",
  keywords: ["about sarvadnya", "sarvadnya infotech", "certified tally partner", "tally partner pune"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
