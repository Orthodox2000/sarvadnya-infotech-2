'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// CHANGE: 2026-11-02 — path gate for the site-wide Google preferred-source button.
// WHY: the button now mounts ONCE in app/(site)/layout.tsx so it reaches the homepage and every
// other route (the owner's "any page"), but a preferred-source offer is meaningless beside a
// payment form and we do not want Google's script on commercial flows. /checkout and /demo are the
// only (site) trees that take money or run the payment sandbox. /cart is included defensively even
// though the cart is a drawer today with no page route — if that page is ever added it must not
// carry the script either.
//
// WHY A GATE AND NOT A LAYOUT PER ROUTE: Next has no "layout except these routes" primitive, and
// re-mounting the component in 14 pages would duplicate one <Script> per document. This wrapper
// renders its children (the server component, so the button node is still static HTML) only when
// the current path is allowed. usePathname resolves during SSR as well, so the excluded routes
// never receive the node server-side either — it is not a hydration-only filter.
//
// Segment-exact deliberately: `/cart` must hide, `/careers` must not. A bare `startsWith('/cart')`
// would swallow any future `/cartoons`-style route.
const HIDDEN_PREFIXES = ['/checkout', '/demo', '/cart'] as const;

function isHidden(pathname: string): boolean {
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function PreferredSourceGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  if (isHidden(pathname)) return null;
  return <>{children}</>;
}
