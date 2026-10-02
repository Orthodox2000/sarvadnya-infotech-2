import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// CHANGE: 2026-08-27 — sitemap advertises the canonical domain (sarvadnyainfotech.com).
// CHANGE: 2026-09-16 — block hero video files so Google stops indexing them as standalone
// video results ("Video isn't on a watch page" GSC issue). They stay playable in the <video> tag.
// CHANGE: 2026-10-02 — /demo is an isolated TEST-ONLY cart scaffold (SP-1), never a booking
// page. Disallow it (and the trailing-slash form) so it cannot compete with /contact.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/api/', '/ask-sara', '/demo', '/demo/', '/sarvadnya-mobile.mp4', '/sarvadnya%20trial%202.mp4'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
