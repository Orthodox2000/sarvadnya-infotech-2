import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sarvadnya-infotech.vercel.app'; // Replace with actual production domain

  const routes = [
    '',
    '/about',
    '/capabilities',
    '/careers',
    '/cloud',
    '/contact',
    '/modules',
    '/news',
    '/privacy',
    '/products',
    '/search',
    '/services',
    '/services/amc',
    '/services/corporate-training',
    '/services/mobile-app-biz',
    '/services/tally-on-whatsapp',
    '/services/tdl',
    '/services/tss',
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
