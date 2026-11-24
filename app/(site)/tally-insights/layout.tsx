// CHANGE: 2026-10-23 - Layout metadata moved out of the layout.
// WHY: the layout previously set canonical /tally-insights for the whole subtree, which
// would leak onto section and lesson pages. Section and lesson pages now set their own
// canonical. This keeps metadata ownership per-page.
// CHANGE: 2026-11-24 — the layout now owns the shared W3-style docs shell. It still sets no
// metadata, so per-page canonical/title/description ownership is unchanged. /tally-insights
// itself is a redirect (next.config.js), not a rendered page.
import W3DocsShell from "@/app/components/TallyInsights/W3DocsShell";

export default function TallyInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <W3DocsShell>{children}</W3DocsShell>;
}
