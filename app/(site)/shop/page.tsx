import type { Metadata } from 'next';
import Footer from '../../components/Footer';
import ShopBrowser from './shop-browser';
import { TDL_ITEMS, TDL_GROUPS, TDL_CATEGORIES } from '@/lib/tdl-catalog';
import { seoMetadata, breadcrumbJsonLd, SITE_URL } from '@/lib/seo';

// CHANGE: 2026-10-23 — NEW: /shop, the full Tally solution catalogue.
//
// WHY: the owner supplied an Excel list of every TDL, Excel importer, business booster and
// industry module the firm offers and asked for a proper shop page (search, sort, buy, sidebar,
// details, responsive). /addons and /modules stay EXACTLY as they are; this is a separate,
// complete catalogue that happens to overlap ~20 items with /addons.
//
// Built as a server component so the metadata and the structured data are static, with the
// filtering rendered by one client island (./shop-browser.tsx). No database call at all: the
// catalogue is a committed data module (lib/tdl-catalog.mjs), so this page prerenders.
//
// HARD RULES: no prices and no single-user / multi-user split anywhere (owner's instruction).
// "Buy" opens the enquiry form, routed to the existing 'addons' email destination.

const SHOP_PATH = '/shop';

// CHANGE: 2026-10-23 — title shortened to 60 chars and description to 157 chars INCLUDING the
// site suffix, so the new page does not add fresh `npm run check:seo` warnings (the helper
// appends " | Sarvadnya Infotech LLP" and the contact suffix automatically). Same message.
export const metadata: Metadata = seoMetadata({
  title: 'Tally Shop: TDL Add-ons & Importers',
  description:
    '100+ ready-made TDL add-ons, Excel importers, boosters and modules for TallyPrime. Find yours by the problem it solves.',
  path: SHOP_PATH,
  keywords: [
    'tally add-ons',
    'tally tdl',
    'tallyprime tdl',
    'excel to tally import',
    'tally customization',
    'tally modules',
    'tally add-on price',
    'tally certified partner',
  ],
});

export default function ShopPage() {
  // ItemList of the whole catalogue: name + deep link only. No price, no offer, because there
  // is no price on this page to be honest about (see the module header).
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tally TDL add-ons and modules',
    numberOfItems: TDL_ITEMS.length,
    itemListElement: TDL_ITEMS.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.title,
      url: `${SITE_URL}${SHOP_PATH}#${item.slug}`,
    })),
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Shop', path: SHOP_PATH },
  ]);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListLd, breadcrumbLd]) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-6 pt-10 md:px-6 md:pt-12">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -mr-32 -mt-32 right-0 top-0 h-[60%] w-[60%] bg-white/40 blur-[130px]" />
          <div className="absolute -mb-24 -ml-24 bottom-0 left-0 h-[40%] w-[40%] bg-teal-200/30 blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-slate-900/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 backdrop-blur-sm">
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              Tally solution catalogue
            </p>
            <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-[42px]">
              Every Tally add-on we build,
              <span className="block text-[#006569]">in one place</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-slate-600 md:text-[14.5px]">
              Ready-made TDLs, Excel to Tally importers, process boosters and full industry
              modules, all built and supported by a Tally Certified Partner since 2008. Search by
              the problem you have, not by the product name.
            </p>
          </div>

          <dl className="mt-6 flex flex-wrap gap-2.5">
            {[
              { k: 'solutions', v: TDL_ITEMS.length },
              { k: 'categories', v: TDL_CATEGORIES.length },
              { k: 'collections', v: TDL_GROUPS.length },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-xl border border-white/70 bg-white/70 px-3.5 py-2 shadow-sm backdrop-blur-sm"
              >
                <dt className="sr-only">{s.k}</dt>
                <dd className="flex items-baseline gap-1.5">
                  <span className="text-[17px] font-black leading-none text-[#006569]">{s.v}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{s.k}</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 max-w-2xl rounded-xl border border-[#006569]/15 bg-white/60 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-slate-600">
            <strong className="font-bold text-slate-800">How buying works:</strong> every TDL is
            configured for your company and licensed to it, so <em>Buy</em> opens a short enquiry
            and our team sends the quote and the setup plan. Nothing is charged on this page.
          </p>
        </div>
      </section>

      <ShopBrowser />

      <Footer />
    </div>
  );
}
