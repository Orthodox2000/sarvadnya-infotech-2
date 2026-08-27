import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { jobs as staticJobs } from '@/lib/jobs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('careers');
    
    let jobs = await collection.find({}).sort({ postedAt: -1 }).toArray();
    
    // Seed if empty
    if (jobs.length === 0) {
      await collection.insertMany(staticJobs.map(job => ({ ...job, _id: new ObjectId() })));
      jobs = await collection.find({}).sort({ postedAt: -1 }).toArray();
    }
    
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
