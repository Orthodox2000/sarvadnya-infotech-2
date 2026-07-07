import type { Viewport } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)} style={{ colorScheme: "only light" }} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="relative min-h-full w-full bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
