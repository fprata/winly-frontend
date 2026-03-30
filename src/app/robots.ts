import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/matches',
          '/matches/*',
          '/explorer',
          '/explorer/*',
          '/intelligence',
          '/intelligence/*',
          '/profile',
          '/profile/*',
          '/onboarding',
          '/onboarding/*',
          '/api/*',
          '/auth/*',
        ],
      },
    ],
    sitemap: 'https://winly.me/sitemap.xml',
  }
}
