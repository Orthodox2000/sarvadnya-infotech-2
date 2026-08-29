import dynamic from 'next/dynamic'
import type { CSSProperties } from "react";
import type { Metadata } from 'next';
import Navbar from "../components/Navbar";
import Productbar from "../components/Productbar";
import { theme as defaultTheme } from "@/lib/theme";
import { getSettings, getNews } from "@/lib/mongodb-utils";
import { palettes } from "@/lib/palettes";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { VisitorProvider } from "../components/VisitorProvider";

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
    'Tally Certified Partner trusted by 1500+ businesses. TallyPrime, Tally on Cloud, AMC, Tally on WhatsApp, TallyDrive cloud backup, HRMS, TDL customization & corporate training.',
};

async function getTheme() {
  try {
    const settings = await getSettings();
    const themeJson = settings['SITE_THEME_PALETTE'];
    if (themeJson) {
      const { paletteId, bgIndex } = JSON.parse(themeJson);
      const palette = palettes.find(p => p.id === paletteId);
      if (palette) {
        const bg = palette.backgrounds[bgIndex] || palette.backgrounds[0];
        return {
          primaryColor: palette.primary,
          secondaryColor: palette.secondary,
          primaryButtonColor: palette.primary,
          secondaryButtonColor: palette.secondary,
          headingColor: palette.heading,
          paragraphColor: palette.paragraph,
          backgroundColor: bg.value,
          accentColor: palette.accent,
          headingLightColor: palette.heading,
        };
      }
    }
  } catch (err) {
    console.error('Error loading theme:', err);
  }
  return defaultTheme;
}

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
  const theme = await getTheme();

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
      </VisitorProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
