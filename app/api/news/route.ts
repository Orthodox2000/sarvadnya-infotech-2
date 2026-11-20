import { NextResponse } from 'next/server';
import { getNews } from '@/lib/mongodb-utils';
import { PUBLIC_API_CACHE } from '@/lib/api-cache';

// CHANGE: 2026-11-20 — public read-only list; cached at the Edge so bot/repeat hits cost 0 Active CPU.
export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news, { headers: { 'Cache-Control': PUBLIC_API_CACHE } });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
