import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/mongodb-utils';
import { staticReviews } from '@/lib/reviews';
import clientPromise from '@/lib/mongodb';
import { PUBLIC_API_CACHE } from '@/lib/api-cache';

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
    
    // CHANGE: 2026-11-20 — public review wall; Edge-cached. The seed-on-empty write above runs
    // before the response is built, so a cached response always contains the seeded set.
    return NextResponse.json(reviews, { headers: { 'Cache-Control': PUBLIC_API_CACHE } });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
