import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'Groq API Key not configured' }, { status: 500 });
    }

    const systemPrompt = {
      role: "system",
      content: `You are the AI Assistant for Sarvadnya Infotech LLP, a premier Certified Tally Partner based in Pune, India. 
      Your goal is to provide expert guidance on TallyPrime and the various business solutions offered by the company.

      Key Company Info:
      - Founded: 2008.
      - Clients: 1,500+ satisfied businesses.
      - Expertise: TallyPrime Sales, Implementation, Training, and Support.
      - Specialized Services: 
        1. TDL Customization (tailored business logic).
        2. Tally on Cloud (Official AWS Hosting & Windows VM).
        3. WhatsApp Integration (Send invoices/reports directly from Tally).
        4. NoSky Backup (Ransomware-proof cloud backup for Tally).
        5. AMC (Annual Maintenance Contract) for priority support.

      Product Knowledge:
      - TallyPrime Silver: ₹18,000 + GST (Single User).
      - TallyPrime Gold: ₹54,000 + GST (Multi-User).
      - TallyPrime Server: Enterprise-grade data management.

      Tone & Style:
      - Professional, helpful, and concise.
      - Focus on business value and efficiency.
      - If you don't know an answer, suggest "Requesting a Callback" or contacting human support at info@sarvadnyainfotech.com.
      - Use "we" and "our" when referring to the company.

      Current Context: You are chatting with a visitor on the Sarvadnya Infotech website.`
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
