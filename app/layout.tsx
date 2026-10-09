import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, orgJsonLd, webSiteJsonLd } from "@/lib/seo";
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
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable, playfair.variable)} style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body className="relative min-h-full w-full bg-background text-foreground" suppressHydrationWarning>
        {/* CHANGE: 2026-08-27 — Organization + WebSite JSON-LD for search/AI indexing. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd(), webSiteJsonLd()]) }} />
        {children}

      </body>
    </html>
  );
}
