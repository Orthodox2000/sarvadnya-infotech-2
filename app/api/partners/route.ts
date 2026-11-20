import { NextResponse } from 'next/server';
import { getPartners } from '@/lib/mongodb-utils';
import { PUBLIC_API_CACHE } from '@/lib/api-cache';

// CHANGE: 2026-11-20 — force-dynamic removed: it cannot override an explicit CDN Cache-Control
// header on a route handler, and the ?type= value is part of the CDN cache key.


// CHANGE: 2026-08-26 — Simplified: brand-type reconcile/ordering now lives in getPartners()
// (lib/mongodb-utils.ts), so this route just forwards. Old inline seeding removed.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const partners = await getPartners(type);
    return NextResponse.json(partners, { headers: { 'Cache-Control': PUBLIC_API_CACHE } });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}