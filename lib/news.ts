// CHANGE: 2026-08-31 — NewsItem extended for the blog/article system. New fields are OPTIONAL so the
// backend admin (sarvadnya-advance) can keep writing only the legacy fields (title/date/category/
// description/content/link); the frontend auto-derives slug/excerpt/readingTime/tags/author via
// lib/news-utils.ts enrich(). Explicit values (e.g. a custom slug or seoTitle) are honored when set.
export type NewsItem = {
  id?: string;
  _id?: string;
  title: string;
  date: string;            // Date display string, e.g. "May 12, 2026" (parsed to ISO for SEO when possible)
  category: string;
  description: string;
  content: string;         // Article body — paragraphs separated by blank lines
  link?: string;           // Optional related-page link (used as an in-article CTA; NOT the card target anymore)

  // Blog/SEO fields (optional — auto-derived from the above when absent)
  slug?: string;           // URL slug; explicit > auto-derived (title-slug + id tail)
  seoTitle?: string;       // Overrides the <title>/H1 keyword treatment when set
  seoDescription?: string; // Overrides the meta description when set
  excerpt?: string;        // Short teaser (derived from description/content when absent)
  readingTime?: number;    // Read minutes (derived when absent)
  tags?: string[];         // Derived from title words + category when absent
  author?: string;         // Defaults to the company name when absent
  coverImage?: string;
};