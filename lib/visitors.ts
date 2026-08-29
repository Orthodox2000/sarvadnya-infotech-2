// CHANGE: 2026-08-18 — Extended data collection: reverse DNS, proxy/VPN/Tor flags, UTM params.
// GPC opt-out gating removed — full IP and geo always collected (see AGENTS.md: never assume).
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb-utils';
import dns from 'dns';
import { promisify } from 'util';

const reverseDnsLookup = promisify(dns.reverse);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// CHANGE: 2026-08-18 — Added reverseDns, isProxy, isVpn, isTor for enhanced IP intelligence.
export interface GeoInfo {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
  currency: string;
  proxy: boolean;
  hosting: boolean;
  reverseDns?: string;
  isProxy?: boolean;
  isVpn?: boolean;
  isTor?: boolean;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';
  browser: string;
  os: string;
  engine?: string;
  mobile: boolean;
}

// CHANGE: 2026-08-18 — Added utmParams type for marketing campaign tracking.
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface VisitorRecord {
  _id?: ObjectId;
  sessionId: string;
  firstSeen: Date;
  lastSeen: Date;
  updatedAt: Date;
  visitCount: number;
  pageViews: number;
  entryPath: string;
  lastPath: string;
  referrer?: string;
  lastReferrer?: string;
  title?: string;
  screen?: string;
  paths: { path: string; at: Date }[];
  sectionViews?: string[];
  ip?: string;
  userAgent?: string;
  device?: DeviceInfo | null;
  language?: string;
  secGpc?: boolean;
  secFetchSite?: string;
  geo?: GeoInfo | null;
  geoAt?: Date | null;
  gpcRespected: boolean;
  lastFormAt?: Date;
  reverseDns?: string;
  utmParams?: UtmParams;
}

export interface IpCacheRecord {
  _id?: ObjectId;
  ip: string;
  data: GeoInfo | null;
  fetchedAt: Date;
  expireAt: Date;
}

