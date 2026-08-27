import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/mongodb-utils';
import { staticReviews } from '@/lib/reviews';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    let reviews = await getReviews();
    
    // Seed if empty
    if (reviews.length === 0) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('reviews');
      await collection.insertMany(staticReviews.map(({ id, _id, ...r }) => ({ ...r, createdAt: new Date() })));
      reviews = await getReviews();
    }
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
