import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getNews } from '@/lib/mongodb-utils';
import { parseDateIso } from '@/lib/news-utils';

// CHANGE: 2026-08-27 — baseUrl now sourced from central lib/seo.ts (new canonical domain).
// CHANGE: 2026-08-31 — Sitemap now appends every /news/[slug] article (newest-aware lastModified)
// so each blog article is independently crawlable/indexable. DB failures degrade to the static list.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const news = await getNews();
    articleEntries = news
      .filter((n) => n.slug)
      .map((n) => {
        const iso = parseDateIso((n as any).dateIso || n.date);
        return {
          url: `${baseUrl}/news/${n.slug}`,
          lastModified: iso ? new Date(iso) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
  } catch (e) {
    console.error('Sitemap: failed to fetch news, static list only', e);
  }

  return [...staticEntries, ...articleEntries];
}
