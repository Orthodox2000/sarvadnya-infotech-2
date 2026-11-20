import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { jobs as staticJobs } from '@/lib/jobs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('careers');
    
    // CHANGE: 2026-11-20 — was find({}), which leaked hidden (visible:false) draft jobs to any
    // unauthenticated caller. Same filter as /api/careers/list and /api/careers/visible; applied
    // to BOTH the pre-seed and post-seed queries so a re-seed cannot surface drafts either.
    let jobs = await collection.find({ visible: { $ne: false } }).sort({ postedAt: -1 }).toArray();

    // Seed if empty
    if (jobs.length === 0) {
      await collection.insertMany(staticJobs.map(job => ({ ...job, _id: new ObjectId() })));
      jobs = await collection.find({ visible: { $ne: false } }).sort({ postedAt: -1 }).toArray();
    }
    
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
