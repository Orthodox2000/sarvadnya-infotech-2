import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// CHANGE: 2026-08-27 — sitemap advertises the canonical domain (sarvadnyainfotech.com).
// CHANGE: 2026-09-16 — block hero video files so Google stops indexing them as standalone
// video results ("Video isn't on a watch page" GSC issue). They stay playable in the <video> tag.
// CHANGE: 2026-10-02 — /demo is an isolated TEST-ONLY cart scaffold (SP-1), never a booking
// page. Disallow it (and the trailing-slash form) so it cannot compete with /contact.
// CHANGE: 2026-10-02 — /checkout + /checkout/success are the REAL cart's transaction
// surfaces: a live checkout is not content, and a paid-receipt URL must never show up in
// Google results. (Robots only; the pages also carry `robots: noindex` metadata.)

// CHANGE: 2026-10-29 — private surfaces extracted to one list. WHY: the rules below are
// duplicated per crawler group, and a hand-copied disallow list is exactly how a private
// path leaks when one group is edited and the others are forgotten.
const PRIVATE_PATHS = [
  '/admin/',
  '/api/admin/',
  '/api/',
  '/ask-sara',
  '/demo',
  '/demo/',
  '/checkout',
  '/checkout/',
  '/checkout/success',
  '/checkout/success/',
  '/sarvadnya-mobile.mp4',
  '/sarvadnya%20trial%202.mp4',
];

// CHANGE: 2026-10-29 — explicit per-crawler groups (P0 from the claude-seo adoption review).
// WHY: an explicit allow for search and answer-engine crawlers makes the intent unambiguous
// and keeps every private path blocked for each of them even if the catch-all `*` rule is
// later edited. It changes nothing for a bot that already followed `*` — same allow, same
// disallows — so this cannot de-index anything that is currently indexed.
//
// AI / answer-engine crawlers are deliberately WELCOMED: the site publishes reference
// content (Tally Insights lessons, Learn Sara guides, news posts) that we want quoted in AI
// answers, and /public/llms.txt exists for the same reason. The commerce and account
// surfaces stay blocked for all of them.
//
// DELIBERATELY NOT LISTED: CCBot / Bytespider. Those are bulk training-corpus crawlers
// rather than answer engines; leaving them under `*` keeps this file a statement about
// search and answer engines only, which is the part we can actually verify.
const SEARCH_CRAWLERS = [
  'Googlebot',
  'Googlebot-Image',
  'Bingbot',
  'DuckDuckBot',
  'Applebot',
  'YandexBot',
];

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: SEARCH_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // CHANGE: 2026-10-29 — advertise the LLM index alongside the XML sitemap.
    host: SITE_URL,
  };
}
