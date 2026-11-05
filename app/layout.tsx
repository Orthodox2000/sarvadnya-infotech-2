import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, orgJsonLd, webSiteJsonLd } from "@/lib/seo";
// CHANGE: 2026-11-05 — TEMPORARY Diwali greeting: the first-visit preload lives in lib/diwali-popup.ts.
import { buildDiwaliPreloadScript } from "@/lib/diwali-popup";
import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets:['latin'],variable:'--font-playfair'});

// CHANGE: 2026-10-09 — Third-party live chat removed. First-party Ask Sara remains.

export const viewport: Viewport = {
  colorScheme: "only light",
};

// CHANGE: 2026-08-27 — root metadata for AI/OG indexing: canonical metadataBase,
// default title/description, icons, Organization + WebSite structured data.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Sarvadnya Infotech', 'Tally partner', 'TallyPrime', 'Tally on Cloud', 'Tally AMC',
    'Tally on WhatsApp', 'TallyDrive', 'Tally backup', 'Tally TDL', // CHANGE: 2026-10-07 — "Tally training Pune" removed per owner (address is Mumbai, not Pune).
    // CHANGE: 2026-10-13 — brand + location terms per owner ("all pages contain company name,
    // location and other SEO triggering keywords"), metadata only.
    'CBD Belapur', 'Navi Mumbai', 'Tally partner Navi Mumbai', 'Tally certified partner',
    // CHANGE: 2026-11-02 — both spellings of the current release (see lib/seo.ts SITE_KEYWORDS).
    'TallyPrime 7.2', 'Tally Prime 7.2',
  ],
  icons: { icon: '/logo.png' },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    // CHANGE: 2026-11-03 — this is now the REAL default share image everywhere.
    // WHY: /website-thumbnail.png is public/website-thumbnail.png — the website thumbnail the
    // owner supplied (PNG, 1280x720, 8-bit RGB with no alpha channel). It replaced
    // /video-thumbnail.jpg here, which stays in use only as the homepage hero-video poster.
    // A declared aspect ratio that does not match the bytes is what makes WhatsApp crop the
    // preview oddly, so the numbers below are the file's real dimensions. `lib/seo.ts`
    // OG_IMAGE_* carries the same measured numbers for the pages that call seoMetadata()
    // (which is nearly all of them).
    images: [
      {
        url: '/website-thumbnail.png',
        width: 1280,
        height: 720,
        alt: `${SITE_NAME} — Tally Certified Partner Since 2008`,
      },
    ],

  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // CHANGE: 2026-11-03 — images added so the X/Twitter card is the same artwork as
    // WhatsApp/OG (it previously had none and relied on the retired app/twitter-image.tsx).
    // Same file as openGraph above; X follows OG when a card is not given its own image.
    images: ['/website-thumbnail.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={cn("h-full antialiased", "font-sans", geist.variable, playfair.variable)} style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* CHANGE: 2026-11-05 — TEMPORARY Diwali greeting preload. Runs during HTML parse, i.e.
            BEFORE the app bundle hydrates, and only for visitors with no `svd_diwali_2026` flag
            (and not on /checkout or /demo). The popup itself cannot render until hydration
            because it decides "first visit" from localStorage; without this the artwork request
            would only start once the JS had run. Returns cost nothing — the link is never
            created for a returning visitor. See lib/diwali-popup.ts and
            app/components/DiwaliPopup.tsx. */}
        <script id="diwali-preload" dangerouslySetInnerHTML={{ __html: buildDiwaliPreloadScript() }} />
      </head>
      <body className="relative min-h-full w-full bg-background text-foreground" suppressHydrationWarning>
        {/* CHANGE: 2026-08-27 — Organization + WebSite JSON-LD for search/AI indexing. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd(), webSiteJsonLd()]) }} />
        {children}
        {/* CHANGE: 2026-10-12 — <Analytics/> + <SpeedInsights/> live ONLY in app/(site)/layout.tsx.
            Every route directory sits under (site)/, so the pair added here on 73cb6c7 was a SECOND
            mount on every page; removed to restore the single mount carried since 32e84d1. */}
      </body>
    </html>
  );
}
