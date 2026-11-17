import dynamic from 'next/dynamic'
import type { CSSProperties } from "react";
import type { Metadata } from 'next';
import Navbar from "../components/Navbar";
import Productbar from "../components/Productbar";
import { getSettings, getNews } from "@/lib/mongodb-utils";
// CHANGE: 2026-11-16 — getSettings() returns the raw uppercase-key map; components read
// snake_case fields. Normalise once here (see lib/site-settings.ts).
import { normaliseSettings } from "@/lib/site-settings";
import { CONTACT_SUFFIX } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { VisitorProvider } from "../components/VisitorProvider";
import ConsentBanner from "../components/ConsentBanner";
// CHANGE: 2026-11-16 — greeting popup (first visit at once, returning visitors after 20 s).
// REMOVAL: delete this import + the <GreetingPopup /> mount below, then the component file.
import GreetingPopup from "../components/GreetingPopup";
import { CartProvider } from "@/lib/cart/store";
import CartAddedPopover from "../components/cart/CartAddedPopover";
// CHANGE: 2026-10-02 — ONE drawer mount for both navbar variants. Mounting it inside the
// desktop variant's `hidden lg:flex` navbar container made it render at zero size on phones
// (a display:none ancestor hides even fixed-position descendants). Here it is a sibling of
// the sticky chrome, so it overlays correctly at every viewport.
import CartDrawer from "../components/cart/CartDrawer";
// CHANGE: 2026-11-02 — Google preferred-source button, mounted ONCE for the whole (site) group.
// WHY one mount: a per-page mount duplicated the <Script> and added 14 maintenance points.
// PreferredSourceGate restricts it to /tally-insights, /news, /tutorials and /modules (see its
// comment) — everywhere else gets the small footer link instead. The button itself appears once
// for five seconds per browser session.
import PreferredSource from "../components/PreferredSource";
import PreferredSourceGate from "../components/PreferredSourceGate";

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
  // CHANGE: 2026-11-16 — SupportButton reads whatsapp_phone/support_phone; the raw map made both
  // undefined and (being truthy) skipped its /api/settings fetch, so the floating WhatsApp button
  // used the hard-coded support number instead of the configured WhatsApp number.
  const siteSettings = normaliseSettings(settings);

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
          <SupportButton initialSettings={siteSettings} />
          <NotificationToast />
          {/* CHANGE: 2026-09-30 — informational data-collection notice */}
          <ConsentBanner />
          {/* CHANGE: 2026-11-17 — greeting popup, mounted ONCE for the whole (site) group.
              New visitor session -> opens immediately; repeat session (admin visitor cookie
              already present) -> opens 20 s after landing. Once per browser tab session; the
              flag is raised in sessionStorage. Skips the checkout and demo-cart routes. */}
          <GreetingPopup />
          {/* CHANGE: 2026-10-02 — cart "added" popover renders site-wide from the store event. */}
          <CartAddedPopover />
          {/* CHANGE: 2026-10-02 — the cart drawer, mounted ONCE site-wide (see import note). */}
          <CartDrawer />
          {/* CHANGE: 2026-11-02 — preferred-source opt-in, mounted once here instead of per page.
              The gate allows only /tally-insights, /news and /tutorials. */}
          <PreferredSourceGate>
            <PreferredSource />
          </PreferredSourceGate>
        </VisitorProvider>
      </CartProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
