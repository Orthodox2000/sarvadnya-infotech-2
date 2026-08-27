import { NextResponse } from 'next/server';
import { getPartners } from '@/lib/mongodb-utils';

export const dynamic = 'force-dynamic';

// CHANGE: 2026-08-26 — Simplified: brand-type reconcile/ordering now lives in getPartners()
// (lib/mongodb-utils.ts), so this route just forwards. Old inline seeding removed.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const partners = await getPartners(type);
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}