import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Link } from '@/navigation'
import { getAllPosts } from '@/lib/blog'
import { getTranslations } from 'next-intl/server'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on EU public procurement, tender strategies, and how AI is transforming government contracting for SMEs.',
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const posts = getAllPosts(locale)
  const t = await getTranslations('blog')

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-20">
            <p className="text-zinc-400 text-lg">{t('noPosts')}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-xl border border-zinc-200 shadow-sm p-8 hover:shadow-md hover:border-zinc-300 transition-all group"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-500 text-[15px] leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readingTime}
                    </span>
                  </div>
                  <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('readMore')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
