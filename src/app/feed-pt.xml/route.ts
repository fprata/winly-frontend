import { getAllPosts } from '@/lib/blog'

export async function GET() {
  const posts = getAllPosts('pt')

  const items = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString()
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>https://winly.me/pt/blog/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">https://winly.me/pt/blog/${encodeURIComponent(post.slug)}</guid>
      <pubDate>${pubDate}</pubDate>
${categories}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Winly Blog</title>
    <description>Informações sobre contratação pública europeia, inteligência de concursos e estratégias para ganhar contratos públicos.</description>
    <link>https://winly.me/pt/blog</link>
    <atom:link href="https://winly.me/feed-pt.xml" rel="self" type="application/rss+xml" />
    <language>pt</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
