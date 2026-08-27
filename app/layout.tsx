import type { Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets:['latin'],variable:'--font-playfair'});

export const viewport: Viewport = {
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable, playfair.variable)} style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
      {/* CHANGE: 2026-08-26 — Leadfeeder tracker injected VERBATIM into <head> as the raw vendor snippet.
          next/script serializes inline scripts into flight data (escaped, not visible in page source);
          a raw <script> in the rendered <head> keeps the exact markup on the client and fires without
          waiting for hydration. Run on browser only — the IIFE is client-side by nature. */}
      <head suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(ss,ex){ window.ldfdr=window.ldfdr||function(){(ldfdr._q=ldfdr._q||[]).push([].slice.call(arguments));}; (function(d,s){ fs=d.getElementsByTagName(s)[0]; function ce(src){ var cs=d.createElement(s); cs.src=src; cs.async=1; fs.parentNode.insertBefore(cs,fs); }; ce('https://sc.lfeeder.com/lftracker_v1_'+ss+(ex?'_'+ex:'')+'.js'); })(document,'script'); })('lYNOR8x5Dwq7WQJZ');`
          }}
        />
      </head>
      <body className="relative min-h-full w-full bg-background text-foreground" suppressHydrationWarning>
        {children}
        {/* CHANGE: 2026-08-25 — Zoho SalesIQ TRACKING-ONLY embed (temporarily commented out for Leadfeeder testing).
        <script dangerouslySetInnerHTML={{ __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};$zoho.salesiq.ready(function(){try{$zoho.salesiq.floatbutton&&$zoho.salesiq.floatbutton.visible&&$zoho.salesiq.floatbutton.visible("hide")}catch(e){}try{$zoho.salesiq.chatbutton&&$zoho.salesiq.chatbutton.visible&&$zoho.salesiq.chatbutton.visible("hide")}catch(e){}})` }} />
        <script id="zsiqscript" defer src="https://salesiq.zohopublic.in/widget?wc=siq539386e56b76884f928a8048a569c499cd2f211af4903e74d1fcabc147a596a7" /> */}
      </body>
    </html>
  );
}
