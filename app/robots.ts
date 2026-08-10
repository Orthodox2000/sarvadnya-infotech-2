import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/api/', '/ask-sara'],
    },
    sitemap: 'https://sarvadnya-infotech.vercel.app/sitemap.xml',
  };
}
