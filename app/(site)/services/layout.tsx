import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
export const metadata = seoMetadata({
  title: "Expert Tally Services",
  description: "Certified technical expertise to architect and support your TallyPrime environment for maximum business impact and seamless compliance.",
  path: "/services",
  keywords: ["tally services", "tallyprime", "tally support", "amc", "tdl customization", "corporate training"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
