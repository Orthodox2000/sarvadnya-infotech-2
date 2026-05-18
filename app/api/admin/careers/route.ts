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

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('careers');
    const data = await request.json();
    
    const { _id, ...jobData } = data;
    
    if (_id) {
      // Update
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: jobData }
      );
      return NextResponse.json({ message: 'Job updated successfully' });
    } else {
      // Create
      const result = await collection.insertOne(jobData);
      return NextResponse.json({ message: 'Job created successfully', id: result.insertedId });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save career' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db();
    await db.collection('careers').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 });
  }
}
