// CHANGE: 2026-10-23 - Layout metadata moved to the hub page.
// WHY: the layout previously set canonical /tally-insights for the whole subtree, which
// would leak onto section and lesson pages. Section pages now set their own canonical, and
// the lesson page already does. This keeps metadata ownership per-page.
export default function TallyInsightsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
