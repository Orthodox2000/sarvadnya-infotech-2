import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Privacy Policy",
  description: "Sarvadnya Infotech LLP's Privacy Policy explains what data we collect, why we collect it, how we store it, and the choices you have.",
  path: "/privacy",
  keywords: ["privacy policy", "sarvadnya privacy", "data policy", "privacy"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
