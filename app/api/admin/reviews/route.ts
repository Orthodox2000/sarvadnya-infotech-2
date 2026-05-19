import { NextResponse } from 'next/server';
import { getReviews, addReview, deleteReview } from '@/lib/mongodb-utils';
import { staticReviews } from '@/lib/reviews';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    let reviews = await getReviews();
    
    // Seed if empty
    if (reviews.length === 0) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('reviews');
      await collection.insertMany(staticReviews.map(r => ({ ...r, createdAt: new Date() })));
      reviews = await getReviews();
    }
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.rating || !data.text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await addReview(data);
    return NextResponse.json({ message: 'Review added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to add review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await deleteReview(id);
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
