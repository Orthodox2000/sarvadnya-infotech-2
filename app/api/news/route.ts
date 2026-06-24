import { NextResponse } from 'next/server';
import { getNews } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
