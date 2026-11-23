import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { unstable_cache } from 'next/cache';
import { staticPartners } from './partners';
import { enrichNews, RETIRED_NEWS_SLUGS } from './news-utils';
import type { NewsItem } from './news';
// CHANGE: 2026-11-23 — news and modules are read on every page/render but change only when
// the owner edits them in the admin. Cache the SERIALISED results in Vercel's Data Cache so a
// cold function or an ISR revalidation never re-scans either collection. TTL intentionally
// MATCHES the owner-accepted 1-hour CDN/ISR window (lib/api-cache.ts) — admin edits must still
// surface hourly; the saving is that the hourly refresh no longer repeats the CPU-heavy scan.
const CACHED_CONTENT_SECONDS = 60 * 60;

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection(name: string) {
  const db = await getDb();
  return db.collection(name);
}

// Serialization helper for Next.js Client Components
export function serializeData(data: any): any {
  if (data === null || data === undefined) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item));
  }
  
  if (typeof data === 'object') {
    // Recurse through properties
    const plain: any = {};
    for (const key in data) {
      const val = data[key];
      if (val instanceof ObjectId) {
        plain[key] = val.toString();
      } else if (val instanceof Date) {
        plain[key] = val.toISOString();
      } else if (Array.isArray(val)) {
        plain[key] = val.map(item => serializeData(item));
      } else if (val && typeof val === 'object') {
        plain[key] = serializeData(val);
      } else {
        plain[key] = val;
      }
    }
    // Specific check for _id if it wasn't caught by instanceof ObjectId
    if (data._id && typeof data._id !== 'string') {
      plain._id = data._id.toString();
    }
    return plain;
  }
  
  return data;
}

// Settings helpers
async function fetchSettings() {
  const col = await getCollection('settings');
  const settings = await col.find({}).toArray();
  const map = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  return serializeData(map);
}

export const getSettings = async () => fetchSettings();

