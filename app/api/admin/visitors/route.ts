import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import {
  getCollection,
  serializeData,
  isValidObjectId,
} from '@/lib/mongodb-utils';
import { isRequestAuthorized } from '@/lib/admin-auth';
import { ensureVisitorIndexes, maskSessionId } from '@/lib/visitors';

export const runtime = 'nodejs';

const SORT_KEYS = ['lastSeen', 'firstSeen', 'visitCount', 'pageViews'] as const;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(request: Request) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  try {
    await ensureVisitorIndexes();

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || 1) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 20) || 20));
    const country = (url.searchParams.get('country') || '').trim();
    const device = (url.searchParams.get('device') || '').trim();
    const q = (url.searchParams.get('q') || '').trim();
    const rawSort = url.searchParams.get('sortBy') || 'lastSeen';
    const sortBy = (SORT_KEYS as readonly string[]).includes(rawSort) ? rawSort : 'lastSeen';
    const sortDir = url.searchParams.get('sortDir') === 'asc' ? 1 : -1;

    const filter: Record<string, unknown> = {};
    if (country && country !== 'all') filter['geo.country'] = country;
    if (device && device !== 'all') filter['device.type'] = device;
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [
        { 'geo.country': rx },
        { 'geo.city': rx },
        { 'geo.region': rx },
        { 'geo.isp': rx },
        { lastPath: rx },
        { ipMasked: rx },
      ];
    }

    const col = await getCollection('visitors');
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      total,
      visitors,
      activeToday,
      activeWeek,
      newToday,
      topCountries,
      deviceBreakdown,
    ] = await Promise.all([
      col.countDocuments(filter),
      col
        .find(filter)
        .sort({ [sortBy]: sortDir, _id: -1 } as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      col.countDocuments({ lastSeen: { $gte: dayAgo } }),
      col.countDocuments({ lastSeen: { $gte: weekAgo } }),
      col.countDocuments({ firstSeen: { $gte: startOfDay } }),
      col
        .aggregate([
          { $group: { _id: '$geo.country', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ])
        .toArray(),
      col
        .aggregate([
          { $group: { _id: '$device.type', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray(),
    ]);

    const mapped = serializeData(visitors).map((v: any) => ({
      _id: v._id,
      sessionId: maskSessionId(v.sessionId),
      firstSeen: v.firstSeen,
      lastSeen: v.lastSeen,
      visitCount: v.visitCount,
      pageViews: v.pageViews,
      entryPath: v.entryPath,
      lastPath: v.lastPath,
      referrer: v.referrer || v.lastReferrer || '',
      lastReferrer: v.lastReferrer || '',
      ip: v.ipMasked,
      geo: v.geo ?? null,
      device: v.device ?? null,
      secGpc: Boolean(v.secGpc),
      gpcRespected: Boolean(v.gpcRespected),
      paths: v.paths || [],
      sectionViews: v.sectionViews || [],
      userAgent: v.userAgent || '',
      language: v.language || '',
      screen: v.screen || '',
      lastFormAt: v.lastFormAt || null,
    }));

    return NextResponse.json({
      visitors: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta: {
        total,
        activeToday,
        activeWeek,
        newToday,
        topCountries: topCountries.map((t: any) => ({
          country: t._id || 'Unknown',
          count: t.count,
        })),
        deviceBreakdown: deviceBreakdown.map((d: any) => ({
          device: d._id || 'unknown',
          count: d.count,
        })),
      },
    });
  } catch (err) {
    console.error('Failed to fetch visitors:', err);
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  try {
    const id = new URL(request.url).searchParams.get('id') || '';
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid visitor id' }, { status: 400 });
    }
    const col = await getCollection('visitors');
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete visitor:', err);
    return NextResponse.json({ error: 'Failed to delete visitor' }, { status: 500 });
  }
}
