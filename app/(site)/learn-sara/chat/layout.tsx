import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-10-26 — the chat screen now lives at /learn-sara/chat and keeps the noindex
// that used to cover the whole /learn-sara subtree. WHY: the hub at /learn-sara and the ten
// topic guides under /learn-sara/<topic> are real content and MUST be indexable, while a
// chat shell has no crawlable value and would compete with its own guides. Colocated here
// (not on the parent layout) so the noindex cannot leak onto the indexable pages.
export const metadata = seoMetadata({
  title: "Learn Sara — TallyPrime Learning Assistant",
  description: "Hi! I'm Sara, your TallyPrime learning assistant. I can walk you through GST setup, invoicing, inventory, payroll, bank reconciliation, reports, and much more.",
  path: "/learn-sara/chat",
  keywords: ["learn tally", "tallyprime learning assistant", "sara tally", "learn sara", "tally tutorials"],
  noindex: true,
});

export default function LearnSaraChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
