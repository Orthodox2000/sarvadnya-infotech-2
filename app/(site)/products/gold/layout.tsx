import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime Gold — Multi-User Tally Software",
  description: "TallyPrime Gold is the multi-user edition for growing teams — everyone works on the same live Tally data in real time on your LAN.",
  path: "/products/gold",
  keywords: ["tallyprime gold", "tally multi user", "tally for teams", "tally lan", "tally team collaboration"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
