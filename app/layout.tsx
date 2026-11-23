import type { Metadata, Viewport } from "next";
// CHANGE: 2026-11-19 — fonts are self-hosted. The woff2 files are committed under
// app/fonts/ and emitted by Next as hashed, immutable /_next/static/media assets, so
// the site no longer depends on fonts.googleapis.com / fonts.gstatic.com for the
// primary render. Google is retained only as a fallback (see the <head> link below
// and the `fallback` stacks on each localFont call).
import localFont from "next/font/local";
// CHANGE: 2026-11-23 — Google Tag Manager via @next/third-parties. The supplied tag is a
// GTM container (`gtm.js?id=GTM-…`), NOT a GA4 `G-…` property, so GoogleTagManager is the
// correct loader. It emits the required `gtm.start` dataLayer event and mounts through
// next/script (afterInteractive by default): no render-blocking <script> in <head>, no
// DOM mutation before hydration, no hydration mismatch. GTMParams has no `debugMode`
// prop at all, so Tag Assistant / verbose console output cannot be switched on here.
import { GoogleTagManager } from "@next/third-parties/google";
import { cn } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, orgJsonLd, webSiteJsonLd } from "@/lib/seo";
// CHANGE: 2026-11-16 — greeting popup: the first-visit preload lives in lib/greeting-popup.ts.
import { buildGreetingPreloadScript } from "@/lib/greeting-popup";
import "./globals.css";

// CHANGE: 2026-11-19 — self-hosted variable fonts. `fallback` deliberately keeps the
// Google family names (and a system stack) after the local face: if a font file fails
// to load, the browser falls through to Google's CSS rather than to a bare generic.
const geist = localFont({
  src: "./fonts/geist-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-sans",
  preload: true,
  fallback: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
});

const playfair = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-playfair",
  preload: true,
  fallback: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
});

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

// CHANGE: 2026-11-23 — the container id is public (it is already in the script URL).
// The env var wins so the container can be swapped without a code deploy; the fallback is
// the id supplied by the owner so a fresh deployment starts tracking immediately.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-NNQDM334";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={cn("h-full antialiased", "font-sans", geist.variable, playfair.variable)} style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* CHANGE: 2026-11-19 — Google Fonts as FALLBACK ONLY. The self-hosted faces above
            are first in every font-family stack, so the browser does not request these
            font files while the local woff2 loads. They exist for the failure case:
            if a local file is unavailable, the `fallback` names resolve against this
            stylesheet instead of collapsing to a generic system font. CSP style-src
            therefore allows fonts.googleapis.com; font-src already allows gstatic. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Playfair+Display:wght@400..900&display=swap" />
        {/* CHANGE: 2026-11-17 — greeting popup preload. Runs during HTML parse, i.e. BEFORE the
            app bundle hydrates. It (a) captures whether the admin visitor-session cookie
            `svd_vid` already exists into a window global — the new/repeat signal the popup
            needs — and (b) preloads the artwork for a NEW session only, whose card opens on
            mount. A repeat session waits 20 s and is not speculatively preloaded. The per-tab
            sessionStorage flag and the checkout/demo-cart skip list suppress both. The popup
            itself renders after hydration. See lib/greeting-popup.ts + GreetingPopup.tsx. */}
        <script id="greeting-preload" dangerouslySetInnerHTML={{ __html: buildGreetingPreloadScript() }} />
      </head>
      {/* CHANGE: 2026-11-23 — production only. Ad blockers / the GA opt-out add-on fire
          ERR_BLOCKED_BY_CLIENT on googletagmanager.com in local dev, which looks like a
          hydration failure in the console; skipping the loader in dev keeps it clean.
          Sibling of <body> directly under <html> — the official @next/third-parties
          placement, not inside <head> and not nested in a <div>. */}
      {process.env.NODE_ENV === "production" && <GoogleTagManager gtmId={GTM_ID} />}
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
