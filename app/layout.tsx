import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, orgJsonLd, webSiteJsonLd } from "@/lib/seo";
import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets:['latin'],variable:'--font-playfair'});

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
    'Tally on WhatsApp', 'TallyDrive', 'Tally backup', 'Tally TDL', 'Tally training Pune',
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
      {/* CHANGE: 2026-08-27 — Leadfeeder tracker COMMENTED OUT (was injected verbatim in <head>).
          Replaced by Zoho SalesIQ tracking-only embed in <body> below. Restore by uncommenting. */}
      <head suppressHydrationWarning>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `(function(ss,ex){ window.ldfdr=window.ldfdr||function(){(ldfdr._q=ldfdr._q||[]).push([].slice.call(arguments));}; (function(d,s){ fs=d.getElementsByTagName(s)[0]; function ce(src){ var cs=d.createElement(s); cs.src=src; cs.async=1; fs.parentNode.insertBefore(cs,fs); }; ce('https://sc.lfeeder.com/lftracker_v1_'+ss+(ex?'_'+ex:'')+'.js'); })(document,'script'); })('lYNOR8x5Dwq7WQJZ');`
          }}
        /> */}
      </head>
      <body className="relative min-h-full w-full bg-background text-foreground" suppressHydrationWarning>
        {/* CHANGE: 2026-08-27 — Organization + WebSite JSON-LD for search/AI indexing. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd(), webSiteJsonLd()]) }} />
        {children}
        {/* CHANGE: 2026-08-27 — Zoho SalesIQ TRACKING-ONLY embed (reactivated; Leadfeeder now commented out in <head>).
            The chat button is suppressed via the hide hook so the script only serves visitor analytics. */}
        <script dangerouslySetInnerHTML={{ __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};$zoho.salesiq.ready(function(){try{$zoho.salesiq.floatbutton&&$zoho.salesiq.floatbutton.visible&&$zoho.salesiq.floatbutton.visible("hide")}catch(e){}try{$zoho.salesiq.chatbutton&&$zoho.salesiq.chatbutton.visible&&$zoho.salesiq.chatbutton.visible("hide")}catch(e){}})` }} />
        <script id="zsiqscript" defer src="https://salesiq.zohopublic.in/widget?wc=siq539386e56b76884f928a8048a569c499cd2f211af4903e74d1fcabc147a596a7" />
      </body>
    </html>
  );
}
