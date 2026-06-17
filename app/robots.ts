import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/','terms','/privacy','/products','/cloud','/service/*'],
      disallow: ['/admin/', '/api/admin/', '/ask-sara','/products','cloud'],
    },
    sitemap: 'https://sarvdnya-infotech.vercel.app/sitemap.xml',
  };
}
