import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Track Tally Sales on Your Phone",
  description: "Access live Tally data, track your field sales team and send WhatsApp payment reminders from your phone.",
  path: "/services/mobile-app-biz",
  keywords: ["tally mobile app", "biz analyst", "tally on mobile", "mobile tally", "sales tracking", "gps sales tracking"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