// CHANGE: 2026-08-18 — Added UTM fields to TrackPayload for campaign tracking.
export interface TrackPayload {
  sessionId: string;
  path: string;
  referrer: string;
  title: string;
  language: string;
  screen: string;
  sectionViews: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface RequestMeta {
  ip: string;
  userAgent: string;
  language: string;
  secGpc: boolean;
  secFetchSite: string;
  referrer: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GEO_TTL_MS = 30 * 24 * 60 * 60 * 1000; // positive geo cache
const NEGATIVE_TTL_MS = 60 * 60 * 1000; // failed lookups: retry after 1h
const GEO_TIMEOUT_MS = 2500;
const GEO_REFRESH_MS = 30 * 24 * 60 * 60 * 1000; // refresh stale geo after 30d

const SESSION_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PRIVATE_PREFIXES = [
  '127.',
  '10.',
  '192.168.',
  '172.16.',
  '172.17.',
  '172.18.',
  '172.19.',
  '172.20.',
  '172.21.',
  '172.22.',
  '172.23.',
  '172.24.',
  '172.25.',
  '172.26.',
  '172.27.',
  '172.28.',
  '172.29.',
  '172.30.',
  '172.31.',
  '169.254.',
  '::1',
  '::ffff:127.',
  '0.0.0.0',
];

// ---------------------------------------------------------------------------
// Logging (gated by VISITOR_LOG_LEVEL: debug | info | warn | error | off)
// ---------------------------------------------------------------------------

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

let currentLogLevel: LogLevel | 'off' =
  ((process.env.VISITOR_LOG_LEVEL as LogLevel | 'off') || 'info');

export function visitorLog(
  level: LogLevel,
  msg: string,
  data?: Record<string, unknown>
): void {
  if (currentLogLevel === 'off') return;
  const threshold = LOG_LEVELS.indexOf(currentLogLevel);
  if (LOG_LEVELS.indexOf(level) < threshold) return;
  const fn =
    level === 'debug'
      ? console.debug
      : level === 'info'
        ? console.info
        : level === 'warn'
          ? console.warn
          : console.error;
  fn(`[visitor] ${msg}`, data ?? {});
}

// ---------------------------------------------------------------------------
// IP / request helpers
// ---------------------------------------------------------------------------

export function getClientIpFromHeaders(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'anonymous'
  );
}

export function getClientIp(request: Request): string {
  return getClientIpFromHeaders(request.headers);
}

export function getRequestMetaFromHeaders(headers: Headers): RequestMeta {
  return {
    ip: getClientIpFromHeaders(headers),
    userAgent: String(headers.get('user-agent') || '').slice(0, 300),
    language: String(headers.get('accept-language') || '').slice(0, 60),
    secGpc: headers.get('sec-gpc') === '1',
    secFetchSite: String(headers.get('sec-fetch-site') || '').slice(0, 20),
    referrer: String(headers.get('referer') || '').slice(0, 500),
  };
}

export function getRequestMeta(request: Request): RequestMeta {
  return getRequestMetaFromHeaders(request.headers);
}

export function isPublicIp(ip: string): boolean {
  if (!ip || ip === 'anonymous' || ip === 'unknown') return false;
  return !PRIVATE_PREFIXES.some((p) => ip.startsWith(p));
}

export function maskIp(ip: string): string {
  if (!ip || !isPublicIp(ip)) return 'private';
  if (ip.includes(':')) return `${ip.split(':')[0]}::…`;
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.x.x`;
}

export function maskSessionId(id: string): string {
  if (!id) return '—';
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

export function isValidSessionId(value: unknown): boolean {
  return typeof value === 'string' && SESSION_ID_RE.test(value);
}

// ---------------------------------------------------------------------------
// Payload sanitization
// ---------------------------------------------------------------------------

function cleanStr(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

export function sanitizeTrackPayload(raw: unknown): TrackPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const sessionId = cleanStr(r.sessionId, 40);
  if (!isValidSessionId(sessionId)) return null;

  let sectionViews: string[] = [];
  if (Array.isArray(r.sectionViews)) {
    sectionViews = r.sectionViews
      .map((v) => cleanStr(v, 80))
      .filter(Boolean)
      .slice(0, 20);
    sectionViews = [...new Set(sectionViews)];
  }

// CHANGE: 2026-08-18 — Sanitize UTM fields from beacon payload.
  return {
    sessionId,
    path: cleanStr(r.path, 500) || '/',
    referrer: cleanStr(r.referrer, 500),
    title: cleanStr(r.title, 200),
    language: cleanStr(r.language, 60),
    screen: cleanStr(r.screen, 30),
    sectionViews,
    utmSource: cleanStr(r.utmSource, 100) || undefined,
    utmMedium: cleanStr(r.utmMedium, 100) || undefined,
    utmCampaign: cleanStr(r.utmCampaign, 200) || undefined,
    utmTerm: cleanStr(r.utmTerm, 200) || undefined,
    utmContent: cleanStr(r.utmContent, 200) || undefined,
  };
}

// ---------------------------------------------------------------------------
// Geo lookup (ipwho.is, cache-first)
// ---------------------------------------------------------------------------

export function normalizeGeo(raw: unknown): GeoInfo | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, any>;
  if (r.success === false) return null;

  const conn = r.connection && typeof r.connection === 'object'
    ? (r.connection as Record<string, any>)
    : {};
  const tz = r.timezone && typeof r.timezone === 'object'
    ? (r.timezone as Record<string, any>)
    : {};
  const cur = r.currency && typeof r.currency === 'object'
    ? (r.currency as Record<string, any>)
    : {};

  const clamp = (v: unknown, max: number): string =>
    String(v ?? '').trim().slice(0, max);
  const num = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

// CHANGE: 2026-08-18 — Extended normalizeGeo to populate isProxy, isVpn, isTor flags.
  return {
    country: clamp(r.country, 60),
    countryCode: clamp(r.country_code, 4).toUpperCase(),
    region: clamp(r.region, 60),
    city: clamp(r.city, 60),
    postal: clamp(r.postal, 20),
    latitude: num(r.latitude),
    longitude: num(r.longitude),
    timezone: clamp(tz.id || r.timezone, 40),
    isp: clamp(conn.isp, 80),
    org: clamp(conn.org, 80),
    asn: String(conn.asn ?? '').slice(0, 20),
    currency: clamp(cur.code ?? '', 8),
    proxy: Boolean(r.proxy || r.anonymous),
    hosting: Boolean(conn.hosting || r.hosting),
    isProxy: Boolean(r.proxy || r.anonymous),
    isVpn: Boolean(r.vpn),
    isTor: Boolean(r.tor),
  };
}

export async function lookupGeo(
  ip: string
): Promise<{ geo: GeoInfo | null; cached: boolean }> {
  if (!isPublicIp(ip)) return { geo: null, cached: false };

  const col = await getDb().then((db) => db.collection<IpCacheRecord>('ip_cache'));
  const hit = await col.findOne({ ip });
  if (hit && hit.expireAt && hit.expireAt.getTime() > Date.now()) {
    return { geo: hit.data ?? null, cached: true };
  }

  const base = String(process.env.IP_LOOKUP_API || 'https://ipwho.is')
    .trim()
    .replace(/\/+$/, '');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

  try {
    let raw: unknown;
    try {
      const res = await fetch(`${base}/${encodeURIComponent(ip)}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      raw = await res.json();
    } finally {
      clearTimeout(timeoutId);
    }

