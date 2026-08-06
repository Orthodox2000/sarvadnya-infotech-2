import type { Metadata, Viewport } from 'next';
import { Geist, Playfair_Display } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: 'Sarvadnya Infotech LLP — Certified Tally Partner Since 2008',
    template: '%s | Sarvadnya Infotech LLP',
  },
  description:
    'Certified Tally Partner trusted by 1500+ businesses. TallyPrime, Tally on Cloud, AMC, Tally on WhatsApp, TallyDrive cloud backup and more.',
  icons: { icon: '/logo.png' },
};

export const viewport: Viewport = {
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
