import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { locales } from '@/i18n';
import { QueryProvider } from '@/providers/QueryProvider';
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://winly.vercel.app'),
  title: {
    default: "Winly AI | EU Procurement Intelligence Platform",
    template: "%s | Winly AI"
  },
  description: "Dominate the €2T+ public procurement market with AI-powered tender matching. 150-point scoring algorithm, win probability calculator, and competitive intelligence for TED & BASE tenders.",
    keywords: [
      "public procurement", 
      "tender matches", 
      "AI tender matching", 
      "TED analytics", 
      "BASE Portugal", 
      "tender intelligence"
    ],
  authors: [{ name: "Winly AI" }],
  creator: "Winly AI",
  publisher: "Winly AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://winly.vercel.app',
    siteName: 'Winly AI',
    title: 'Winly AI | EU Procurement Intelligence Platform',
    description: 'AI-powered procurement intelligence platform. Match TED & BASE tenders with 150-point scoring algorithm. Win probability calculator, competitor analysis, and price recommendations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Winly AI - Procurement Intelligence Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winly AI | EU Procurement Intelligence Platform',
    description: 'AI-powered tender matching for the €2T+ EU public procurement market. 150-point scoring, win probability, and competitive intelligence.',
    images: ['/og-image.png'],
    creator: '@winlyai',
  },
  alternates: {
    canonical: 'https://winly.vercel.app',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-zinc-50 min-h-screen text-zinc-900 font-sans antialiased overflow-x-hidden">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}