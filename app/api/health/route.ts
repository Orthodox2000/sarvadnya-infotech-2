import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const status: any = {
    status: 'ok',
    mongodb: 'disconnected',
    timestamp: new Date().toISOString(),
    version: 'v1.1.251'
  };

  try {
    // Check MongoDB connection
    const client = await clientPromise;
    const db = client.db();
    await db.command({ ping: 1 });
    status.mongodb = 'connected';
  } catch (error) {
    console.error('MongoDB Health check failed:', error);
    status.status = 'error';
    status.mongodb_error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(status, { status: status.status === 'ok' ? 200 : 500 });
}
