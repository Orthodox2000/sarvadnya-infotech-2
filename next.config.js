/** @type {import('next').NextConfig} */
// CHANGE: 2026-08-21 — Zoho SalesIQ runs tracking-only (chat button hidden via JS); CSP allows its script/analytics domains
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-insights.com https://va.vercel-scripts.com https://*.zohopublic.in https://*.zohocdn.com https://sc.lfeeder.com`,
  `style-src 'self' 'unsafe-inline' https://*.zohocdn.com`,
  `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://img.youtube.com https://sarvadnya-infotech.vercel.app https://sarvadnyainfotech.com https://www.sarvadnyainfotech.com https://*.vercel-scripts.com https://*.zohopublic.in https://*.zohocdn.com`,
  `font-src 'self' data: https://*.zohocdn.com`,
  `connect-src 'self' https://api.groq.com https://*.public.blob.vercel-storage.com https://sarvadnya-infotech.vercel.app https://sarvadnyainfotech.com https://www.sarvadnyainfotech.com https://*.vercel-insights.com https://*.zohopublic.in wss://*.zohopublic.in https://*.zohocdn.com https://sc.lfeeder.com`,
  `frame-src 'self' https://www.google.com https://salesiq.zohopublic.in`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join('; ');

const nextConfig = {
  // CHANGE: 2026-08-21 — Single worker for page-data collection/type steps: this machine has 7.5GB RAM
  // (~1.3GB free) and parallel jest-workers were dying mid-build ("Cannot find module for page" ENOENT).
  experimental: {
    cpus: 1,
  },

  allowedDevOrigins: ['26.186.62.193','192.168.7.7','192.168.1.245'],
  async redirects() {
    return [
      {
        source: '/cloud/nosky',
        destination: '/cloud/backup-for-tally',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        source: '/:path((?:.+)\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|woff2?))$',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },
  
};

module.exports = nextConfig;
