import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { locales } from '@/i18n';
import { QueryProvider } from '@/providers/QueryProvider';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { CookieConsent } from '@/components/CookieConsent';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://winly.me'),
  title: {
    default: "Winly | EU Procurement Intelligence Platform",
    template: "%s | Winly"
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
  authors: [{ name: "Winly" }],
  creator: "Winly",
  publisher: "Winly",
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
    url: 'https://winly.me',
    siteName: 'Winly',
    title: 'Winly | EU Procurement Intelligence Platform',
    description: 'AI-powered procurement intelligence platform. Match TED & BASE tenders with 150-point scoring algorithm. Win probability calculator, competitor analysis, and price recommendations.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Winly - Procurement Intelligence Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winly | EU Procurement Intelligence Platform',
    description: 'AI-powered tender matching for the €2T+ EU public procurement market. 150-point scoring, win probability, and competitive intelligence.',
    images: ['/opengraph-image'],
    creator: '@winlyme',
  },
  alternates: {
    canonical: 'https://winly.me',
    languages: {
      en: 'https://winly.me/en',
      pt: 'https://winly.me/pt',
      'x-default': 'https://winly.me/en',
    },
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
      <head>
        <link rel="alternate" type="application/rss+xml" title="Winly Blog (EN)" href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="Winly Blog (PT)" href="/feed-pt.xml" />
      </head>
      <body className="bg-zinc-50 min-h-screen text-zinc-900 font-sans antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Winly',
                  url: 'https://winly.me',
                  logo: 'https://winly.me/opengraph-image',
                  description: 'AI-powered procurement intelligence platform for EU public tenders.',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Avenida da Liberdade, 110',
                    addressLocality: 'Lisbon',
                    postalCode: '1250-146',
                    addressCountry: 'PT',
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'support.winly@winly.me',
                    contactType: 'customer service',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Winly',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web',
                  url: 'https://winly.me',
                  description: 'Match TED & BASE tenders with a 150-point AI scoring system. Win probability, competitor intelligence, and AI document analysis for EU public procurement.',
                  offers: [
                    {
                      '@type': 'Offer',
                      name: 'Explorer',
                      price: '0',
                      priceCurrency: 'EUR',
                      description: 'Free tier with limited tender matches.',
                    },
                    {
                      '@type': 'Offer',
                      name: 'Pro',
                      price: '99',
                      priceCurrency: 'EUR',
                      priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
                      description: 'Unlimited matches, 5 AI analyses/month, buyer & competitor intelligence.',
                    },
                    {
                      '@type': 'Offer',
                      name: 'Enterprise',
                      price: '199',
                      priceCurrency: 'EUR',
                      priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
                      description: 'Unlimited everything, AI chatbot, PDF/Excel export.',
                    },
                  ],
                },
              ],
            }),
          }}
        />
        <PostHogProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <CookieConsent />
            </NextIntlClientProvider>
          </QueryProvider>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}