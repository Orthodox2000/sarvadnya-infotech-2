import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const status: any = {
    status: 'ok',
    mongodb: 'disconnected',
    timestamp: new Date().toISOString(),
    version: 'v1.1.379'
  };

  try {
    // Check MongoDB connection
    const client = await clientPromise;
    const db = client.db();
    await db.command({ ping: 1 });
    status.mongodb = 'connected';

    // Try to get version from settings
    const settingsCol = db.collection('settings');
    const versionSetting = await settingsCol.findOne({ key: 'NEXT_PUBLIC_APP_VERSION' });
    if (versionSetting?.value) {
      status.version = versionSetting.value;
    }
  } catch (error) {
    console.error('MongoDB Health check failed:', error);
    status.status = 'error';
    status.mongodb_error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(status, { status: status.status === 'ok' ? 200 : 500 });
}
