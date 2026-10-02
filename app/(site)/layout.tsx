import dynamic from 'next/dynamic'
import type { CSSProperties } from "react";
import type { Metadata } from 'next';
import Navbar from "../components/Navbar";
import Productbar from "../components/Productbar";
import { getSettings, getNews } from "@/lib/mongodb-utils";
import { CONTACT_SUFFIX } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { VisitorProvider } from "../components/VisitorProvider";
import ConsentBanner from "../components/ConsentBanner";
import { CartProvider } from "@/lib/cart/store";
import CartAddedPopover from "../components/cart/CartAddedPopover";
// CHANGE: 2026-10-02 — ONE drawer mount for both navbar variants. Mounting it inside the
// desktop variant's `hidden lg:flex` navbar container made it render at zero size on phones
// (a display:none ancestor hides even fixed-position descendants). Here it is a sibling of
// the sticky chrome, so it overlays correctly at every viewport.
import CartDrawer from "../components/cart/CartDrawer";

const NewsFeed = dynamic(() => import("../components/NewsFeed"), {
  loading: () => (
    <div className="relative w-full bg-[#006569] h-[20px] flex items-center border-b border-white/10 z-[50]">
      <div className="px-6 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
        <div className="h-2 w-32 bg-white/20 rounded animate-pulse" />
      </div>
    </div>
  )
});

const SupportButton = dynamic(() => import("../components/SupportButton"));

const NotificationToast = dynamic(() => import("../components/NotificationToast"));

// CHANGE: 2026-08-27 — site-wide title template + default description so every
// (site) route gets AI/search-friendly fallback metadata.
export const metadata: Metadata = {
  title: { default: 'Sarvadnya Infotech LLP — Tally Certified Partner Since 2008', template: '%s | Sarvadnya Infotech LLP' },
  description:
    'Tally Certified Partner trusted by 1500+ businesses. TallyPrime, Tally on Cloud, AMC, Tally on WhatsApp, TallyDrive cloud backup, HRMS, TDL customization & corporate training.' + CONTACT_SUFFIX,
};

// CHANGE: 2026-09-18 — removed getTheme(): its per-request Mongo call (a 3rd getSettings)
// produced a `theme` value that was never referenced anywhere in the layout/JSX.
// CHANGE: 2026-09-21 — restored the getSettingsData() declaration that was
// accidentally dropped with getTheme() (its body + the call at line 51 survived).
async function getSettingsData() {
  try {
    return await getSettings();
  } catch (err) {
    console.error('Error loading settings:', err);
    return {};
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, newsData] = await Promise.all([
    getSettingsData(),
    getNews().catch(() => [])
  ]);

  return (
    <>
      {/* CHANGE: 2026-10-02 — CartProvider must wrap the ENTIRE chrome, not just children:
          the Navbar cart button (inside the sticky header) consumes useCart. The store is a
          client boundary that holds cart state + the live price list for every page. */}
      <CartProvider>
        {/* CHANGE: 2026-10-02 — overflow-x-clip so the site chrome can NEVER widen the page.
            WHY: the Productbar row (justify-around, 8.5px labels) measures 381px at a 360px
            viewport — 21px wider than the screen. Without clipping, EVERY page scrolls
            horizontally on phones, and the receipt page's print preview showed the header
            pushed out on the left. `clip` (not `hidden`) is deliberate: it clips without
            creating a scroll container, so the sticky header and the megamenu dropdowns
            keep working, and fixed overlays (SupportButton) are unaffected.
            Tailwind's overflow-x-clip compiles to overflow-x: clip — unsupported browsers
            (Safari < 16.4) simply ignore it and keep the pre-existing behavior. */}
        <div className="sticky top-0 z-[2000] w-full flex flex-col overflow-x-clip">
          <NewsFeed initialData={newsData} />
          {/* CHANGE: 2026-08-26 — Navbar & Productbar are fully hardcoded now; settings no longer passed. */}
          <Navbar />
          <Productbar />
        </div>

        <VisitorProvider>
          {children}
          <SupportButton initialSettings={settings} />
          <NotificationToast />
          {/* CHANGE: 2026-09-30 — informational data-collection notice, replaces Zoho SalesIQ's
              own consent banner (suppressed in globals.css). Consent is assumed by browsing,
              so this never blocks anything — it only informs and deep-links to /privacy. */}
          <ConsentBanner />
          {/* CHANGE: 2026-10-02 — cart "added" popover renders site-wide from the store event. */}
          <CartAddedPopover />
          {/* CHANGE: 2026-10-02 — the cart drawer, mounted ONCE site-wide (see import note). */}
          <CartDrawer />
        </VisitorProvider>
      </CartProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
