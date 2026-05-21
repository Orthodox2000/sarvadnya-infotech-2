import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/mongodb-utils';

const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const settings = await getSettings();
    
    // Support single key or comma-separated list for rotation
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'Groq API Keys not configured' }, { status: 500 });
    }

    // Simple random rotation
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const systemPrompt = {
      role: "system",
      content: `You are the Expert Tally Assistant for Sarvadnya Infotech LLP (Est. 2008). 
      
      CORE RULES:
      1. NEVER mention specific prices. If asked, tell the user to "**Contact our sales team for the latest pricing and best deals.**"
      2. ALWAYS promote our products or services in every single reply.
      3. PROACTIVELY ask questions to understand the user's business requirements.
      4. SUGGEST specific products (e.g., TallyPrime Silver/Gold, Tally on WhatsApp, Cloud Solutions, or specialized Modules) based on their needs.
      5. Short, point-based responses ONLY (Max 3-4 bullet points).
      
      OUR PRODUCTS:
      - **TallyPrime Editions**: Silver (Single User), Gold (Multi-User), Server.
      - **Cloud Solutions**: Tally on AWS/Windows Cloud, NoSky Backup.
      - **Specialized Modules**: C&F Agencies, Housing Societies, Transport, Garment, Sales & Commission.
      - **Add-on Services**: Tally to WhatsApp, Tally on Mobile (Biz Analyst), TDL Customization, AMC, Corporate Training.
      
      FORMATTING:
      - Use **bold** for product names and calls to action.
      - Use bullet points for readability.
      
      CONTACT: info@sarvadnyainfotech.com | Suggest "**Request Call**" for personalized consulting.`
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [systemPrompt, ...messages],
        temperature: 0.5, // Reduced for consistency
        max_tokens: 500,  // Reduced for brevity
      })
    });

    const data = await response.json();
    
    if (data && data.error) {
      console.error('Groq API Error:', data.error);
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 503 });
    }

    return NextResponse.json({ 
      message: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
