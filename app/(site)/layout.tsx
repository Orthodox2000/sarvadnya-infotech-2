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
      <div className="sticky top-0 z-[2000] w-full flex flex-col">
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
      </VisitorProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
