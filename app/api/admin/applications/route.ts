import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getApplications } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const applications = await getApplications();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('job_applications').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Admin Applications DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
