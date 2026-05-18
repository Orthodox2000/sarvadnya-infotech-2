import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const status: any = {
    status: 'ok',
    mongodb: 'disconnected',
    supabase: 'disconnected',
    timestamp: new Date().toISOString(),
    version: 'v1.1.6'
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

  try {
    // Check Supabase connection
    const { data, error } = await supabase.from('site_settings').select('key').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        // "No rows returned" is fine for a health check
        status.supabase = 'connected';
      } else if (error.code === 'PGRST205') {
        status.supabase = 'connected (table missing)';
        status.status = 'warning';
        status.supabase_error = 'Table "site_settings" not found in Supabase. Run supabase_schema.sql to fix.';
      } else {
        throw error;
      }
    } else {
      status.supabase = 'connected';
    }
  } catch (error) {
    console.error('Supabase Health check failed:', error);
    // If it's just missing table, it might still be "connected" to the service
    // But for health check we want to know if it's fully functional
    status.status = 'error';
    status.supabase_error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(status, { status: status.status === 'ok' ? 200 : 500 });
}
