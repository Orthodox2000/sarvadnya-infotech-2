import { NextResponse } from 'next/server';
import { getModules, getTutorials, getNews, getPartners, getSettings } from '@/lib/mongodb-utils';
import { findSemanticResults } from '@/lib/search-indexer';

const AI_TIMEOUT = 10_000;
const SUMMARY_CACHE_TTL = 300_000;

const aiCache = new Map<string, { data: any; ts: number }>();

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }) {
  const { timeout = AI_TIMEOUT, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function getCachedOrFetch<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = aiCache.get(key);
  if (cached && Date.now() - cached.ts < ttl) {
    return Promise.resolve(cached.data as T);
  }
  return fetcher().then(data => {
    aiCache.set(key, { data, ts: Date.now() });
    return data;
  });
}

async function getAIRecommendations(query: string, siteMap: any[]) {
  try {
    const settings = await getSettings();
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);
    if (apiKeys.length === 0) return [];

    const apiKey = apiKeys[0];
    const cacheKey = `ai-rec-${query.toLowerCase().trim()}`;

    return getCachedOrFetch(cacheKey, SUMMARY_CACHE_TTL, async () => {
      const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are a search recommender. Given a query and available links, return the 2-3 most relevant results.
              JSON ONLY: [{"title": string, "description": string, "url": string, "type": "AI Recommend", "icon": "M13 10V3L4 14h7v7l9-11h-7z"}]
              AVAILABLE: ${siteMap.map(p => `${p.title}: ${p.url}`).join(' | ')}`
            },
            { role: "user", content: `Recommend for: "${query}"` }
          ],
          temperature: 0.1,
          max_tokens: 300,
          response_format: { type: "json_object" }
        }),
        timeout: 8_000
      });

      const data = await response.json();
      if (data.choices?.[0]) {
        const parsed = JSON.parse(data.choices[0].message.content);
        return Array.isArray(parsed) ? parsed : (parsed.recommendations || []);
      }
      return [];
    });
  } catch (err) {
    console.error('AI Search Error:', err);
    return [];
  }
}

async function generateSearchSummary(query: string, results: any[]) {
  if (results.length === 0) return null;

  try {
    const settings = await getSettings();
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);
    if (apiKeys.length === 0) return null;

    const apiKey = apiKeys[0];
    const cacheKey = `ai-sum-${query.toLowerCase().trim()}`;

    return getCachedOrFetch(cacheKey, SUMMARY_CACHE_TTL, async () => {
      const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `Summarize how these results answer: "${query}". Max 3 sentences.
              Use [[Button Label|/url]] for relevant links.`
            },
            { role: "user", content: `Results: ${results.map(r => `${r.title}: ${r.url}`).join(' | ')}` }
          ],
          temperature: 0.3,
          max_tokens: 250
        }),
        timeout: 8_000
      });

      const data = await response.json();
      if (data.choices?.[0]) {
        return data.choices[0].message.content.trim();
      }
      return null;
    });
  } catch (err) {
    console.error('AI Summary Error:', err);
    return null;
  }
}

const STATIC_PAGES = [
  { title: 'Ask Sara (AI Assistant)', description: 'Instant help with Tally features, modules, and hosting.', url: '#ask-sara', type: 'AI Assistant', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Products & Editions', description: 'TallyPrime Silver, Gold, and Server editions.', url: '/products', type: 'Page' },
  { title: 'TallyPrime Silver', description: 'Single-user TallyPrime edition for owner-managed companies.', url: '/products/silver', type: 'Page' },
  { title: 'TallyPrime Gold', description: 'Multi-user TallyPrime edition for growing teams.', url: '/products/gold', type: 'Page' },
  { title: 'TallyPrime Server', description: 'Enterprise TallyPrime edition for shared access and stronger control.', url: '/products/server', type: 'Page' },
  { title: 'Cloud Solutions', description: 'TallyPrime Cloud Access and AWS solutions.', url: '/cloud', type: 'Page' },
  { title: 'About Us', description: 'Certified Tally Partner since 2008.', url: '/about', type: 'Page' },
  { title: 'Contact Support', description: 'Get priority support and technical help.', url: '/contact', type: 'Page' },
  { title: 'Careers', description: 'Join our team at Sarvadnya Infotech.', url: '/careers', type: 'Page' },
  { title: 'Annual Maintenance Contract (AMC)', url: '/services/amc', description: 'Professional Tally AMC services.', type: 'Page' },
  { title: 'Corporate Training', description: 'Professional Tally training for your staff.', url: '/services/corporate-training', type: 'Page' },
  { title: 'Mobile App (BizAnalyst)', url: '/services/mobile-app-biz', description: 'Access Tally data on your mobile.', type: 'Page' },
  { title: 'Tally on WhatsApp', url: '/services/tally-on-whatsapp', description: 'Send invoices and reports via WhatsApp.', type: 'Page' },
  { title: 'Tally Customization (TDL)', url: '/services/tdl', description: 'Custom Tally features for your business.', type: 'Page' },
  { title: 'Tally Software Services (TSS)', url: '/services/tss', description: 'Renew TSS for updates and remote access.', type: 'Page' },
];

const SITE_MAP = [
  ...STATIC_PAGES,
  { title: 'TallyDrive', url: '/products#tallydrive', description: 'Encrypted cloud backup for TallyPrime.' },
  { title: 'AMC Services', url: '/services/amc', description: 'Professional Tally AMC services for peace of mind.' },
  { title: 'Corporate Training', url: '/services/corporate-training', description: 'Professional Tally training for your staff.' },
  { title: 'Tally on Mobile', url: '/services/mobile-app-biz', description: 'Access Tally data on your mobile with BizAnalyst.' },
  { title: 'Tally to WhatsApp', url: '/services/tally-on-whatsapp', description: 'Send Tally invoices and reports via WhatsApp.' },
  { title: 'TDL Customization', url: '/services/tdl', description: 'Custom Tally features tailored to your business.' },
  { title: 'TSS Renewal', url: '/services/tss', description: 'Renew TSS for latest updates and remote access.' },
  { title: 'Learning Hub', url: '/tutorials', description: 'Video guides and technical documentation.' },
  { title: 'Modules Gallery', url: '/modules', description: 'Browse specialized TallyPrime add-on modules.' },
  { title: 'Latest News', url: '/news', description: 'Company updates and Tally industry news.' },
  { title: 'Feature Capabilities', url: '/capabilities', description: 'Explore all TallyPrime business capabilities.' },
];

function matchStaticPages(query: string) {
  const q = query.toLowerCase();
  return STATIC_PAGES.filter(p =>
    p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) ||
    (p.type === 'AI Assistant' && ['ai', 'chat', 'sara', 'ask'].some(k => q.includes(k)))
  ).map(p => ({
    ...p,
    icon: p.icon || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }));
}

function deduplicate(items: any[]) {
  const seen = new Set();
  return items.filter(item => {
    const dup = seen.has(item.title);
    seen.add(item.title);
    return !dup;
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], summary: null });
    }

    // 1. Semantic results (instant, no DB)
    const semanticResults = findSemanticResults(query);

    // 2. Static page matching (instant, no DB)
    const staticMatches = matchStaticPages(query);

    // 3. DB results (parallel fetch)
    const [modules, tutorials, news] = await Promise.all([
      getModules(),
      getTutorials(),
      getNews()
    ]);

    const dbResults: any[] = [];

    modules.forEach((m: any) => {
      const moduleId = m.id || m._id;
      const moduleUrl = `/modules?id=${moduleId}`;
      if (m.title?.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)) {
        dbResults.push({
          title: m.title, description: m.description, url: moduleUrl, type: 'Module',
          icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
        });
      }
    });

    tutorials.forEach((t: any) => {
      if (t.title?.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query)) {
        dbResults.push({
          title: t.title, description: t.description, url: '/tutorials', type: 'Tutorial',
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        });
      }
    });

    news.forEach((n: any) => {
      if (n.title?.toLowerCase().includes(query) || n.content?.toLowerCase().includes(query)) {
        dbResults.push({
          title: n.title, description: n.content?.substring(0, 100) + '...', url: '/news', type: 'News',
          icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
        });
      }
    });

    // 4. Merge all results
    let combined = deduplicate([...semanticResults, ...staticMatches, ...dbResults]);

    // 5. AI fallback only when very few results
    if (combined.length < 2) {
      const aiRecs = await getAIRecommendations(query, SITE_MAP);
      combined = deduplicate([...combined, ...aiRecs]);
    }

    // 6. AI summary (only for queries with results, cached 5 min)
    const summary = combined.length > 0
      ? await generateSearchSummary(query, combined.slice(0, 3))
      : null;

    return NextResponse.json({
      results: combined.slice(0, 10),
      summary
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
