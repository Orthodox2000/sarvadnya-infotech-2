import { NextResponse } from 'next/server';
import { getTutorials } from '@/lib/mongodb-utils';

// CHANGE: 2026-08-26 — Write methods removed for frontend-only deployment.
// Admin deployment handles tutorial CRUD via /api/admin/ copy.

export async function GET() {
  try {
    const tutorials = await getTutorials();
    // CHANGE: 2026-11-21 — no CDN cache (was PUBLIC_API_CACHE, s-maxage=3600).
    // The learning feed is edited by the admin panel and must reflect a new
    // video on the NEXT page load; a 1-hour edge cache made freshly-added
    // tutorials look like they "never appeared on the frontend". 7 docs — the
    // extra Mongo read is negligible. next.config.js allowlist entry removed
    // too, so the global /api no-store rule is the final word.
    return NextResponse.json(tutorials, { headers: { 'Cache-Control': 'no-store' } });
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
