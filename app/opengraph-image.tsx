// CHANGE: 2026-10-12 — site-wide default Open Graph / social share image.
// WHY: there was no `opengraph-image`, so every share on WhatsApp/LinkedIn/Facebook/X had
// NO preview image (a real top-line SEO/CTR gap). Next's file convention generates a real
// 1200x630 PNG from the markup below and wires og:image automatically, so no binary asset
// has to be committed or kept in sync.
import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/seo'

export const alt = 'Sarvadnya Infotech LLP — Tally Certified Partner Since 2008'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #033B38 0%, #006569 100%)',
          padding: '70px 80px',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Tally Certified Partner
          </div>
          <div style={{ marginTop: 14, fontSize: 38, fontWeight: 600, color: '#B8DEDE' }}>
            Since 2008 | TallyPrime · Cloud &middot; AMC
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 26, color: '#D4EAEA' }}>
          <span>sarvadnyainfotech.com</span>
          <span>&bull;</span>
          <span>1500+ businesses served</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
