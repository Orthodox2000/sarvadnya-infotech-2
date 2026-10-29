import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — description tightened to fit the display limit (title kept: a legal page
// should be named plainly, not sold).
export const metadata = seoMetadata({
  title: "Privacy Policy",
  description: "What data Sarvadnya Infotech LLP collects, why we collect it, how we store it and the choices you have, including deletion requests.",
  path: "/privacy",
  keywords: ["privacy policy", "sarvadnya privacy", "data policy", "privacy"],
  // CHANGE: 2026-10-29 — legal page: plain answer, no sales tail (see lib/seo.ts `contactSuffix`).
  contactSuffix: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
