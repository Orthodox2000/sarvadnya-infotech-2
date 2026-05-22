import { NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/mongodb-utils';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    if (!section) {
      return NextResponse.json({ error: 'Section required' }, { status: 400 });
    }

    const content = await getContent(section);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { section, content } = await request.json();
    
    if (!section || !content) {
      return NextResponse.json({ error: 'Section and content required' }, { status: 400 });
    }

    await updateContent(section, content);
    revalidateTag('content', 'default');
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
