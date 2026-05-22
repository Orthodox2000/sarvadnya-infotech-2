import { NextResponse } from 'next/server';
import { getNews, addNews, updateNews, deleteNews } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { _id, ...newsData } = data;
    
    if (_id) {
      await updateNews(_id, newsData);
      return NextResponse.json({ message: 'News updated successfully' });
    } else {
      const result = await addNews(newsData);
      return NextResponse.json({ message: 'News created successfully', id: result.insertedId });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save news' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await deleteNews(id);
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
