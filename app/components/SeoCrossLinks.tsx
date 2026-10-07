'use client';

import React from 'react';
import Link from 'next/link';

// CHANGE: 2026-10-07 — Task 5 (SEO internal cross-linking). Compact strip shown
// on the commercial pages (/products/silver, /products/gold, /products/tallydrive,
// /services/tss): "Related reading" links to 2-3 *currently-live* /news articles
// (slugs come from scripts/seed_news.mjs, verified live by scripts/seo-links-test.mjs),
// a link to the /news hub, and "Explore more" cross-links to sibling commercial
// pages so the priced/service hubs reinforce each other.
// Links are rendered as block links with py-1.5 so each target clears the
// 24px WCAG 2.5.8 minimum hit area on touch.

export type SeoCrossLink = {
  href: string;
  label: string;
};

export default function SeoCrossLinks({
  newsLinks,
  exploreLinks,
}: {
  newsLinks: SeoCrossLink[];
  exploreLinks: SeoCrossLink[];
}) {
  return (
    <div className="mt-8 rounded-2xl border border-[#D4EAEA] bg-white p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#006569] mb-3">Related reading</h4>
          <ul className="space-y-1">
            {newsLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block py-1.5 text-sm font-bold text-[#0f5f63] hover:text-[#006569] hover:underline"
                >
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/news"
            className="inline-block py-1.5 text-xs font-bold uppercase tracking-widest text-[#006569] hover:underline"
          >
            More articles on the news hub →
          </Link>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#006569] mb-3">Explore more</h4>
          <ul className="space-y-1">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block py-1.5 text-sm font-bold text-[#0f172a] hover:text-[#006569] hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}