    const geo = normalizeGeo(raw);
    await col.updateOne(
      { ip },
      {
        $set: {
          data: geo,
          fetchedAt: new Date(),
          expireAt: new Date(Date.now() + (geo ? GEO_TTL_MS : NEGATIVE_TTL_MS)),
        },
      },
      { upsert: true }
    );
    visitorLog('debug', 'geo looked up', {
      ip: maskIp(ip),
      country: geo?.country ?? null,
    });
    return { geo, cached: false };
  } catch (err) {
    visitorLog('warn', 'geo lookup failed', {
      ip: maskIp(ip),
      error: err instanceof Error ? err.message : String(err),
    });
    return { geo: null, cached: false };
  }
}

// ---------------------------------------------------------------------------
// Session recording (dedup core)
// ---------------------------------------------------------------------------

// CHANGE: 2026-08-18 — Removed respectGpc parameter. Full IP, geo, device always stored.
// UTM params and reverse DNS stored when available.
// CHANGE: 2026-08-29 — Dropped ipMasked storage. Full IP persisted openly in `ip` (per user request).
export async function recordVisitor(input: {
  payload: TrackPayload;
  meta: RequestMeta;
}): Promise<{ created: boolean; needsGeo: boolean; existingGeoAt: Date | null }> {
  await ensureVisitorIndexes();
  const { payload, meta } = input;
  const now = new Date();
  const col = await getDb().then((db) => db.collection<VisitorRecord>('visitors'));

  // Build UTM params object — only include fields that have values.
  const utmParams: UtmParams | undefined =
    payload.utmSource || payload.utmMedium || payload.utmCampaign || payload.utmTerm || payload.utmContent
      ? {
          ...(payload.utmSource ? { source: payload.utmSource } : {}),
          ...(payload.utmMedium ? { medium: payload.utmMedium } : {}),
          ...(payload.utmCampaign ? { campaign: payload.utmCampaign } : {}),
          ...(payload.utmTerm ? { term: payload.utmTerm } : {}),
          ...(payload.utmContent ? { content: payload.utmContent } : {}),
        }
      : undefined;

  const rawResult = await col.findOneAndUpdate(
    { sessionId: payload.sessionId },
    {
      $setOnInsert: {
        firstSeen: now,
        entryPath: payload.path,
        referrer: payload.referrer,
      },
      $inc: { visitCount: 1, pageViews: 1 },
      $set: {
        lastSeen: now,
        lastPath: payload.path,
        lastReferrer: payload.referrer,
        title: payload.title,
        language: payload.language || meta.language,
        screen: payload.screen,
        device: parseDevice(meta.userAgent),
        userAgent: meta.userAgent,
        ip: meta.ip,
        secGpc: meta.secGpc,
        secFetchSite: meta.secFetchSite,
        gpcRespected: false,
        updatedAt: now,
        ...(utmParams ? { utmParams } : {}),
      },
      $push: { paths: { $each: [{ path: payload.path, at: now }], $slice: -30 } },
      $addToSet: { sectionViews: { $each: payload.sectionViews } },
    },
    { upsert: true, returnDocument: 'before' }
  );
  const result = rawResult as unknown as {
    value?: VisitorRecord | null;
    lastErrorObject?: { upserted?: unknown };
  };

  const created = Boolean(result?.lastErrorObject?.upserted) || result?.value == null;
  const existingGeoAt: Date | null = result?.value?.geoAt ?? null;
  const needsGeo =
    created ||
    !existingGeoAt ||
    now.getTime() - existingGeoAt.getTime() > GEO_REFRESH_MS;

  visitorLog('debug', created ? 'session created' : 'session updated', {
    session: maskSessionId(payload.sessionId),
    ip: maskIp(meta.ip),
    needsGeo,
  });

  return { created, needsGeo, existingGeoAt };
}

export async function applyGeo(sessionId: string, geo: GeoInfo | null): Promise<void> {
  const col = await getDb().then((db) => db.collection<VisitorRecord>('visitors'));
  await col.updateOne(
    { sessionId },
    { $set: { geo, geoAt: new Date(), updatedAt: new Date() } }
  );
}

