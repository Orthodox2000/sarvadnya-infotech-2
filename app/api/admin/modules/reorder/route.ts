import { NextResponse } from 'next/server';
import { reorderModules } from '@/lib/mongodb-utils';

export async function POST(request: Request) {
  try {
    const { orders } = await request.json();
    if (!Array.isArray(orders)) {
      return NextResponse.json({ error: 'Invalid orders format' }, { status: 400 });
    }
    
    await reorderModules(orders);
    return NextResponse.json({ message: 'Modules reordered successfully' });
  } catch (error) {
    console.error('Error reordering modules:', error);
    return NextResponse.json({ error: 'Failed to reorder modules' }, { status: 500 });
  }
}
