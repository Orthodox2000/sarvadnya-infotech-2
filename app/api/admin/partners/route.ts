import { NextResponse } from 'next/server';
import { getPartners, addPartner, deletePartner } from '@/lib/mongodb-utils';
import { staticPartners } from '@/lib/partners';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    let partners = await getPartners();
    
    // Seed if empty
    if (partners.length === 0) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('partners');
      // Omit _id from static partners when seeding to allow MongoDB to generate them
      const partnersToInsert = staticPartners.map(({ _id, ...p }) => ({ 
        ...p, 
        createdAt: new Date() 
      }));
      await collection.insertMany(partnersToInsert as any);
      partners = await getPartners();
    }
    
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await addPartner(data);
    return NextResponse.json({ message: 'Partner added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding partner:', error);
    return NextResponse.json({ error: 'Failed to add partner' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await deletePartner(id);
    return NextResponse.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
