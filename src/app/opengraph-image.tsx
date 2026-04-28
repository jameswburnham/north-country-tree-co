import { ImageResponse } from 'next/og';

// Next.js will auto-generate <meta property="og:image"> and <meta name="twitter:image">
// from this file. URL: /opengraph-image
export const runtime = 'edge';
export const alt =
  "North Country Tree Co. — Plattsburgh's 24/7 Tree Removal & Care";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #143d2e 0%, #1a4d3a 100%)',
          padding: '64px 80px',
          color: '#faf6f0',
        }}
      >
        {/* Top: Logo + brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              width: 72,
              height: 72,
              background: '#faf6f0',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#1a4d3a">
                <polygon points="16,4 11,11 21,11" />
                <polygon points="16,9 9,18 23,18" />
                <polygon points="16,15 7,25 25,25" />
                <rect x="14.25" y="25" width="3.5" height="3.5" />
              </g>
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 44, fontFamily: 'serif', lineHeight: 1 }}>
              North Country
            </div>
            <div
              style={{
                fontSize: 16,
                letterSpacing: '0.3em',
                marginTop: 6,
                opacity: 0.85,
              }}
            >
              TREE CO.
            </div>
          </div>
        </div>

        {/* Middle: Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              lineHeight: 1.05,
              fontFamily: 'serif',
            }}
          >
            Plattsburgh&apos;s 24/7
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              lineHeight: 1.05,
              fontFamily: 'serif',
            }}
          >
            Tree Removal &amp; Care
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              marginTop: 8,
              opacity: 0.85,
            }}
          >
            Family-owned · Fully insured · Free quotes within 24 hours
          </div>
        </div>

        {/* Bottom: Phone CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: '#faf6f0',
              color: '#1a4d3a',
              padding: '16px 28px',
              borderRadius: 10,
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            (518) 555-0142
          </div>
          <div style={{ display: 'flex', fontSize: 22, opacity: 0.75 }}>
            24/7 emergency line
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
