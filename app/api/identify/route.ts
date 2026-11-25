import { NextResponse, after } from 'next/server';
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
  isIgnoredRequest,
} from '@/lib/visitors';

export const runtime = 'nodejs';
export const maxDuration = 10;

const RATE_LIMIT = 120;
const RATE_WINDOW = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// CHANGE: 2026-11-20 — known crawler signatures only. Deliberately narrow: over-matching
// silently drops genuine visitors from the ledger. In-app browsers (WhatsApp/Telegram) are NOT
// bots and are intentionally not matched.
const BOT_UA_RE = /(?:bot|crawl|spider|slurp|headless|phantom|curl|wget|python-requests|semrush|ahrefs)/i;

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

  // CHANGE: 2026-11-20 — cheapest possible exit. Bots and ignored dev/LAN IPs never reach the
  // rate-limit map, JSON parse, Mongo upsert or geo/reverse-DNS enrichment. recordVisitor()
  // still gates ignored IPs as the authoritative write guard; this just stops the bookkeeping.
  if (isIgnoredRequest(request) || BOT_UA_RE.test(meta.userAgent)) {
    return new Response(null, { status: 204 });
  }

  // 1) Rate limit (in-memory). NOTE: the comment here used to claim proxy.ts added a coarser
  // 60/min/IP cap — proxy.ts is dormant under Next 15 (AGENTS §2.4), so this is the only cap.
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

  // CHANGE: 2026-11-23 — geo + reverse DNS are BEST-EFFORT enrichment, not part of the
  // beacon's job. They used to sit inline on the critical path: a new/stale session paid
  // an ip_cache findOne, a 2.5 s-capped ipwho.is HTTP call, an ip_cache upsert and two
  // `visitors` writes before the 204 went out (the 8 s / 36-hit CPU report). They now run
  // in Next's after() — the same pattern already used by /api/cart/order — so the 204
  // is sent as soon as the session upsert commits. recordVisitor() has already written
  // the visitor doc; geo/rdns are lossless later $sets, so a frozen function or a failed
  // lookup leaves only enrichment missing, never the visit itself.
  // CHANGE: 2026-11-25 — operational kill-switch for the high-traffic window. Set
  // VISITOR_ENRICHMENT=0 in Vercel to skip the post-response ipwho.is + reverse-DNS work
  // entirely. Default is unchanged; the visitor ledger itself is never affected — only the
  // optional country/ISP enrichment on the first beacon of a session.
  if (needsGeo && process.env.VISITOR_ENRICHMENT !== '0') {
    after(async () => {
      try {
        const { geo } = await lookupGeo(meta.ip);
        // Always write geoAt (even when geo is null) so a failed lookup is not retried
        // on every subsequent beacon — preserves the existing 30-day/1-hour TTL logic.
        await applyGeo(payload.sessionId, geo);
        visitorLog('info', 'geo enriched', {
          session: payload.sessionId.slice(0, 8),
          country: geo?.country ?? null,
        });

        // CHANGE: 2026-08-18 → 2026-11-23 — reverse DNS was fire-and-forget but still
        // kept the function alive for up to 3 s after the 204 had been sent. It now runs
        // inside the same post-response window as geo, fully awaited and failure-contained.
        const rdns = await lookupReverseDns(meta.ip);
        await applyReverseDns(payload.sessionId, rdns);
      } catch {
        // best-effort — the visitor record itself is already committed
      }
    });
  }

  return new Response(null, { status: 204 });
}