export async function updateSetting(key: string, value: string) {
  const col = await getCollection('settings');
  await col.updateOne(
    { key },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Applications helpers - No caching for submissions/admin views
export async function saveApplication(data: any) {
  const col = await getCollection('job_applications');
  return await col.insertOne({
    ...data,
    createdAt: new Date()
  });
}

export async function getApplications() {
  const col = await getCollection('job_applications');
  const data = await col.find({}).sort({ createdAt: -1 }).toArray();
  return serializeData(data);
}

// Content helpers
async function fetchContent(section: string) {
  const col = await getCollection('site_content');
  const doc = await col.findOne({ section });
  return doc ? serializeData(doc.content) : null;
}

export async function getContent(section: string) {
  return fetchContent(section);
}

export async function updateContent(section: string, content: any) {
  const col = await getCollection('site_content');
  await col.updateOne(
    { section },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Modules helpers
async function fetchModules() {
  const col = await getCollection('modules');
  // Sort by sequence (ascending), then by createdAt (descending) for items without sequence
  const data = await col.find({}).sort({ sequence: 1, createdAt: -1 }).toArray();
  return serializeData(data);
}

// CHANGE: 2026-11-23 — one Data Cache entry serves /api/modules, /modules/[slug], the
// sitemap, site search and the layout. Previously each of those opened Mongo and re-sorted
// the collection independently.
export const getModules = unstable_cache(
  async () => fetchModules(),
  ['public-modules-v1'],
  { revalidate: CACHED_CONTENT_SECONDS, tags: ['modules'] }
);

export async function addModule(data: any) {
  const col = await getCollection('modules');
  
  // Find the highest sequence number
  const lastModule = await col.find({}).sort({ sequence: -1 }).limit(1).toArray();
  const nextSequence = lastModule.length > 0 ? (lastModule[0].sequence || 0) + 1 : 0;

  const result = await col.insertOne({
    ...data,
    sequence: nextSequence,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function updateModule(id: string, data: any) {
  const col = await getCollection('modules');
  const { _id, ...updateData } = data;
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await col.updateOne(
    query,
    { $set: { ...updateData, updatedAt: new Date() } },
    { upsert: true }
  );
  return result;
}

export async function reorderModules(orders: { id: string; sequence: number }[]) {
  const col = await getCollection('modules');
  const bulkOps = orders.map(order => ({
    updateOne: {
      filter: { _id: new ObjectId(order.id) },
      update: { $set: { sequence: order.sequence, updatedAt: new Date() } }
    }
  }));
  const result = await col.bulkWrite(bulkOps);
  return result;
}

export async function deleteModule(id: string) {
  const col = await getCollection('modules');
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await col.deleteOne(query);
  return result;
}

// Tutorials/Learning helpers
async function fetchTutorials() {
  const col = await getCollection('learning_content');
  // CHANGE: 2026-11-21 — admin-added tutorials can arrive with `createdAt` as an
  // ISO STRING while older seed docs hold a real BSON Date. Mongo sorts String
  // BELOW Date, so `sort({ createdAt: -1 })` pushed the newer video to the BOTTOM
  // of the grid (measured: the "Bank Statement Import Tool" video was 7th of 7
  // despite being the newest). Normalise both shapes to an epoch number here so
  // the feed is genuinely newest-first regardless of how the row was written.
  const data = await col.find({}).toArray();
  const createdMs = (value: unknown): number => {
    const ms = value instanceof Date
      ? value.getTime()
      : new Date(String(value ?? 0)).getTime();
    return Number.isFinite(ms) ? ms : 0;
  };
  data.sort((a, b) => createdMs(b.createdAt) - createdMs(a.createdAt));
  return serializeData(data);
}

export const getTutorials = async () => fetchTutorials();

export async function addTutorial(data: any) {
  const col = await getCollection('learning_content');
  const result = await col.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function updateTutorial(id: string, data: any) {
  const col = await getCollection('learning_content');
  const { _id, ...updateData } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  return result;
}

export async function deleteTutorial(id: string) {
  const col = await getCollection('learning_content');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result;
}

// Reviews helpers
// CHANGE: 2026-10-23 — 4 → 12. The homepage wall now shows TEN curated reviews (owner:
// "sort best 10 and add them"); at 4 the list was silently truncated no matter how many
// reviews the collection held, and addReview() refused any 5th row.
export const MAX_REVIEWS = 12;

async function fetchReviews() {
  const col = await getCollection('reviews');
  const data = await col.find({}).sort({ createdAt: -1 }).limit(MAX_REVIEWS).toArray();
  return serializeData(data);
}

export const getReviews = async () => fetchReviews();

export async function addReview(data: any) {
  const col = await getCollection('reviews');
  const count = await col.countDocuments();
  if (count >= MAX_REVIEWS) {
    throw new Error(`Maximum of ${MAX_REVIEWS} reviews reached. Please remove one before adding a new one.`);
  }
  const result = await col.insertOne({
    ...data,
    createdAt: new Date()
  });
  return result;
}

export async function deleteReview(id: string) {
  const col = await getCollection('reviews');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result;
}

export async function updateReview(id: string, data: any) {
  const col = await getCollection('reviews');
  const { _id, ...updateData } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  return result;
}

// Partners helpers
async function fetchPartners(type?: string) {
  const col = await getCollection('partners');

  // CHANGE: 2026-08-26 — The home "Certified Industry Partners" showcase (type=brand) is owned by the
  // FRONTEND canonical list in lib/partners.ts (AWS → Biz Analyst → TallyPrime → OTU → NoSky). Every read
  // reconciles the DB to that list (delete stale entries, upsert missing, enforce order) so the sequence and
  // logos stay correct even if the DB still holds old seed data (e.g. CredFlow / "Tally Software").
  // Admin-managed types (about / team) are left untouched.
  if (type === 'brand') {
    const canonical = staticPartners.map(({ _id, ...p }) => ({
      name: p.name,
      imageUrl: p.imageUrl,
      type: 'brand' as const,
    }));

    const existing = await col.find({ type: 'brand' }).toArray();
    const canonicalNames = new Set(canonical.map(p => p.name));

    const stale = existing.filter((doc: any) => !canonicalNames.has(doc.name)).map((doc: any) => doc._id);
    if (stale.length) await col.deleteMany({ _id: { $in: stale } });

    for (const p of canonical) {
      await col.updateOne(
        { type: 'brand', name: p.name },
        { $set: { imageUrl: p.imageUrl }, $setOnInsert: { name: p.name, type: 'brand', createdAt: new Date() } },
        { upsert: true }
      );
    }

    const data = await col.find({ type: 'brand' }).toArray();
    const order = new Map(canonical.map((p, i) => [p.name, i]));
    data.sort((a: any, b: any) => (order.get(a.name) ?? 999) - (order.get(b.name) ?? 999));
    return serializeData(data);
  }

  const query = type ? { type } : {};
  const data = await col.find(query).sort({ createdAt: 1 }).toArray();
  return serializeData(data);
}

export async function getPartners(type?: string) {
  return fetchPartners(type);
}

export async function addPartner(data: any) {
  const col = await getCollection('partners');
  const result = await col.insertOne({
    ...data,
    createdAt: new Date()
  });
  return result;
}

export async function updatePartner(id: string, data: any) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const col = await getCollection('partners');
  const { _id, ...updateData } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  return result;
}

export async function deletePartner(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const col = await getCollection('partners');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result;
}

// News helpers
// CHANGE: 2026-08-31 — Sort news so the latest item appears first (newest `date` on top).
// Falls back to insertion order (_id) for entries without a parseable date.
// CHANGE: 2026-08-31 — Enriched to the blog shape via enrichNews() so every consumer (news listing,
// /api/news, search, sitemap, article pages) gets slug/excerpt/readingTime/tags/author/dateIso
// auto-derived from the legacy admin fields. Explicit values win when present.
async function fetchNews() {
  const col = await getCollection('news');
  const data = await col.find({}).toArray();
  // CHANGE: 2026-11-03 — drop retired (301'd) slugs before anything sees the list.
  // WHY here and not at each consumer: this function feeds the /news listing, /api/news, the
  // search API, related posts and sitemap.xml. Filtering at the source means a retired article
  // cannot keep appearing as a card that links to a redirect, and the sitemap cannot advertise a
  // URL that 301s (GSC reports that as "Page with redirect"). The document itself is untouched.
  const live = RETIRED_NEWS_SLUGS.length
    ? data.filter((d) => !RETIRED_NEWS_SLUGS.includes(enrichNews(d).slug as string))
    : data;
  live.sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    const va = Number.isNaN(ta) ? 0 : ta;
    const vb = Number.isNaN(tb) ? 0 : tb;
    if (va !== vb) return vb - va;
    return String(b._id).localeCompare(String(a._id));
  });
  return serializeData(live.map((d) => enrichNews(d)));
}

// CHANGE: 2026-11-23 — one Data Cache entry serves the site-wide news ticker, /news,
// /news/[slug], related posts, /api/news, search and the sitemap. fetchNews() is the
// expensive part (full-collection scan + enrichNews() reading-time on every body); it now
// runs at most once per hour per Vercel region instead of once per uncached render/query.
export const getNews = unstable_cache(
  async () => fetchNews(),
  ['public-news-v1'],
  { revalidate: CACHED_CONTENT_SECONDS, tags: ['news'] }
);

// CHANGE: 2026-08-31 — Single-article lookup by slug (used by /news/[slug]).
// Matches the exact final slug from enrichNews() (explicit doc.slug OR auto-derived), so both
// admin-crafted slugs and auto-generated ones resolve. Returns null when not found.
export async function getNewsBySlug(slug: string) {
  if (!slug) return null;
  // CHANGE: 2026-11-23 — this used to be a SECOND full-collection find({}).toArray() with
  // enrichNews() on every article just to locate one. The cached getNews() list is already
  // enriched and serialised, so lookup is an in-memory find and can never disagree with the
  // listing, sitemap or related cards.
  const news = await getNews();
  return news.find((item: any) => item.slug === slug) || null;
}

// CHANGE: 2026-11-20 → 2026-11-23 — /news/[slug] used to load the entire archive three times
// per render. It now derives the three "Related Reads" cards from the cached getNews() list.
// `content` is stripped from each card so the page never holds article bodies it does not render;
// the derived reading times still come from enrichNews(), so "N min read" matches the listing.
export async function getRelatedNews(excludeSlug: string, limit = 3): Promise<Partial<NewsItem>[]> {
  try {
    // CHANGE: 2026-11-23 — derived from the cached getNews() list instead of a third Mongo
    // query per article render. getNews() is already newest-first and has retired slugs and
    // derived reading times applied, so the ordering/exclusions stay identical. `content`
    // is stripped here (not in the cache) because only the cards' metadata is rendered.
    const skip = [excludeSlug, ...RETIRED_NEWS_SLUGS].filter(Boolean);
    return (await getNews())
      .filter((item: any) => item.slug && !skip.includes(String(item.slug)))
      .slice(0, limit)
      .map((item: any) => {
        const { content: _content, ...card } = item;
        return card as Partial<NewsItem>;
      });
  } catch (error) {
    console.error('Related news lookup failed:', error);
    return [];
  }
}

export async function addNews(data: any) {
  const col = await getCollection('news');
  const result = await col.insertOne({
    ...data,
    createdAt: new Date()
  });
  return result;
}

export async function updateNews(id: string, data: any) {
  const col = await getCollection('news');
  const { _id, ...updateData } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  return result;
}

export async function deleteNews(id: string) {
  const col = await getCollection('news');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result;
}

// Submission helpers (Forms)
export async function saveSubmission(data: any) {
  const col = await getCollection('form_submissions');
  return await col.insertOne({
    ...data,
    createdAt: new Date()
  });
}

// CHANGE: 2026-08-18 — Extended submissions: text search across name/email/ip/service,
// new sort keys (ip, geo.country, createdAt with _id tiebreak), and exportAllSubmissions().
const SUBMISSION_SORT_KEYS = ['createdAt', 'name', 'contact', 'formType', 'service', 'ip'];

export type SubmissionQuery = {
  page: number;
  limit: number;
  formType?: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  search?: string;
};

export async function getSubmissionsPaginated(query: SubmissionQuery) {
  const col = await getCollection('form_submissions');
  const filter: any = {};
  if (query.formType && query.formType !== 'all') {
    filter.formType = query.formType;
  }
  // Text search across multiple fields (case-insensitive partial match).
  if (query.search && query.search.trim()) {
    const term = query.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { ip: regex },
      { service: regex },
      { contact: regex },
      { description: regex },
      { 'reverseDns': regex },
      { 'geo.country': regex },
      { 'geo.city': regex },
      { 'geo.isp': regex },
    ];
  }
  const sortKey = SUBMISSION_SORT_KEYS.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortDir = query.sortDir === 'asc' ? 1 : -1;
  const [total, data] = await Promise.all([
    col.countDocuments(filter),
    col
      .find(filter)
      .sort({ [sortKey]: sortDir, _id: -1 } as any)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .toArray(),
  ]);
  return { data: serializeData(data), total };
}

// CHANGE: 2026-08-18 — Export all matching submissions (no pagination) for Excel download.
export async function exportAllSubmissions(query: { formType?: string; search?: string; sortBy?: string; sortDir?: 'asc' | 'desc' }) {
  const col = await getCollection('form_submissions');
  const filter: any = {};
  if (query.formType && query.formType !== 'all') {
    filter.formType = query.formType;
  }
  if (query.search && query.search.trim()) {
    const term = query.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { ip: regex },
      { service: regex },
      { contact: regex },
      { description: regex },
      { 'reverseDns': regex },
      { 'geo.country': regex },
      { 'geo.city': regex },
      { 'geo.isp': regex },
    ];
  }
  const sortKey = SUBMISSION_SORT_KEYS.includes(query.sortBy || '') ? query.sortBy! : 'createdAt';
  const sortDir = query.sortDir === 'asc' ? 1 : -1;
  const data = await col.find(filter).sort({ [sortKey]: sortDir, _id: -1 } as any).toArray();
  return serializeData(data);
}

export function isValidObjectId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id) && ObjectId.isValid(id);
}

export async function deleteSubmission(id: string) {
  const col = await getCollection('form_submissions');
  return await col.deleteOne({ _id: new ObjectId(id) });
}

// Problem report helpers
export async function saveProblemReport(data: any) {
  const col = await getCollection('problem_reports');
  return await col.insertOne({
    ...data,
    status: data.status || 'open',
    createdAt: new Date()
  });
}

export async function getProblemReports() {
  const col = await getCollection('problem_reports');
  const data = await col.find({}).sort({ createdAt: -1 }).toArray();
  return serializeData(data);
}

export async function deleteProblemReport(id: string) {
  const col = await getCollection('problem_reports');
  return await col.deleteOne({ _id: new ObjectId(id) });
}

// TSS Renewal helpers
export async function saveTssRenewal(data: any) {
  const col = await getCollection('tss_renewals');
  return await col.insertOne({
    ...data,
    status: 'pending',
    createdAt: new Date()
  });
}

export async function getTssRenewals() {
  const col = await getCollection('tss_renewals');
  const data = await col.find({}).sort({ createdAt: -1 }).toArray();
  return serializeData(data);
}

export async function updateTssRenewalStatus(id: string, status: string) {
  const col = await getCollection('tss_renewals');
  return await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );
}

export async function deleteTssRenewal(id: string) {
  const col = await getCollection('tss_renewals');
  return await col.deleteOne({ _id: new ObjectId(id) });
}
