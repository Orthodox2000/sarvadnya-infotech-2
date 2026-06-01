import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/mongodb-utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const settings = await getSettings();
    const rawKeys = settings.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
    const apiKeys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'Groq API Keys not configured' }, { status: 500 });
    }

    // Try with the first key (can be improved with rotation if needed)
    const apiKey = apiKeys[0];

    const groqFormData = new FormData();
    groqFormData.append('file', audioFile, 'audio.wav');
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('response_format', 'verbose_json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: groqFormData
    });

    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({ text: data.text });
    }

    console.error('Groq Transcription Error:', data);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });

  } catch (error) {
    console.error('Transcription API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
