import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — description tightened for CTR (was 176 chars incl. suffix, past the display limit).
export const metadata = seoMetadata({
  title: "End-User License Agreement",
  description: "The End-User License Agreement covering our software, custom TDL modules, mobile apps and cloud services, including permitted use and restrictions.",
  path: "/eula",
  keywords: ["eula", "end user license agreement", "software license", "tally license"],
  // CHANGE: 2026-10-29 — legal page: plain answer, no sales tail (see lib/seo.ts `contactSuffix`).
  contactSuffix: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
