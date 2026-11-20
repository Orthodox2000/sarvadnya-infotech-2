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
    
    // CHANGE: 2026-10-06 — SP-4: was find({}) — leaked hidden (visible:false) draft jobs
    // to any unauthenticated caller. Same filter as /api/careers/visible (both queries).
    let jobs = await collection.find({ visible: { $ne: false } }).sort({ postedAt: -1 }).toArray();
    
    if (jobs.length === 0) {
      await collection.insertMany(staticJobs.map(job => ({ ...job, _id: new ObjectId() })));
      jobs = await collection.find({ visible: { $ne: false } }).sort({ postedAt: -1 }).toArray();
    }
    
    // CHANGE: 2026-11-20 — public visible-jobs list; Edge-cached. Keeps the visible:{$ne:false}
    // filter from 2026-10-06 — hidden drafts must never enter a shared cache.
    return NextResponse.json(jobs, { headers: { 'Cache-Control': PUBLIC_API_CACHE } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
