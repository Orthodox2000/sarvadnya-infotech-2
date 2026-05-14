import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import Navbar from "./components/Navbar";
import { theme } from "@/lib/theme";
import "./globals.css";
import Productbar from "./components/Productbar";
import NewsFeed from "./components/NewsFeed";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
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
          <Navbar />
          <Productbar />
        </div>

        {children}
      </body>
    </html>
  );
}
