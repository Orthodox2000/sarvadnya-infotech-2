import { NextResponse } from 'next/server';
import { getModules, getTutorials, getNews, getPartners, getSettings } from '@/lib/mongodb-utils';
import { findSemanticResults } from '@/lib/search-indexer';

async function getAIRecommendations(query: string, siteMap: any[]) {
  try {
    const settings = await getSettings();
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) return [];

    const apiKey = apiKeys[0]; // Use first key for speed
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a search recommendation engine for Sarvadnya Infotech. 
            Given a user query and a list of available site pages/modules, recommend the 2-3 most relevant internal links.
            
            AVAILABLE LINKS:
            ${siteMap.map(p => `- ${p.title}: ${p.url} (${p.description})`).join('\n')}
            
            JSON OUTPUT ONLY:
            Return an array of objects: [{"title": string, "description": string, "url": string, "type": "AI Recommend", "icon": "M13 10V3L4 14h7v7l9-11h-7z"}]`
          },
          { role: "user", content: `Recommend links for query: "${query}"` }
        ],
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const parsed = JSON.parse(data.choices[0].message.content);
      return Array.isArray(parsed) ? parsed : (parsed.recommendations || []);
    }
  } catch (err) {
    console.error('AI Search Error:', err);
  }
  return [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // 1. Get high-relevance semantic results first (instant)
    const semanticResults = findSemanticResults(query);

    // 2. Fetch all searchable data in parallel for deeper matching
    const [modules, tutorials, news, partners] = await Promise.all([
      getModules(),
      getTutorials(),
      getNews(),
      getPartners()
    ]);

    const dbResults: any[] = [];
    const siteMap: any[] = [
        { title: 'Products & Editions', url: '/products', description: 'TallyPrime Silver, Gold, and Server editions.' },
        { title: 'Cloud Solutions', url: '/cloud', description: 'TallyPrime Cloud Access and AWS solutions.' },
        { title: 'About Us', url: '/about', description: 'Certified Tally Partner since 2008.' },
        { title: 'Contact Support', url: '/contact', description: 'Get priority support and technical help.' },
        { title: 'Careers', url: '/careers', description: 'Join our team at Sarvadnya Infotech.' },
        { title: 'Corporate Training', url: '/services/corporate-training', description: 'Professional Tally training for your staff.' },
        { title: 'Learning Hub', url: '/tutorials', description: 'Video guides and technical documentation.' }
    ];

    // Search Modules
    modules.forEach((m: any) => {
      siteMap.push({ title: m.title, url: '/modules', description: m.description });
      if (m.title?.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)) {
        dbResults.push({
          title: m.title,
          description: m.description,
          url: `/modules`,
          type: 'Module',
          icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
        });
      }
    });

    // Search Tutorials
    tutorials.forEach((t: any) => {
      if (t.title?.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query)) {
        dbResults.push({
          title: t.title,
          description: t.description,
          url: '/tutorials',
          type: 'Tutorial',
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        });
      }
    });

    // Search News
    news.forEach((n: any) => {
      if (n.title?.toLowerCase().includes(query) || n.content?.toLowerCase().includes(query)) {
        dbResults.push({
          title: n.title,
          description: n.content?.substring(0, 100) + '...',
          url: '/news',
          type: 'News',
          icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
        });
      }
    });

    // Static Pages
    const staticPages = [
      { title: 'Products & Editions', description: 'TallyPrime Silver, Gold, and Server editions.', url: '/products', type: 'Page' },
      { title: 'Cloud Solutions', description: 'TallyPrime Cloud Access and AWS solutions.', url: '/cloud', type: 'Page' },
      { title: 'About Us', description: 'Certified Tally Partner since 2008.', url: '/about', type: 'Page' },
      { title: 'Contact Support', description: 'Get priority support and technical help.', url: '/contact', type: 'Page' },
      { title: 'Careers', description: 'Join our team at Sarvadnya Infotech.', url: '/careers', type: 'Page' },
      { title: 'Corporate Training', description: 'Professional Tally training for your staff.', url: '/services/corporate-training', type: 'Page' },
    ];

    staticPages.forEach(p => {
      if (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        dbResults.push({
          ...p,
          icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        });
      }
    });

    // 3. Merge and deduplicate
    let combined = [...semanticResults, ...dbResults];
    
    // 4. AI Recommendation Fallback (if few results found)
    if (combined.length < 3) {
      const aiRecs = await getAIRecommendations(query, siteMap);
      combined = [...combined, ...aiRecs];
    }

    const seen = new Set();
    const uniqueResults = combined.filter(item => {
      const duplicate = seen.has(item.title);
      seen.add(item.title);
      return !duplicate;
    });

    return NextResponse.json(uniqueResults.slice(0, 10));

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

