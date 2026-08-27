import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// CHANGE: 2026-08-27 — sitemap advertises the canonical domain (sarvadnyainfotech.com).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/api/', '/ask-sara'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
