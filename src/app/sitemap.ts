import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/blog'

const BASE_URL = 'https://winly.me'
const locales = ['en', 'pt']

function localizedEntries(
  path: string,
  opts: { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntries('', { changeFrequency: 'weekly', priority: 1 }),
    ...localizedEntries('/about', { changeFrequency: 'monthly', priority: 0.8 }),
    ...localizedEntries('/blog', { changeFrequency: 'weekly', priority: 0.9 }),
    ...localizedEntries('/contact', { changeFrequency: 'monthly', priority: 0.8 }),
    ...localizedEntries('/terms', { changeFrequency: 'yearly', priority: 0.3 }),
    ...localizedEntries('/privacy', { changeFrequency: 'yearly', priority: 0.3 }),
    ...localizedEntries('/login', { changeFrequency: 'monthly', priority: 0.9 }),
  ]

  const blogPosts: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllSlugs(locale).map((slug) => ({
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...blogPosts]
}
