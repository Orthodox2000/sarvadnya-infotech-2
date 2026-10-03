import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { visible } = await req.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('careers');
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { visible: !!visible, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating visibility:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
