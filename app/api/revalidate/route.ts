import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// CHANGE: 2026-11-24 — on-demand revalidation webhook for rare content changes.
// WHY: modules/news/content are read-heavy and rarely change. ISR + unstable_cache keep CPU low,
// but admin edits need to appear without waiting for TTL expiry. The admin deployment can POST
// here after a save. Secured by REVALIDATE_SECRET; never exposes data.

type RevalidateBody = {
  secret?: string;
  tags?: string[];
  paths?: string[];
};

const MODULE_TAGS = ['modules'];
const MODULE_PATHS = ['/modules', '/api/modules', '/sitemap.xml'];
// CHANGE: 2026-11-24 — Tally Insights curriculum is static and rarely changed; allow targeted
// manual invalidation without waiting for 6h ISR.
const INSIGHTS_PATHS = ['/tally-insights', '/sitemap.xml'];

function authorized(request: Request, bodySecret?: string): boolean {
  const expected = process.env.REVALIDATE_SECRET?.trim();
  if (!expected) return false;
  const header = request.headers.get('x-revalidate-secret')?.trim();
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const provided = header || bearer || bodySecret?.trim();
  return Boolean(provided && provided === expected);
}

export async function POST(request: Request) {
  let body: RevalidateBody = {};
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    // Allow empty/invalid body only when auth is via header.
  }

  if (!authorized(request, body.secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const defaultPaths = Array.isArray(body.tags) && body.tags.includes('insights') ? INSIGHTS_PATHS : MODULE_PATHS;
  const tags = Array.isArray(body.tags) && body.tags.length ? body.tags : MODULE_TAGS;
  const paths = Array.isArray(body.paths) && body.paths.length ? body.paths : defaultPaths;

  const safeTags = tags.filter((t): t is string => typeof t === 'string' && t.length > 0);
  const safePaths = paths.filter((p): p is string => typeof p === 'string' && p.startsWith('/'));

  for (const tag of safeTags) {
    revalidateTag(tag);
  }
  for (const path of safePaths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    tags: safeTags,
    paths: safePaths,
    now: Date.now(),
  });
}
