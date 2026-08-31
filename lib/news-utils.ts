// CHANGE: 2026-08-31 — Blog/article helpers for the news→blog conversion.
// Pure helpers (no DB): slugification, reading time, excerpts, ISO date parsing, and the
// `enrichNews()` spread that fills the optional NewsItem fields from the legacy admin fields.
// This is what makes the blog scale with the backend admin (sarvadnya-advance): every item the
// admin writes (title/date/category/description/content/link) gets a stable slug + SEO fields
// automatically, so it becomes an indexable article at /news/[slug] with zero admin changes.

import { NewsItem } from './news';

export const DEFAULT_AUTHOR = 'Sarvadnya Infotech LLP';

/** Deterministic URL slug from a title. Lowercases, strips punctuation, collapses whitespace. */
export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'article';
}

/** Short stable tail from a Mongo ObjectId — makes slugs collision-safe without churn. */
export function idTail(id?: unknown): string {
  if (id == null) return '';
  const s = String(id); // _id may still be a raw ObjectId at enrich time — stringify first
  const tail = s.slice(-6).toLowerCase().replace(/[^a-z0-9]/g, '');
  return tail || s.replace(/\D/g, '').slice(-6);
}

/**
 * Resolve the FINAL slug for a news doc:
 * - explicit `doc.slug` wins (lets the admin opt into custom URLs),
 * - otherwise `title-slug` + `-{idTail}` when an id is available (stable even for duplicate titles),
 * - bare `title-slug` when there is no id.
 */
export function resolveSlug(doc: { slug?: string; title?: string; _id?: string; id?: string }): string {
  if (doc.slug) return doc.slug.replace(/^\/+|\/+$/g, '');
  const base = slugifyText(doc.title || '');
  const tail = idTail(doc._id || doc.id);
  return tail ? `${base}-${tail}` : base;
}

/** Approximate read time in minutes (200 wpm, min 1). */
export function readingTime(content: string): number {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Short excerpt (falls back gracefully for short content). */
export function excerptFrom(text: string, max = 150): string {
  const clean = (text || '').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}

/**
 * Best-effort ISO date from the legacy display string ("May 12, 2026").
 * Returns null when unparseable so callers can degrade safely.
 */
export function parseDateIso(date: string): string | null {
  if (!date) return null;
  const t = new Date(date.trim()).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

/** Extract keyword-ish tags from a title + category (lower-cased, de-duplicated, capped). */
export function tagsFrom(title: string, category: string): string[] {
  const words = `${title} ${category}`
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) || [];
  const stop = new Set(['and', 'the', 'for', 'with', 'your', 'that', 'this', 'what', 'you', 'how', 'why', 'every', 'week', 'hours', 'being', 'have']);
  const tags = [...new Set(words)].filter((w) => !stop.has(w)).slice(0, 6);
  return tags.length ? tags : [category.toLowerCase() || 'news'];
}

/**
 * Enrich a raw news doc (legacy/optional fields) into the full NewsItem shape every consumer
 * expects. Pure — does not write to the DB. Callers (getNews, getNewsBySlug) spread this over the doc.
 */
export function enrichNews(doc: any): NewsItem {
  const base: any = { ...(doc || {}) };
  const slug = resolveSlug(base);
  const excerpt = base.excerpt || excerptFrom(base.description || base.content, 160);
  const rtime = typeof base.readingTime === 'number' ? base.readingTime : readingTime(base.content || '');
  const tags = Array.isArray(base.tags) ? base.tags : tagsFrom(base.title || '', base.category || '');
  const author = base.author || DEFAULT_AUTHOR;
  const dateIso = parseDateIso(base.date);

  return {
    ...base,
    slug,
    excerpt,
    readingTime: rtime,
    tags,
    author,
    // Keep the raw date, but expose an ISO variant for SEO/sitemap when it parses.
    ...(dateIso && !base.dateIso ? { dateIso } : {}),
  };
}