import { NextResponse } from 'next/server';
import { getTssRenewals, deleteTssRenewal, updateTssRenewalStatus } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const renewals = await getTssRenewals();
    return NextResponse.json({ renewals });
  } catch (error) {
    console.error('Admin TSS Renewals GET Error:', error);
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
    await deleteTssRenewal(id);
    return NextResponse.json({ message: 'Renewal request deleted' });
  } catch (error) {
    console.error('Admin TSS Renewals DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }
    await updateTssRenewalStatus(id, status);
    return NextResponse.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Admin TSS Renewals PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
