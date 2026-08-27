import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
export const metadata = seoMetadata({
  title: "Tally on WhatsApp — Automated Invoicing",
  description: "Send invoices, ledgers, and payment reminders to your client's WhatsApp the exact second you hit Save in Tally. Official, ban-proof WhatsApp integration.",
  path: "/services/tally-on-whatsapp",
  keywords: ["tally whatsapp", "whatsapp invoicing", "tally integration", "payment reminders", "automated billing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
