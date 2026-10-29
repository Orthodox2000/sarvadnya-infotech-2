import type { Metadata } from 'next';

// CHANGE: 2026-08-27 — Centralised SEO/config root for the whole site.
// Canonical domain for all metadata, sitemap, robots, canonical + OG URLs.
export const SITE_URL = 'https://sarvadnyainfotech.com';

export const SITE_NAME = 'Sarvadnya Infotech LLP';
export const SITE_TITLE = `${SITE_NAME} — Tally Certified Partner Since 2008`;

export const SITE_CONTACT = {
  email: 'info@sarvadnyainfotech.com',
  phone: '+919821309060',
  // CHANGE: 2026-10-07 — canonical office address (owner: "final and only address everywhere").
  address: '73, Vindhya Commercial Premises, Sector - 11, Plot No - 1, CBD Belapur, Mumbai, Maharashtra',
};

// CHANGE: 2026-09-03 — contact suffix auto-appended to every meta description for SEO.
// CHANGE: 2026-10-07 — canonical office address (owner: "final and only address
// everywhere"); JSON-LD locality corrected Pune -> Mumbai, suffix updated to match.
// CHANGE: 2026-10-13 — location upgraded Mumbai -> Navi Mumbai (the actual city; our office
// is CBD Belapur, Navi Mumbai). Owner ask: every page must carry company name + location +
// SEO keywords WITHOUT changing any visible on-page item. This one line reaches the
// description of every page that calls seoMetadata(). Cost: +5 chars on descriptions that
// were already over the 160 display limit (pre-existing `check:seo` warnings, see log).
export const CONTACT_SUFFIX = ' | Call: +91 9821 309060 | Navi Mumbai';

// CHANGE: 2026-10-13 — site-wide brand + location keywords. Merged into EVERY
// seoMetadata() call (page-specific keywords first, these appended), so a page that
// declares its own keywords — which otherwise REPLACES the parent's metadata keywords in
// Next.js — still carries the company name and both city names. Metadata only, invisible.
export const SITE_KEYWORDS = [
  'Sarvadnya Infotech LLP',
  'Tally certified partner',
  'Tally partner Mumbai',
  'Tally partner Navi Mumbai',
  'Tally partner CBD Belapur',
];

export const SITE_DESCRIPTION =
  'Tally Certified Partner trusted by 1500+ MSMEs. TallyPrime (Silver, Gold, Server), Tally on Cloud, AMC, Tally on WhatsApp, TallyDrive cloud backup, HRMS, TDL customization & corporate training.' + CONTACT_SUFFIX;

const parallelPath = (path: string) =>
  path === '' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// CHANGE: 2026-10-27 — Open Graph / Twitter share image is now declared here.
// WHY: seoMetadata() returns an explicit `openGraph` object, and in Next.js a page-level
// `openGraph` WITHOUT `images` REPLACES the file-based app/opengraph-image.tsx inheritance
// instead of merging with it. Measured: og:image was present on 0 of the 48 seoMetadata()
// pages, while /demo and /cart (which declare no openGraph at all) still carried it — so the
// 2026-10-12 share-image work had been inert site-wide. Declaring `images` makes the share
// card deterministic on every page, and `image` lets a page pass its own artwork (news
// coverImage). Local paths resolve against metadataBase; absolute URLs are used as-is.
const OG_IMAGE_PATH = '/opengraph-image';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
// Keep in sync with `alt` in app/opengraph-image.tsx.
const OG_IMAGE_ALT = 'Sarvadnya Infotech LLP — Tally Certified Partner Since 2008';

const absoluteMedia = (src: string) =>
  /^https?:\/\//i.test(src) ? src : parallelPath(src);

