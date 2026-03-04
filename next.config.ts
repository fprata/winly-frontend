import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' blob: data: https://*.supabase.co;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://*.supabase.co https://*.stripe.com https://vitals.vercel-insights.com;
              frame-src 'self' https://*.stripe.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
