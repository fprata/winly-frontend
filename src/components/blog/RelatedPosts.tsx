import { Link } from '@/navigation'
import { getAllPosts } from '@/lib/blog'
import { Calendar, ArrowRight } from 'lucide-react'
import type { BlogPostMeta } from '@/lib/blog'

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  locale: string
}

function scorePost(post: BlogPostMeta, currentTags: string[]): number {
  return post.tags.filter((tag) => currentTags.includes(tag)).length
}

export async function RelatedPosts({ currentSlug, currentTags, locale }: RelatedPostsProps) {
  const allPosts = getAllPosts(locale)
  const otherPosts = allPosts.filter((p) => p.slug !== currentSlug)

  if (otherPosts.length === 0) return null

  const scored = otherPosts
    .map((post) => ({ post, score: scorePost(post, currentTags) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })

  const related = scored.slice(0, 3).map((s) => s.post)

  return (
    <section className="mt-16 pt-12 border-t border-zinc-200">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 hover:shadow-md hover:border-zinc-300 transition-all group"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