// CHANGE: 2026-08-27 — helper to stamp canonical + OG/Twitter defaults onto Metadata.
// CHANGE: 2026-09-07 — added noindex param to suppress indexing on low-value utility pages.
export function seoMetadata({
  title,
  description,
  path,
  keywords,
  noindex,
  image,
  contactSuffix = true,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  /** CHANGE: 2026-10-27 — optional share image (site-relative path or absolute URL). */
  image?: string;
  /**
   * CHANGE: 2026-10-29 — per-page control of the auto-appended contact CTA.
   * WHY: the same 38-character "| Call: ... | Navi Mumbai" tail was being stamped onto all 49
   * pages, so every snippet in a SERP for our own content pages ended with an identical phone
   * number instead of the actual answer. Owner ruling: "we don't need same content on every, we
   * can keep on contact section and other important pages but optimise for max output."
   * So commercial / high-intent pages keep it (default true), and reference-first surfaces
   * (news, Tally Insights, Learn Sara guides, tools, legal, noindex utilities) set
   * `contactSuffix: false` and spend the whole 160-char budget on their own answer.
   * 38 chars are released per opted-out page.
   */
  contactSuffix?: boolean;
}): Metadata {
  const canonical = parallelPath(path);
  // CHANGE: 2026-08-27 — build the FINAL <title> here and mark it `absolute` so the
  // (site)/layout template never appends a second brand suffix (fixes home-page
  // double "Sarvadnya Infotech LLP"). Titles that already contain the brand are kept.
  const alreadyBranded = title.toLowerCase().includes('sarvadnya infotech');
  const finalTitle = alreadyBranded ? title : `${title} | ${SITE_NAME}`;
  // CHANGE: 2026-09-03 — append contact details to every meta description for SEO visibility.
  // CHANGE: 2026-10-29 — only when the page opts in (see `contactSuffix` above).
  const finalDescription = contactSuffix ? `${description}${CONTACT_SUFFIX}` : description;
  // CHANGE: 2026-10-13 — merge the site-wide brand + location keywords (SITE_KEYWORDS) into
  // whatever this page declared, deduped, page-specific first. Guarantees every page carries
  // the company name, Mumbai / Navi Mumbai / CBD Belapur and the partner terms. Invisible.
  const finalKeywords = [
    ...new Set([...(keywords ?? []), ...SITE_KEYWORDS].map((k) => k.trim()).filter(Boolean)),
  ];
  // CHANGE: 2026-10-27 — share image (see OG_IMAGE_PATH note above). A caller-supplied image
  // has unknown dimensions, so only the default artwork advertises width/height.
  const shareUrl = absoluteMedia(image || OG_IMAGE_PATH);
  const openGraphImages = image
    ? [{ url: shareUrl, alt: finalTitle }]
    : [{ url: shareUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: OG_IMAGE_ALT }];
  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    keywords: finalKeywords,
    alternates: { canonical },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [shareUrl],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export type JsonLd = {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
};

// CHANGE: 2026-08-27 — structured-data builders (AI + search indexing).
export function orgJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: SITE_CONTACT.email,
    telephone: SITE_CONTACT.phone,
    address: { '@type': 'PostalAddress', streetAddress: '73, Vindhya Commercial Premises, Sector - 11, Plot No - 1, CBD Belapur', addressLocality: 'Navi Mumbai', addressRegion: 'MH', addressCountry: 'IN' },
    sameAs: [
      'https://facebook.com/sarvadnyainfotech',
      'https://www.instagram.com/sarvadnya.infotech/',
      'https://linkedin.com/company/sarvadnyainfotech',
      'https://www.youtube.com/@sarvadnyainfotechtally',
    ],
  };
}

export function localBusinessJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    telephone: SITE_CONTACT.phone,
    email: SITE_CONTACT.email,
    priceRange: '₹₹',
    address: { '@type': 'PostalAddress', streetAddress: '73, Vindhya Commercial Premises, Sector - 11, Plot No - 1, CBD Belapur', addressLocality: 'Navi Mumbai', addressState: 'Maharashtra', addressCountry: 'IN' },
    // CHANGE: 2026-10-13 — areaServed widened from the bare 'IN' country code to the actual
    // service area (Mumbai / Navi Mumbai / CBD Belapur + India). Local-SEO signal, invisible.
    areaServed: ['CBD Belapur', 'Navi Mumbai', 'Mumbai', 'IN'],
    // CHANGE: 2026-10-29 — LocalBusiness enrichment (P0 from the claude-seo adoption review).
    // `sameAs` reuses the SAME four social profiles already verified in orgJsonLd(), so the two
    // nodes can never disagree about which accounts are ours. `foundingDate` is the year the
    // site states everywhere ("Tally Certified Partner Since 2008").
    sameAs: [
      'https://facebook.com/sarvadnyainfotech',
      'https://www.instagram.com/sarvadnya.infotech/',
      'https://linkedin.com/company/sarvadnyainfotech',
      'https://www.youtube.com/@sarvadnyainfotechtally',
    ],
    foundingDate: '2008',
    // `hasMap` encodes the SAME canonical address we already publish (the one the /contact page
    // renders), so nothing new is asserted — it only gives crawlers a machine-readable map link.
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      '73, Vindhya Commercial Premises, Sector 11, CBD Belapur, Navi Mumbai, Maharashtra'
    )}`,
    // DELIBERATELY NOT ADDED (needs verified owner data, never invent):
    //   geo { latitude, longitude } and openingHoursSpecification.
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqJsonLd(question: string, answer: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: { '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } },
  };
}

export function breadcrumbJsonLd(items: { name: string; item?: string; path?: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: parallelPath(item.item ?? item.path ?? ''),
    })),
  };
}

// CHANGE: 2026-08-31 — Article/BlogPosting structured data for individual /news/[slug] pages.
// headless/author defaults to the company, publisher = the Organization node. datePublished uses the
// ISO variant when available (falls back to the raw string otherwise, so unparseable dates don't crash).
export function articleJsonLd({
  headline,
  description,
  slug,
  path,
  datePublished,
  dateModified,
  author,
  image,
}: {
  headline: string;
  description: string;
  /** Article slug under /news (the original, and still default, article location). */
  slug?: string;
  /**
   * CHANGE: 2026-10-27 — full site path, for articles that do NOT live under /news.
   * WHY: /tally-insights lesson pages passed their path as `slug`, and this builder prefixes
   * `/news/` unconditionally — producing `url`/`mainEntityOfPage` values like
   * `/news//tally-insights/...`. Google crawled those malformed URLs and reported them in
   * Search Console as failed indexing (10 rows, 23-24 Oct 2026). `path` takes precedence.
   */
  path?: string;
  datePublished?: string | null;
  dateModified?: string | null;
  author?: string;
  image?: string;
}): JsonLd {
  const authorName = author || SITE_NAME;
  const publisherLogo = `${SITE_URL}/logo.png`;
  const articlePath = path || (slug ? `/news/${slug}` : '/news');
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description,
    url: parallelPath(articlePath),
    mainEntityOfPage: parallelPath(articlePath),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(image ? { image } : {}),
    author: { '@type': 'Organization', name: authorName, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: publisherLogo } },
    inLanguage: 'en-IN',
  };
}

