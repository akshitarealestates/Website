import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { DemoBanner } from '@/components/layout/demo-banner';
import { ConciergeWidget } from '@/components/ai/concierge-widget';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans-inter', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akshitarealestate.com';
const title = 'Akshita Real Estate — Premium Real Estate in Lucknow';
const description = 'Curated commercial, resell, and premium projects in Lucknow.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Akshita Real Estate',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-cream text-ink">
        {process.env.NEXT_PUBLIC_DEMO_AUTH === 'true' && <DemoBanner />}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Site-wide AI concierge; the widget hides itself on /admin via usePathname. */}
        <ConciergeWidget />
      </body>
    </html>
  );
}
