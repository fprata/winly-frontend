import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Winly - EU Procurement Intelligence Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              background: '#2563eb',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '36px',
              fontWeight: 900,
            }}
          >
            W
          </div>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#18181b',
              letterSpacing: '-2px',
            }}
          >
            WINLY
          </span>
        </div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#3f3f46',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          EU Procurement Intelligence Platform
        </div>
        <div
          style={{
            fontSize: '18px',
            color: '#71717a',
            marginTop: '16px',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          AI-powered tender matching for the 2T+ EU public procurement market
        </div>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '48px',
          }}
        >
          {['150-Point Scoring', 'Win Probability', 'Competitor Intel', 'AI Analysis'].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  color: '#2563eb',
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#2563eb',
                  }}
                />
                {label}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '14px',
            color: '#a1a1aa',
          }}
        >
          winly.me
        </div>
      </div>
    ),
    { ...size }
  )
}
