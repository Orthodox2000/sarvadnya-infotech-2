import { NextResponse } from 'next/server';
import { getTutorials, addTutorial, updateTutorial, deleteTutorial } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const tutorials = await getTutorials();
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await addTutorial(data);
    return NextResponse.json({ message: 'Tutorial added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding tutorial:', error);
    return NextResponse.json({ error: 'Failed to add tutorial' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await updateTutorial(id, data);
    return NextResponse.json({ message: 'Tutorial updated successfully' });
  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json({ error: 'Failed to update tutorial' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await deleteTutorial(id);
    return NextResponse.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ error: 'Failed to delete tutorial' }, { status: 500 });
  }
}
