import { NextResponse } from 'next/server';
import { getSubmissions, deleteSubmission } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Admin Submissions GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteSubmission(id);
    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Admin Submissions DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
