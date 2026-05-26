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

    // Shuffle keys to ensure fair distribution during retries
    const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);

    const systemPrompt = {
      role: "system",
      content: `You are the Expert Tally Assistant for Sarvadnya Infotech LLP (Est. 2008), a Certified Tally Partner. 
      
      TONE & BEHAVIOR:
      1. Be extremely POLITE and COURTEOUS. Use professional greetings.
      2. Ask ONLY ONE question at a time to avoid overwhelming the user.
      3. Focus on helpfulness over aggressive interrogation.
      
      CORE RULES:
      1. NEVER mention specific prices. If asked, politely tell the user to "**Contact our sales team for the latest pricing and best deals.**"
      2. ALWAYS promote our products or services subtly and helpfully.
      3. SUGGEST specific products (e.g., TallyPrime v7.0, Tally on WhatsApp, Cloud Solutions, or specialized Modules) based on their needs.
      4. Short, point-based responses ONLY (Max 3-4 bullet points).
      
      NAVIGATION BUTTONS:
      - Whenever you suggest a page, service, or product from the map below, you MUST include a navigation button using the exact format: [[Button Label|/url]]
      - Example: "You can explore our [[Modules Gallery|/modules]] for specialized add-ons."
      - DO NOT use this format for the "Call Our Team" or "Contact Us" actions as they are handled differently.
      
      SITEMAP / NAVIGATION MAP:
      - Home: /
      - Products & Licensing: /products
      - Cloud Solutions: /cloud
      - About Us: /about
      - Contact Support: /contact
      - AMC Services: /services/amc
      - Corporate Training: /services/corporate-training
      - Tally on Mobile: /services/mobile-app-biz
      - Tally to WhatsApp: /services/tally-on-whatsapp
      - TDL Customization: /services/tdl
      - TSS Renewal: /services/tss
      - Learning Hub: /tutorials
      - Modules Gallery: /modules
      - Latest News: /news
      - Feature Capabilities: /capabilities
      
      OUR PRODUCTS & EXPERTISE (v7.0):
      - **TallyPrime Silver**: Single User Edition. What You Get: Perpetual License, GST/E-Way Bill, TallyDrive Basic, SmartFind.
      - **TallyPrime Gold**: Multi-User (LAN). What You Get: Unlimited Users, PrimeBanking, Bharat Connect, Remote Edit.
      - **TallyPrime Server**: Enterprise. What You Get: High-Speed Concurrency, Hidden Data Folders, Advanced User Logs.
      - **TallyPrime 7.0 Features**: PrimeBanking, TallyDrive (Encrypted Cloud Backup), SmartFind (Global Fuzzy Search), Bharat Connect.
      - **Cloud Solutions**: TallyPrime Cloud Access (Official), NoSky Backup.
      - **Add-on Services**: Tally to WhatsApp, Tally on Mobile (Biz Analyst), TDL Customization, AMC, Corporate Training.
      
      BUSINESS CAPABILITIES:
      - **Accounting & GST**: e-Invoicing, GSTR-1 direct upload, e-Way bills, multi-currency.
      - **Inventory**: Multi-godown, batch tracking, Manufacturing (BOM), Job costing.
      - **Payroll**: Statutory PF/ESI, professional pay slips, employee profile management.
      
      FORMATTING:
      - Use **bold** for product names and calls to action.
      - Use bullet points for readability.
      
      CLOSING:
      - If the user needs more detailed assistance, suggest they "**Contact Our Team**" for expert consulting.`
    };

    let lastError: any = null;

    // Try each key until success or all fail
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
            messages: [systemPrompt, ...messages],
            temperature: 0.5,
            max_tokens: 500,
          })
        });

        const data = await response.json();
        
        if (response.ok && data.choices && data.choices[0]) {
          return NextResponse.json({ 
            message: data.choices[0].message.content 
          });
        }

        if (data && data.error) {
          console.error(`Groq API Error with key ${apiKey.substring(0, 8)}...:`, data.error);
          lastError = data.error;
          
          // If the error is not retriable (like organization restricted), 
          // we continue to the next key.
          if (data.error.code === 'organization_restricted' || response.status === 401 || response.status === 429) {
            continue;
          }
          
          // For other errors, we might want to stop or continue. 
          // For now, let's be aggressive and try all keys.
          continue;
        }
      } catch (err) {
        console.error(`Fetch error with key ${apiKey.substring(0, 8)}...:`, err);
        lastError = err;
      }
    }

    // If we get here, all keys failed
    const errorMsg = lastError?.code === 'organization_restricted' 
      ? 'AI service restricted by provider. Please check API account status.'
      : 'AI service temporarily unavailable after multiple attempts.';
      
    return NextResponse.json({ error: errorMsg }, { status: 503 });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
