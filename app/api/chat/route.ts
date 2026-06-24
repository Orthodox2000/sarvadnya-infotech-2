import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/mongodb-utils';

const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";
const TIMEOUT_MS = 25_000;

const responseCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 10_000;

function cacheKey(messages: any[]): string {
  return JSON.stringify(messages.slice(-3));
}

async function callGroq(apiKey: string, messages: any[], model: string, signal: AbortSignal) {
  const systemPrompt = {
    role: "system",
    content: `You are Sara (Sarvadnya Assistant), the Expert Tally Assistant for Sarvadnya Infotech LLP (Est. 2008), a Certified Tally Partner.

    TONE: Be polite and courteous. Be helpful without being interrogatory. Focus on solutions.

    RULES: Never mention prices. Suggest products based on needs. Short point-based responses (max 3-4 bullets).

    NAVIGATION: Use [[Button Label|/url]] when suggesting pages.

    SITEMAP: Home:/, Products:/products, Cloud:/cloud, About:/about, Contact:/contact,
    AMC:/services/amc, Training:/services/corporate-training, Mobile:/services/mobile-app-biz,
    WhatsApp:/services/tally-on-whatsapp, TDL:/services/tdl, TSS:/services/tss,
    Tutorials:/tutorials, Modules:/modules, News:/news, Capabilities:/capabilities

    PRODUCTS: **TallyPrime Silver** (Single User), **TallyPrime Gold** (Multi-User LAN), **TallyPrime Server** (Enterprise).
    FEATURES: PrimeBanking, TallyDrive, SmartFind, Bharat Connect, e-Invoicing, GSTR-1.

    Use **bold** for product names. [[Contact Page|/contact]] for expert consulting.`
  };

  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [systemPrompt, ...messages],
      temperature: 0.5,
      max_tokens: 500,
    }),
    signal
  });
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const key = cacheKey(messages);
    const cached = responseCache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json({ message: cached.data });
    }

    const settings = await getSettings();
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'Groq API Keys not configured' }, { status: 500 });
    }

    const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);
    let lastError: any = null;

    for (const [idx, apiKey] of shuffledKeys.entries()) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const model = idx === 0 ? PRIMARY_MODEL : FALLBACK_MODEL;
        const response = await callGroq(apiKey, messages, model, controller.signal);
        clearTimeout(timer);

        const data = await response.json();

        if (response.ok && data.choices?.[0]) {
          const content = data.choices[0].message.content;
          responseCache.set(key, { data: content, ts: Date.now() });
          return NextResponse.json({ message: content });
        }

        if (data?.error) {
          console.error(`Groq Error [${apiKey.substring(0, 8)}..]:`, data.error);
          lastError = data.error;
          if ([401, 429].includes(response.status)) continue;
        }
      } catch (err: any) {
        clearTimeout(timer);
        if (err.name === 'AbortError') {
          console.error(`Groq timeout [${apiKey.substring(0, 8)}..]`);
          lastError = { code: 'timeout' };
          continue;
        }
        console.error(`Fetch error [${apiKey.substring(0, 8)}..]:`, err);
        lastError = err;
      }
    }

    const errorMsg = lastError?.code === 'organization_restricted'
      ? 'AI service restricted by provider.'
      : 'AI service temporarily unavailable. Please try again.';

    return NextResponse.json({ error: errorMsg }, { status: 503 });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
