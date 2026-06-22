import { NextResponse } from 'next/server';
import { deleteProblemReport, getProblemReports } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const problemReports = await getProblemReports();
    return NextResponse.json({ problemReports });
  } catch (error) {
    console.error('Admin Problem Reports GET Error:', error);
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

    await deleteProblemReport(id);
    return NextResponse.json({ message: 'Problem report deleted successfully' });
  } catch (error) {
    console.error('Admin Problem Reports DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
