import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { jobs as staticJobs } from '@/lib/jobs';
import { PUBLIC_API_CACHE } from '@/lib/api-cache';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('careers');
    
    let jobs = await collection.find({ visible: { $ne: false } }).sort({ postedAt: -1 }).toArray();
    
    if (jobs.length === 0) {
      await collection.insertMany(staticJobs.map(job => ({ ...job, _id: new ObjectId() })));
      jobs = await collection.find({ visible: { $ne: false } }).sort({ postedAt: -1 }).toArray();
    }
    
    // CHANGE: 2026-11-20 — public visible-jobs list; Edge-cached. The seed-on-empty write runs
    // before the response is built, so a cached response always contains the seeded set.
    return NextResponse.json(jobs, { headers: { 'Cache-Control': PUBLIC_API_CACHE } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
