import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { newsItems as staticNews } from '@/lib/news';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('news');
    
    let news = await collection.find({}).sort({ _id: -1 }).toArray();
    
    // Seed if empty
    if (news.length === 0) {
      await collection.insertMany(staticNews.map(item => ({ ...item, _id: new ObjectId() })));
      news = await collection.find({}).sort({ _id: -1 }).toArray();
    }
    
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('news');
    const data = await request.json();
    
    const { _id, ...newsData } = data;
    
    if (_id) {
      // Update
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: newsData }
      );
      return NextResponse.json({ message: 'News updated successfully' });
    } else {
      // Create
      const result = await collection.insertOne(newsData);
      return NextResponse.json({ message: 'News created successfully', id: result.insertedId });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save news' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db();
    await db.collection('news').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