export async function markConversion(sessionId: string): Promise<void> {
  if (!isValidSessionId(sessionId)) return;
  const col = await getDb().then((db) => db.collection<VisitorRecord>('visitors'));
  await col.updateOne(
    { sessionId },
    { $set: { lastFormAt: new Date(), updatedAt: new Date() } }
  );
}

// ---------------------------------------------------------------------------
// Reverse DNS lookup (background/lazy — non-blocking, called async)
// ---------------------------------------------------------------------------

// CHANGE: 2026-08-18 — Added reverse DNS and proxy/VPN flag enrichment.
const RDNS_TIMEOUT_MS = 3000;
const RDNS_NEGATIVE_TTL_MS = 60 * 60 * 1000; // cache failures for 1 hour

export async function lookupReverseDns(ip: string): Promise<string | null> {
  if (!isPublicIp(ip)) return null;
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('rdns timeout')), RDNS_TIMEOUT_MS)
    );
    const addrs = await Promise.race([reverseDnsLookup(ip), timeoutPromise]);
    if (Array.isArray(addrs) && addrs.length > 0) {
      return addrs[0].slice(0, 255);
    }
  } catch {
    // Silently ignore — this is best-effort background enrichment.
  }
  return null;
}

export async function applyReverseDns(sessionId: string, rdns: string | null): Promise<void> {
  if (!rdns || !isValidSessionId(sessionId)) return;
  const col = await getDb().then((db) => db.collection<VisitorRecord>('visitors'));
  await col.updateOne(
    { sessionId },
    { $set: { reverseDns: rdns, updatedAt: new Date() } }
  );
}

// ---------------------------------------------------------------------------
// Device parsing (dependency-free)
// ---------------------------------------------------------------------------

export function parseDevice(ua: string): DeviceInfo {
  const s = String(ua || '');
  const lower = s.toLowerCase();

  const isBot = /bot|spider|crawler|slurp|curl|wget|headless|puppeteer|phantom|preview/i.test(
    lower
  );
  const isTablet =
    /ipad|tablet|playbook|kindle|silk/i.test(s) ||
    (/android/i.test(s) && !/mobile/i.test(s));
  const isMobile =
    /mobile|iphone|ipod|windows phone|blackberry/i.test(s) && !isTablet;

  const type: DeviceInfo['type'] = isBot
    ? 'bot'
    : isTablet
      ? 'tablet'
      : isMobile
        ? 'mobile'
        : /Mobi|Linux|Windows|Macintosh|X11/i.test(s)
          ? 'desktop'
          : 'unknown';

  const os = /windows nt/i.test(lower)
    ? 'Windows'
    : /iphone|ipad|ipod/i.test(lower)
      ? 'iOS'
      : /android/i.test(lower)
        ? 'Android'
        : /mac os x/i.test(lower)
          ? 'macOS'
          : /linux/i.test(lower)
            ? 'Linux'
            : /blackberry/i.test(lower)
              ? 'BlackBerry'
              : 'Unknown';

  const browser = /edg(e)?\//i.test(lower)
    ? 'Edge'
    : /opr\/|opera/i.test(lower)
      ? 'Opera'
      : /chrome|crios/i.test(lower)
        ? 'Chrome'
        : /safari/i.test(lower) && !/chrome|chromium/i.test(lower)
          ? 'Safari'
          : /firefox|fxios/i.test(lower)
            ? 'Firefox'
            : /msie|trident/i.test(lower)
              ? 'IE'
              : 'Unknown';

  const engine = /applewebkit/i.test(lower)
    ? 'WebKit'
    : /gecko/i.test(lower)
      ? 'Gecko'
      : /blink/i.test(lower)
        ? 'Blink'
        : /trident/i.test(lower)
          ? 'Trident'
          : '';

  return { type, browser, os, engine: engine || undefined, mobile: isMobile };
}

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

let visitorIndexPromise: Promise<void> | null = null;

export function ensureVisitorIndexes(): Promise<void> {
  if (!visitorIndexPromise) {
    visitorIndexPromise = (async () => {
      const db = await getDb();
      await db.collection('visitors').createIndex({ sessionId: 1 }, { unique: true });
      await db.collection('visitors').createIndex({ lastSeen: -1 });
      await db.collection('visitors').createIndex({ 'geo.country': 1 });
      await db.collection('visitors').createIndex({ visitCount: -1 });
      await db.collection('ip_cache').createIndex({ ip: 1 }, { unique: true });
      await db
        .collection('ip_cache')
        .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
    })().catch((err) => {
      visitorIndexPromise = null;
      throw err;
    });
  }
  return visitorIndexPromise;
}
