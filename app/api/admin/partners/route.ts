import { NextResponse } from 'next/server';
import { getPartners, addPartner, updatePartner, deletePartner } from '@/lib/mongodb-utils';
import { staticPartners } from '@/lib/partners';
import clientPromise from '@/lib/mongodb';
import { revalidateTag, revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function flushCache() {
  revalidateTag('partners', 'default');
  revalidatePath('/', 'layout');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    let partners = await getPartners(type);
    
    // Seed only for brand type if empty
    if (partners.length === 0 && (!type || type === 'brand')) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('partners');
      // Omit _id from static partners when seeding to allow MongoDB to generate them
      const partnersToInsert = staticPartners.map(({ _id, ...p }) => ({ 
        ...p,
        type: 'brand', 
        createdAt: new Date() 
      }));
      await collection.insertMany(partnersToInsert as any);
      
      // Invalidate cache and fetch fresh
      revalidateTag('partners', 'default');
      partners = await collection.find(type ? { type } : {}).sort({ createdAt: 1 }).toArray() as any;
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
    const result = await addPartner({
      ...data,
      type: data.type || 'brand'
    });
    await flushCache();
    return NextResponse.json({ message: 'Partner added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding partner:', error);
    return NextResponse.json({ error: 'Failed to add partner' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await updatePartner(id, updateData);
    await flushCache();
    return NextResponse.json({ message: 'Asset updated successfully' });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
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
    await flushCache();
    return NextResponse.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
