import { NextResponse } from 'next/server';
import { getContent } from '@/lib/mongodb-utils';
// Caching disabled

// CHANGE: 2026-08-26 — Write methods removed for frontend-only deployment.
// Admin deployment handles content writes via /api/admin/settings or direct DB.

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

// COMMENTED OUT: POST method — write not needed on frontend deployment.
// Admin deployment uses this route directly from app/api/admin/ copy.
// To restore: uncomment below and add `updateContent` back to the import above.
//
// import { updateContent } from '@/lib/mongodb-utils';
//
// export async function POST(request: Request) {
//   try {
//     const { section, content } = await request.json();
//     
//     if (!section || !content) {
//       return NextResponse.json({ error: 'Section and content required' }, { status: 400 });
//     }
//
//     await updateContent(section, content);
//     return NextResponse.json({ message: 'Content updated successfully' });
//   } catch (error) {
//     console.error('Error updating content:', error);
//     return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
//   }
// }
