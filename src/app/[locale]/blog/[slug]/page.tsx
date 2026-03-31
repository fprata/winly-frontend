import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Link } from '@/navigation'
import { getPost, getAllSlugs } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const locales = ['en', 'pt']
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    const slugs = getAllSlugs(locale)
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug, locale)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `https://winly.me/${locale}/blog/${slug}`,
      siteName: 'Winly',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://winly.me/${locale}/blog/${slug}`,
      languages: {
        en: `https://winly.me/en/blog/${slug}`,
        pt: `https://winly.me/pt/blog/${slug}`,
      },
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPost(slug, locale)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'Winly', url: 'https://winly.me' },
    mainEntityOfPage: `https://winly.me/${locale}/blog/${slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://winly.me/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://winly.me/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-zinc-400 mb-10 pb-8 border-b border-zinc-200">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime}
            </span>
            <span>{post.author}</span>
          </div>

          <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
