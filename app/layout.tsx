import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, orgJsonLd, webSiteJsonLd } from "@/lib/seo";
import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets:['latin'],variable:'--font-playfair'});

// CHANGE: 2026-10-01 — Do not load Zoho SalesIQ during development.
//
// Why: the embed is a client-side <script> that reports straight to Zoho's own servers.
// It sits outside MongoDB entirely, so the VISITOR_IGNORE_IPS ignore list added to
// lib/visitors.ts cannot suppress it — every local page load (and every Puppeteer /
// curl verification run) registers a session in the owner's live Zoho dashboard, mixed
// in with real visitors.
//
// How: layout.tsx is a Server Component, and Next.js replaces process.env.NODE_ENV
// with a literal at build time, so this branch is statically eliminated in a production
// build — the two <script> tags below are byte-identical to before once deployed.
// Production is therefore unaffected; this only changes what `next dev` emits.
//
// Escape hatch: set ZOHO_SALESIQ_DISABLED=0 to re-enable locally (useful when
// debugging the embed itself). The default is "skip in development".
const ZOHO_DISABLED = process.env.ZOHO_SALESIQ_DISABLED === '1'
  || (process.env.ZOHO_SALESIQ_DISABLED === undefined && process.env.NODE_ENV === 'development');

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
        {/* CHANGE: 2026-08-31 — Zoho SalesIQ embed rendered VERBATIM as the canonical 2-tag snippet
            provided by Zoho (init script + zsiqwidget script, adjacent in one block, nothing split in <head>).
            The separate hide-hook inline script was removed; the chat/consent UI is now hidden only via the
            CSS opacity layer in globals.css (hidden, NOT suppressed → display/pointer-events remain intact). */}
        {/* CHANGE: 2026-10-01 — wrapped in the ZOHO_DISABLED guard so `next dev` does not report local
            page loads to Zoho's own servers (see the comment on ZOHO_DISABLED above). Statically
            eliminated in a production build, so the deployed markup is unchanged. */}
        {!ZOHO_DISABLED && <script dangerouslySetInnerHTML={{ __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}` }} />}
        {!ZOHO_DISABLED && <script id="zsiqscript" defer src="https://salesiq.zohopublic.in/widget?wc=siq2206f6c142ca693dad0cc4071612c0952f6f7bc1cf08e71cd693f685913813b346a77e21e757c80042de5e8938dd0719" />}
      </body>
    </html>
  );
}
