import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// CHANGE: 2026-08-27 — baseUrl now sourced from central lib/seo.ts (new canonical domain).
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const routes = [
    '',
    '/about',
    '/addons',
    '/capabilities',
    '/careers',
    '/cloud',
    '/cloud/aws',
    '/cloud/windows',
    '/cloud/backup-for-tally',
    '/cloud/tallycloudaccess',
    '/contact',
    '/demo',
    '/do-more',
    '/eula',
    '/find-solution',
    '/hrms',
    '/learn-sara',
    '/modules',
    '/news',
    '/privacy',
    '/products',
    '/products/silver',
    '/products/gold',
    '/products/server',
    '/products/tallydrive',
    '/products/tallycapital',
    '/report-problem',
    '/search',
    '/services',
    '/services/amc',
    '/services/corporate-training',
    '/services/mobile-app-biz',
    '/services/tally-on-whatsapp',
    '/services/tdl',
    '/services/tss',
    '/team',
    '/terms',
    '/tutorials',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
