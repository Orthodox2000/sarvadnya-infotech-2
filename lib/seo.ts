import type { Metadata } from 'next';

// CHANGE: 2026-08-27 — Centralised SEO/config root for the whole site.
// Canonical domain for all metadata, sitemap, robots, canonical + OG URLs.
export const SITE_URL = 'https://sarvadnyainfotech.com';

export const SITE_NAME = 'Sarvadnya Infotech LLP';
export const SITE_TITLE = `${SITE_NAME} — Certified Tally Partner Since 2008`;
export const SITE_DESCRIPTION =
  'Certified Tally Partner trusted by 1500+ MSMEs. TallyPrime (Silver, Gold, Server), Tally on Cloud, AMC, Tally on WhatsApp, TallyDrive cloud backup, HRMS, TDL customization & corporate training.';

export const SITE_CONTACT = {
  email: 'info@sarvadnyainfotech.com',
  phone: '+919821309060',
  address: 'Pune, Maharashtra, India',
};

const parallelPath = (path: string) =>
  path === '' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// CHANGE: 2026-08-27 — helper to stamp canonical + OG/Twitter defaults onto Metadata.
export function seoMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const canonical = parallelPath(path);
  // CHANGE: 2026-08-27 — build the FINAL <title> here and mark it `absolute` so the
  // (site)/layout template never appends a second brand suffix (fixes home-page
  // double "Sarvadnya Infotech LLP"). Titles that already contain the brand are kept.
  const alreadyBranded = title.toLowerCase().includes('sarvadnya infotech');
  const finalTitle = alreadyBranded ? title : `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: finalTitle },
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: finalTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
    },
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
    address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressRegion: 'MH', addressCountry: 'IN' },
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
    address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressState: 'Maharashtra', addressCountry: 'IN' },
    areaServed: 'IN',
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

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: parallelPath(item.path),
    })),
  };
}
