import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-10-26 — the chat screen now lives at /learn-sara/chat and keeps the noindex
// that used to cover the whole /learn-sara subtree. WHY: the hub at /learn-sara and the ten
// topic guides under /learn-sara/<topic> are real content and MUST be indexable, while a
// chat shell has no crawlable value and would compete with its own guides. Colocated here
// (not on the parent layout) so the noindex cannot leak onto the indexable pages.
// CHANGE: 2026-10-29 — title trimmed to fit the 60-char SERP limit incl. brand suffix; the page
// stays noindex, but an over-long title still shows truncated in shares and browser tabs.
// CHANGE: 2026-10-29 — description trimmed to the 122-char budget (160 incl. CONTACT_SUFFIX)
// so even a truncated SERP/social card carries the full offer.
export const metadata = seoMetadata({
  title: "Learn Sara — Your Tally AI Tutor",
  description: "Ask Sara anything about TallyPrime — GST, invoicing, inventory, payroll, bank reconciliation and reports, answered step by step.",
  path: "/learn-sara/chat",
  keywords: ["learn tally", "tallyprime learning assistant", "sara tally", "learn sara", "tally tutorials"],
  noindex: true,
  // CHANGE: 2026-10-29 — noindex chat shell: full budget on the offer (see lib/seo.ts).
  contactSuffix: false,
});

export default function LearnSaraChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
