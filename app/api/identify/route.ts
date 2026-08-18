import { NextResponse } from 'next/server';
import {
  getRequestMeta,
  sanitizeTrackPayload,
  recordVisitor,
  lookupGeo,
  applyGeo,
  lookupReverseDns,
  applyReverseDns,
  maskIp,
  visitorLog,
} from '@/lib/visitors';

export const runtime = 'nodejs';
export const maxDuration = 10;

const RATE_LIMIT = 120;
const RATE_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetAt) {
    entry.count++;
    if (entry.count > RATE_LIMIT) return true;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }

  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }

  return false;
}

function isSameOrigin(rawUrl: string, expected: string): boolean {
  try {
    return new URL(rawUrl).origin === expected;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const meta = getRequestMeta(request);

  // 1) Rate limit (in-memory; proxy.ts applies a coarser 60/min/IP global cap).
  if (isRateLimited(meta.ip)) {
    visitorLog('warn', 'rate limited', { ip: maskIp(meta.ip) });
    return NextResponse.json({}, { status: 429, headers: { 'Retry-After': '30' } });
  }

  // 2) Security matrix — cross-site context enforcement. Only same-origin / no
  //    context beacons are accepted; foreign origins cannot flood the ledger.
  const siteOrigin = new URL(request.url).origin;
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && !['same-origin', 'none'].includes(secFetchSite)) {
    visitorLog('warn', 'blocked cross-site context', {
      site: secFetchSite,
      ip: maskIp(meta.ip),
    });
    return new Response(null, { status: 403 });
  }
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  if (
    (origin && !isSameOrigin(origin, siteOrigin)) ||
    (referer && !isSameOrigin(referer, siteOrigin))
  ) {
    visitorLog('warn', 'blocked cross-origin beacon', { ip: maskIp(meta.ip) });
    return new Response(null, { status: 403 });
  }

  // 3) Kill-switch: set VISITOR_ENABLED=0 to disable passive collection.
  if (process.env.VISITOR_ENABLED === '0') return new Response(null, { status: 204 });

  // 4) Parse + validate the beacon payload (strict UUID session id).
  const body = await request.json().catch(() => null);
  const payload = sanitizeTrackPayload(body);
  if (!payload) {
    visitorLog('warn', 'rejected invalid payload', { ip: maskIp(meta.ip) });
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  // CHANGE: 2026-08-18 — Removed respectGpc. Full IP/geo always collected.
  // 5) Session-dedup upsert. Always collect full data regardless of GPC signal.
  const { needsGeo } = await recordVisitor({
    payload,
    meta,
  });

  // 6) Geo enrichment when the session is new / geo stale.
  if (needsGeo) {
    const { geo } = await lookupGeo(meta.ip);
    await applyGeo(payload.sessionId, geo);
    visitorLog('info', 'geo enriched', {
      session: payload.sessionId.slice(0, 8),
      country: geo?.country ?? null,
    });

    // CHANGE: 2026-08-18 — Background reverse DNS lookup (non-blocking, best-effort).
    lookupReverseDns(meta.ip)
      .then((rdns) => applyReverseDns(payload.sessionId, rdns))
      .catch(() => {});
  }

  return new Response(null, { status: 204 });
}
