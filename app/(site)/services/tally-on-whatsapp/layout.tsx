import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Send Tally Invoices on WhatsApp",
  description: "Send invoices, ledgers and payment reminders to your client's WhatsApp the second you hit Save in Tally.",
  path: "/services/tally-on-whatsapp",
  keywords: ["tally whatsapp", "whatsapp invoicing", "tally integration", "payment reminders", "automated billing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
