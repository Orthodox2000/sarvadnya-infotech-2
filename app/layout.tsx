import dynamic from 'next/dynamic'
import Script from 'next/script'
import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import Navbar from "./components/Navbar";
import Productbar from "./components/Productbar";
import { theme as defaultTheme } from "@/lib/theme";
import { getSettings } from "@/lib/mongodb-utils";
import { palettes } from "@/lib/palettes";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const NewsFeed = dynamic(() => import("./components/NewsFeed"), {
  loading: () => (
    <div className="relative w-full bg-[#0f0529] h-[20px] flex items-center border-b border-white/10 z-[50]">
      <div className="px-6 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-700 animate-pulse" />
        <div className="h-2 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  )
});

const SupportButton = dynamic(() => import("./components/SupportButton"));

const NotificationToast = dynamic(() => import("./components/NotificationToast"));

export const metadata: Metadata = {
  title: "Sarvadnya Infotech",
  description: "Your Tally Assistance",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2" },
    ],
  },
  manifest: "/site.webmanifest?v=2",
};

export const viewport: Viewport = {
  colorScheme: "only light",
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
          headingLightColor: palette.heading, // Adjust if needed
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettingsData();
  const theme = await getTheme();

  return (
    <html lang="en" className={cn("h-full antialiased overflow-x-hidden", "font-sans", geist.variable)} style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className="relative min-h-full w-full overflow-x-hidden bg-background text-foreground"
        suppressHydrationWarning
        style={
          {
            "--primary-color": theme.primaryColor,
            "--secondary-color": theme.secondaryColor,
            "--primary-btn-color": theme.primaryButtonColor,
            "--secondary-btn-color": theme.secondaryButtonColor,
            "--heading-color": theme.headingColor,
            "--para-color": theme.paragraphColor,
            "--background-color": theme.backgroundColor,
            "--accent-color": theme.accentColor,
            "--heading-light-color": theme.headingLightColor,
          } as CSSProperties
        }
      >
        <div className="sticky top-0 z-[2000] w-full flex flex-col">
          <NewsFeed />
          <Navbar initialSettings={settings} />
          <Productbar initialSettings={settings} />
        </div>

        {children}
        <SupportButton initialSettings={settings} />
        <NotificationToast />
      </body>
    </html>
  );
}

