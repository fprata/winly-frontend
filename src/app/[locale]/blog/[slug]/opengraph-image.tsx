import { ImageResponse } from 'next/og'
import { getPost } from '@/lib/blog'

export const runtime = 'nodejs'
export const alt = 'Winly Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPost(slug, locale)

  const title = post?.title ?? 'Winly Blog'
  const tags = post?.tags ?? []
  const date = post?.date
    ? new Date(post.date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const readingTime = post?.readingTime ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 64px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Top: Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 900,
            }}
          >
            W
          </div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#18181b',
              letterSpacing: '-1px',
            }}
          >
            WINLY
          </span>
        </div>

        {/* Center: Title + Tags */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? 36 : title.length > 40 ? 44 : 52,
              fontWeight: 900,
              color: '#18181b',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              maxWidth: '1000px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>

          {tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {tags.slice(0, 4).map((tag) => (
                <div
                  key={tag}
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2563eb',
                    background: 'rgba(37, 99, 235, 0.1)',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: Date, reading time, URL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '16px',
              color: '#71717a',
              fontWeight: 500,
            }}
          >
            {date && <span>{date}</span>}
            {readingTime && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {readingTime}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#a1a1aa',
            }}
          >
            winly.me
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
