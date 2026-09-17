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
      // CHANGE: 2026-09-16 — legacy-WordPress URLs that still get crawled: 301 to their live
      // equivalent so link equity consolidates and GSC "not indexed" rows clear.
      { source: '/tally-erp-9-single-multi-user-license', destination: '/products/silver', permanent: true },
      { source: '/tally-prime', destination: '/products', permanent: true },
      { source: '/tally-prime-product', destination: '/products', permanent: true },
      { source: '/tally-product-2', destination: '/products', permanent: true },
      { source: '/upgrade-of-tally-erp-9-products', destination: '/services/tss', permanent: true },
      { source: '/housing-societies-2', destination: '/modules', permanent: true },
      { source: '/erp-consulting-services-3', destination: '/capabilities', permanent: true },
      { source: '/customized-ready-modules-for-specific-business-lines', destination: '/modules', permanent: true },
      { source: '/tally-software-implementation-service', destination: '/services', permanent: true },
      // CHANGE: 2026-09-17 — old WP blog post "Small Add-ons in Tally ERP 9" → its modern
      // news article (same topic, live seeded slug) so the GSC 404 row clears and equity passes.
      { source: '/small-add-ons-in-tally-erp-9', destination: '/news/tally-erp9-add-ons', permanent: true },
      // CHANGE: 2026-09-17 — full legacy-WP audit (scripts/audit-legacy-wp.mjs): 29 real user-facing
      // old pages 301 to their closest live equivalent so link equity consolidates and no old
      // URL can 404 again. `` covers the trailing-slash variant Googlebot crawls directly.
      { source: '/home-tally-partner', destination: '/', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/refund-and-cancellation-policy', destination: '/terms', permanent: true },
      { source: '/blog', destination: '/news', permanent: true },
      { source: '/tally-prime-services', destination: '/services', permanent: true },
      { source: '/erp-consulting-services', destination: '/capabilities', permanent: true },
      { source: '/tally-cloud-services', destination: '/cloud', permanent: true },
      { source: '/tally-product-3', destination: '/products', permanent: true },
      { source: '/tally-software-service-tss-2', destination: '/services/tss', permanent: true },
      { source: '/tally-ass-annual-software-services-2', destination: '/services/tss', permanent: true },
      { source: '/tally-server-9-2', destination: '/products/server', permanent: true },
      { source: '/corporate-training-2', destination: '/services/corporate-training', permanent: true },
      { source: '/offline-seminars-2', destination: '/services/corporate-training', permanent: true },
      { source: '/online-webinars-2', destination: '/services/corporate-training', permanent: true },
      { source: '/customization-services-2', destination: '/services/tdl', permanent: true },
      { source: '/customized-modules', destination: '/modules', permanent: true },
      { source: '/agent-broker-commission-rd-module', destination: '/modules', permanent: true },
      { source: '/clearing-and-forwarding-agencies-cfa', destination: '/modules', permanent: true },
      { source: '/footwear-distribution-retail-sales-manufacturing-industries', destination: '/modules', permanent: true },
      { source: '/garment-wholesale-2', destination: '/modules', permanent: true },
      { source: '/share-investment-business', destination: '/modules', permanent: true },
      { source: '/attach-and-manage-documents-2', destination: '/addons', permanent: true },
      { source: '/digitally-signed-tally-invoice-2', destination: '/addons', permanent: true },
      { source: '/lock-gst-returns-in-tally', destination: '/addons', permanent: true },
      { source: '/understanding-client-erp-requirements', destination: '/services', permanent: true },
      { source: '/offering-right-solution-onlinehelping-in-implementation-of-offered-erp', destination: '/services', permanent: true },
      { source: '/ensure-quality-training-and-service-thereafter-increase-client-satisfaction', destination: '/services', permanent: true },
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
      // CHANGE: 2026-09-16 — X-Robots-Tag noindex on video files so Google drops the raw
      // .mp4 URLs from the index (hero background videos are decorative, not a "watch page").
      {
        source: '/:path((?:.+)\\.(?:mp4|webm|mov|ogv|m4v))$',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
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
