import { NextResponse } from 'next/server';
import { getModules } from '@/lib/mongodb-utils';

// CHANGE: 2026-08-26 — Write methods removed for frontend-only deployment.
// Admin deployment handles module CRUD via /api/admin/ copy.

export async function GET() {
  try {
    const modules = await getModules();
    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

// COMMENTED OUT: POST, PUT, DELETE — writes not needed on frontend deployment.
// Admin deployment uses these routes directly from app/api/admin/ copy.
// To restore: uncomment below and add `addModule, updateModule, deleteModule` back to the import above.
//
// import { addModule, updateModule, deleteModule } from '@/lib/mongodb-utils';
//
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     const result = await addModule(data);
//     return NextResponse.json({ message: 'Module added successfully', id: result.insertedId });
//   } catch (error) {
//     console.error('Error adding module:', error);
//     return NextResponse.json({ error: 'Failed to add module' }, { status: 500 });
//   }
// }
//
// export async function PUT(request: Request) {
//   try {
//     const { id, ...data } = await request.json();
//     if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
//     
//     await updateModule(id, data);
//     return NextResponse.json({ message: 'Module updated successfully' });
//   } catch (error) {
//     console.error('Error updating module:', error);
//     return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
//   }
// }
//
// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
//
//     await deleteModule(id);
//     return NextResponse.json({ message: 'Module deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting module:', error);
//     return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
//   }
// }