// CHANGE: 2026-10-07 — P1 rich results (docs/PERFORMANCE-INCREMENT-PLAN-2026-10-07.md §2E).
// Product/Offer JSON-LD for the priced product pages (/products/silver|gold|tallydrive,
// /services/tss) and the no-price Contact-Sales server page (offer omitted there — never
// invent a price). Prices come from the same resolve()/payable figures the page displays
// (DB-driven with identical-number fallback), so the markup always matches what a visitor
// sees.
//
// CHANGE: 2026-10-26 — NO `aggregateRating` on any Product node, and no LocalBusiness rating
// node either. Every star count on the site used to be typed by hand (4.8/120, 4.7/85,
// 4.9/34 ...) and none of them could be traced to real review records, so they were all
// removed (owner: "remove rating as most of them are fake, we only have testimonials and user
// rating as real, also ensure those dashboard rating and auto moving and not manual").
// Structured data may only state a rating that real reviews support, and no per-product review
// data exists, so the honest value here is: omit it. The one rating the site does display is
// computed from live reviews by `lib/rating-summary.mjs` and rendered by the review wall; it is
// NOT marked up as aggregateRating because it is site-wide, not per-product.
//
// CHANGE: 2026-10-26 — Google Search Console structured-data cleanup. Three Offer fields are
// intentionally and permanently OMITTED on this site, so do not "fix" them back in:
//   • `hasMerchantReturnPolicy` — licences ARE returnable in limited cases, but there is no
//     time limit and no cooling-off period, and the owner's rule is that the return policy is
//     never published to customers. `MerchantReturnNotPermitted` would be a lie and
//     `merchantReturnDays` cannot be filled honestly, so the field stays absent. The cost is
//     only a GSC *recommendation* (merchant listing), not an error — price snippets still work.
//   • `shippingDetails` — every sellable item is a digital licence / subscription delivered by
//     email, so there is no physical shipment to describe.
//   • `priceValidUntil` — awaiting the owner's pricing window; never guess a date.
// `itemCondition` IS emitted (NewCondition): it is recommended, true for licence sales, and
// costs nothing to be accurate about.
export function productJsonLd({
  name,
  description,
  url,
  image,
  sku,
  brand,
  offers,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  sku?: string;
  brand?: string;
  offers?: {
    /** Total payable in rupees INCLUDING GST as displayed on the page (e.g. 26550 for Silver). */
    priceRupees: number;
    priceCurrency?: string;
    availability?: string;
    itemOffered?: string;
  }[];
}): JsonLd {
  const offerNodes = offers?.length
    ? offers.map((o) => ({
        '@type': 'Offer',
        ...(o.itemOffered ? { name: o.itemOffered } : {}),
        price: String(o.priceRupees),
        priceCurrency: o.priceCurrency || 'INR',
        availability: o.availability || 'https://schema.org/InStock',
        // CHANGE: 2026-10-26 — licences/subscriptions are always new stock, never used.
        itemCondition: 'https://schema.org/NewCondition',
        url: parallelPath(url),
        seller: { '@type': 'Organization', name: SITE_NAME },
      }))
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: parallelPath(url),
    ...(image ? { image } : {}),
    ...(sku ? { sku } : {}),
    brand: { '@type': 'Brand', name: brand || 'Tally Solutions' },
    ...(offerNodes ? { offers: offerNodes.length === 1 ? offerNodes[0] : offerNodes } : {}),
  };
}

// CHANGE: 2026-10-07 — multi-question FAQPage builder (P1 §2E.2). The single-Q faqJsonLd()
// above is kept for legacy callers. Google requires the questions to be VISIBLE on the page;
// callers render the same array as the on-page FAQ section.
export function faqPageJsonLd(faqs: { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// CHANGE: 2026-10-07 — LocalBusiness variant carrying the aggregate rating displayed on
// /contact (4.9★ / 34 reviews). Review items are deliberately NOT emitted — the page shows
// only the aggregate, so individual Review nodes would be fabricated.
// CHANGE: 2026-10-26 — DELETED. The 4.9/34 figure was hand-typed and unsupported by review
// records, so both the visible block on /contact and this builder were removed. The current
// localBusinessJsonLd() (address, phone, areaServed) carries no rating at all.
