'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// CHANGE: 2026-11-02 — path gate for the Google preferred-source button.
// WHY: the button mounts ONCE in app/(site)/layout.tsx so there is a single <Script> per document,
// but it must only appear where the owner asked for it. Session 2 made it site-wide; the owner then
// narrowed it to "tally insights, tutorials and news" — an ALLOW-list, so a new route never inherits
// Google's script by accident.
//
// WHY A GATE AND NOT A LAYOUT PER ROUTE: Next has no "layout only for these routes" primitive, and
// re-mounting the component in each page would duplicate the <Script> in a single document. This
// wrapper renders its children (the server component, so the button node is still static HTML) only
// on allowed paths. usePathname resolves during SSR too, so excluded routes never receive the node
// server-side either — it is not a hydration-only filter.
//
// Segment-exact deliberately: `/newsletter` must not match `/news`, and `/tutorials-archive` must
// not match `/tutorials`. A bare `startsWith('/news')` would swallow both.
//
// CHANGE: 2026-11-03 — the six module pages are now real brochure landings, so `/modules` joins
// the allow-list. The component itself appears once for 5 seconds per browser session (see
// PreferredSource.tsx), so this does not add a permanent overlay to the listing or its children.
const ALLOWED_PREFIXES = ['/tally-insights', '/news', '/tutorials', '/modules'] as const;

function isAllowed(pathname: string): boolean {
  return ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function PreferredSourceGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  if (!isAllowed(pathname)) return null;
  return <>{children}</>;
}
