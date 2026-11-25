import { NextResponse } from 'next/server';
import { getTutorials } from '@/lib/mongodb-utils';
import { PUBLIC_TUTORIALS_API_CACHE } from '@/lib/api-cache';

// CHANGE: 2026-08-26 — Write methods removed for frontend-only deployment.
// Admin deployment handles tutorial CRUD via /api/admin/ copy.
//
// CHANGE: 2026-11-25 — CPU mitigation. Vercel's 7-day Fluid report showed 23 invocations
// and 3.4 s Active CPU here with a 0% CDN hit rate (the only public read API with no cache).
// Two changes: a 6-hour edge cache (owner confirmed no content updates for several weeks,
// so freshness is no longer the constraint) and a warm-instance memory cache of the same
// length so repeat uncached edge misses do not re-read Mongo. Restore 300 s / 5 min when
// frequent admin edits resume (see the 2026-11-21 "video looked absent" incident).
const MEMORY_TTL_MS = 6 * 60 * 60 * 1000;
let memoryCache: { data: unknown; at: number } | null = null;

export async function GET() {
  try {
    let tutorials = memoryCache?.data;
    if (!tutorials || !memoryCache || Date.now() - memoryCache.at >= MEMORY_TTL_MS) {
      tutorials = await getTutorials();
      memoryCache = { data: tutorials, at: Date.now() };
    }
    return NextResponse.json(tutorials, {
      headers: { 'Cache-Control': PUBLIC_TUTORIALS_API_CACHE },
    });
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}

// COMMENTED OUT: POST, PUT, DELETE — writes not needed on frontend deployment.
// Admin deployment uses these routes directly from app/api/admin/ copy.
// To restore: uncomment below and add `addTutorial, updateTutorial, deleteTutorial` back to the import above.
//
// import { addTutorial, updateTutorial, deleteTutorial } from '@/lib/mongodb-utils';
//
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     const result = await addTutorial(data);
//     return NextResponse.json({ message: 'Tutorial added successfully', id: result.insertedId });
//   } catch (error) {
//     console.error('Error adding tutorial:', error);
//     return NextResponse.json({ error: 'Failed to add tutorial' }, { status: 500 });
//   }
// }
//
// export async function PUT(request: Request) {
//   try {
//     const { id, ...data } = await request.json();
//     if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
//     
//     await updateTutorial(id, data);
//     return NextResponse.json({ message: 'Tutorial updated successfully' });
//   } catch (error) {
//     console.error('Error updating tutorial:', error);
//     return NextResponse.json({ error: 'Failed to update tutorial' }, { status: 500 });
//   }
// }
//
// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
//
//     await deleteTutorial(id);
//     return NextResponse.json({ message: 'Tutorial deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting tutorial:', error);
//     return NextResponse.json({ error: 'Failed to delete tutorial' }, { status: 500 });
//   }
// }
