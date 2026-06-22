import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/mongodb-utils';

const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const { answers, scores, recommendations } = await request.json();
    const settings = await getSettings();
    
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'Groq API Keys not configured' }, { status: 500 });
    }

    const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);

    const systemPrompt = {
      role: "system",
      content: `You are a Senior Strategic Business Consultant at Sarvadnya Infotech LLP (Certified Tally Partner).
      Analyze the provided business consultation data and provide a concise, professional, and highly strategic advisory insight.
      
      TONE:
      - Authoritative yet encouraging.
      - Strategic and growth-oriented.
      - Professional and elite.
      
      RULES:
      - 2-3 sentences max.
      - Do NOT use bullet points.
      - Do NOT mention pricing.
      - Focus on WHY the recommended solution fits their specific scale, industry, and challenges.
      - Use "We" as the voice of Sarvadnya Infotech LLP.
      - Output should be a single paragraph of pure text.`
    };

    const safe = (v: string | undefined, fallback = 'Not specified') => v || fallback;

    const userPrompt = {
      role: "user",
      content: `Provide a strategic insight for a business with this profile:
      - Scale: ${safe(answers.users)} 
      - Industry: ${safe(answers.industry)}
      - Current Setup: ${safe(answers.current_setup)}
      - Primary Challenge: ${safe(answers.challenge)}
      - Growth Focus: ${safe(answers.growth_focus)}
      - Efficiency Score: ${scores.efficiency}%
      - Growth Readiness: ${scores.growth}%
      - Automation Potential: ${scores.automation}
      - Risk Level: ${scores.risk}
      - Recommended Solution: ${recommendations[0]?.label}
      
      Explain why ${recommendations[0]?.label || 'the recommended solution'} fits this business based on available data.`
    };

    let lastError: any = null;

    for (const apiKey of shuffledKeys) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [systemPrompt, userPrompt],
            temperature: 0.6,
            max_tokens: 300,
          })
        });

        const data = await response.json();
        
        if (response.ok && data.choices && data.choices[0]) {
          return NextResponse.json({ 
            insight: data.choices[0].message.content 
          });
        }

        if (data && data.error) {
          lastError = data.error;
          if (data.error.code === 'organization_restricted' || response.status === 401 || response.status === 429) {
            continue;
          }
          continue;
        }
      } catch (err) {
        lastError = err;
      }
    }

    return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 503 });

  } catch (error) {
    console.error('Strategic Insight API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
