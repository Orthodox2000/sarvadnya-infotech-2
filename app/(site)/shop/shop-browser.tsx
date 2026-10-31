'use client';

// CHANGE: 2026-10-23 — NEW: the /shop catalogue browser.
//
// WHY: the owner's Excel list (100+ TDLs, Excel importers, boosters and industry modules) had no
// public home. /addons stays exactly as it is (20 items, unchanged); this is the full catalogue.
// Everything is client-side: one committed data module (lib/tdl-catalog.mjs) filtered in memory,
// so search and sort are instant and there is no API round trip.
//
// RULES BAKED IN:
//   - NO PRICES anywhere (the source sheet's price columns were dropped at extraction time).
//   - "Buy" is a quote request: it opens UnifiedContactModal prefilled and routed to the
//     existing 'addons' destination (a new destination would silently email nobody).
//   - Only the first 24 cards render; "Show more" adds 24. 107 cards at once is heavy on the
//     low-end phones this site targets.

import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
// CHANGE: 2026-10-29 — removed `import { isGatewayConfigured } from '@/lib/cart/payment'`.
// WHY: that module is SERVER-ONLY (it imports `node:crypto` and the Razorpay SDK and reads
// `RAZORPAY_KEY_SECRET`). Importing it into this client island pulled `node:crypto` into the
// browser bundle and broke `next build` outright ("UnhandledSchemeError: Reading from
// node:crypto is not handled by plugins"). It could never have worked either: the gate reads
// `process.env.RAZORPAY_KEY_ID`, which is not a NEXT_PUBLIC_ variable and is therefore
// `undefined` in the browser, so it always returned false. Shop items are quote requests and
// carry no prices by rule (AGENTS §29), so the static "Get Quote" label is the correct one.
import {
  TDL_ITEMS,
  TDL_GROUPS,
  TDL_CATEGORIES,
  TDL_FEATURED,
  type TdlItem,
  type TdlCategoryId,
  type TdlGroupId,
} from '@/lib/tdl-catalog';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';
import NeedsWizard from './needs-wizard';

const PAGE_SIZE = 24;

type SortKey = 'recommended' | 'az' | 'za' | 'group';

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'az', label: 'Name A to Z' },
  { id: 'za', label: 'Name Z to A' },
  { id: 'group', label: 'By type' },
];

const GROUP_TONE: Record<TdlGroupId, string> = {
  addon: 'bg-teal-50 text-[#045A57] border-teal-100',
  excel: 'bg-[#EEF3FB] text-[#274c77] border-[#D8E3F3]',
  booster: 'bg-[#FBF3E4] text-[#8a5a12] border-[#F0E2C6]',
  module: 'bg-[#F3EEF9] text-[#5b3d84] border-[#E4D9F2]',
};

function groupLabel(id: TdlGroupId) {
  return TDL_GROUPS.find((g) => g.id === id)?.label ?? id;
}

function categoryLabel(id: TdlCategoryId) {
  return TDL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// ---------------------------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------------------------
const ShopCard = memo(function ShopCard({
  item,
  expanded,
  onToggle,
  onBuy,
  onAsk,
}: {
  item: TdlItem;
  expanded: boolean;
  onToggle: (slug: string) => void;
  onBuy: (item: TdlItem) => void;
  onAsk: (item: TdlItem) => void;
}) {
  const detailId = `detail-${item.slug}`;
  return (
    <article
      id={item.slug}
      className={`scroll-mt-32 group relative flex h-full flex-col rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#006569]/40 p-4 ${
        expanded ? 'border-[#006569]/60 ring-1 ring-[#006569]/10' : 'border-slate-200'
      }`}
    >
      {/*
        CHANGE: 2026-10-30 — the "Best Seller" tag moved OUT of the card and now sits fully
        above it (owner: "move out of box on top", "redesign it properly").
        WHY: the old pill was `-top-2 right-3`, i.e. it straddled the card's own top border and
        covered the first row of group/category chips on narrow cards. It is now anchored with
        `bottom-full`, so its bottom edge stops at the card's top border and nothing inside the
        card is ever obscured; a small rotated square acts as a pointer down to the card so the
        tag still reads as belonging to it. The card grid gained `gap-y-6` (was a uniform
        `gap-3`) to reserve the ~20px of vertical room the tag needs, so tags never collide with
        the row above. `pointer-events-none` keeps the decoration out of the click target.
      */}
      {item.featured && (
        <span className="pointer-events-none absolute bottom-full right-2 z-10 mb-1.5 inline-flex items-center gap-1 rounded-md bg-gradient-to-b from-[#00747a] to-[#00565a] px-2 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-white shadow-[0_2px_6px_rgba(0,101,105,0.30)] ring-1 ring-[#004a4d]/25">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 fill-current"
          >
            <path d="M12 2.5l2.9 6.06 6.6.86-4.85 4.55 1.22 6.53L12 17.3l-5.87 3.2 1.22-6.53L2.5 9.42l6.6-.86L12 2.5z" />
          </svg>
          Best Seller
          <span
            aria-hidden="true"
            className="absolute -bottom-[3px] right-2.5 h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#00565a]"
          />
        </span>
      )}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${GROUP_TONE[item.group]}`}>
          {groupLabel(item.group)}
        </span>
        <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
          {categoryLabel(item.category)}
        </span>
      </div>

      <h3 className="text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#006569] line-clamp-2">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-slate-600">{item.summary}</p>

      {item.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <li key={t} className="rounded-md bg-[#F4F6F4] px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500">
              {t}
            </li>
          ))}
        </ul>
      )}

      {/* Detail panel — expands in place so the deep link (#slug) always lands on real content. */}
      <div
        id={detailId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          expanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <div className="rounded-xl border border-slate-200 bg-[#FAFBF8] p-3.5">
            {item.detail.length > 0 ? (
              <ul className="space-y-1.5">
                {item.detail.map((d) => (
                  <li key={d} className="flex gap-2 text-[12px] leading-relaxed text-slate-600">
                    <svg className="mt-[3px] h-3 w-3 shrink-0 text-[#006569]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] leading-relaxed text-slate-600">
                Configured around your voucher types during implementation, so it fits the way your team already works.
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => onAsk(item)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#006569]/30 bg-white px-3 py-1.5 text-[11px] font-bold text-[#006569] transition-colors hover:bg-teal-50"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                Ask AI Consultant Sara
              </button>
              <span className="text-[11px] text-slate-400">Tally vetted, set up by our team</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => onToggle(item.slug)}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 px-3 text-[11.5px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          {expanded ? 'Hide details' : 'Details'}
        </button>
        <button
          type="button"
          onClick={() => onBuy(item)}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#006569] px-3 text-[11.5px] font-semibold text-white shadow-sm transition-all hover:bg-[#045A57] active:scale-[0.98]"
          aria-label={`Get quote for ${item.title}`}
        >
          Get Quote
        </button>
      </div>
    </article>
  );
});

// ---------------------------------------------------------------------------------------------
// Browser
// ---------------------------------------------------------------------------------------------
export default function ShopBrowser() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<TdlGroupId | 'all'>('all');
  const [category, setCategory] = useState<TdlCategoryId | 'all'>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [modal, setModal] = useState<{ isOpen: boolean; type: FormType; service: string }>({
    isOpen: false,
    type: 'enquire',
    service: '',
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // CHANGE: 2026-10-23 — deep links (?q=, ?category=, ?group=, #slug) are read ONCE on mount.
  // Reading them during render would desync SSR/hydration.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const cat = params.get('category');
      const grp = params.get('group');
      if (q) setQuery(q);
      if (cat && TDL_CATEGORIES.some((c) => c.id === cat)) setCategory(cat as TdlCategoryId);
      if (grp && TDL_GROUPS.some((g) => g.id === grp)) setGroup(grp as TdlGroupId);

      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const item = TDL_ITEMS.find((i) => i.slug === hash);
        if (item) {
          setQuery('');
          setCategory('all');
          setGroup('all');
          setFeaturedOnly(false);
          setOpenSlug(item.slug);
          setVisible(TDL_ITEMS.length);
          // let the full list paint before scrolling to it
          window.setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }, 120);
        }
      }
    } catch {
      /* URL parsing must never break the page */
    }
  }, []);

  // Keep the address bar shareable without triggering a Next router navigation.
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category !== 'all') params.set('category', category);
      if (group !== 'all') params.set('group', group);
      const qs = params.toString();
      const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', next);
    } catch {
      /* no-op */
    }
  }, [query, category, group]);

  // Any filter change restarts paging (otherwise "Show more" keeps a stale window).
  // CHANGE: 2026-10-23 — SKIP the mount run. The deep-link effect above (which imports a hash
  // from Ask Sara, the nav, or a search result) sets `visible` to the whole catalogue so the
  // target card is guaranteed to be in the DOM; a mount-time reset here used to immediately
  // overwrite that with 24, so a link to any item outside the first page landed on nothing.
  const pagingReady = useRef(false);
  useEffect(() => {
    if (!pagingReady.current) {
      pagingReady.current = true;
      return;
    }
    setVisible(PAGE_SIZE);
  }, [query, category, group, featuredOnly, sort]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = TDL_ITEMS.filter((item) => {
      if (group !== 'all' && item.group !== group) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (featuredOnly && !item.featured) return false;
      if (!q) return true;
      // keywords are searchable but never rendered (they exist for discovery)
      const haystack = [item.title, item.summary, item.detail.join(' '), item.tags.join(' '), item.keywords.join(' ')]
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });

    if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'za') list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    else if (sort === 'group') {
      const order = { addon: 0, excel: 1, booster: 2, module: 3 } as const;
      list = [...list].sort((a, b) => order[a.group] - order[b.group] || a.title.localeCompare(b.title));
    } else {
      // recommended: highlighted items first, otherwise the catalogue order
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [query, group, category, featuredOnly, sort]);

  const shown = results.slice(0, visible);
  const activeFilters =
    (group !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0) + (featuredOnly ? 1 : 0) + (query.trim() ? 1 : 0);

  const toggleOpen = useCallback((slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  }, []);

  const handleBuy = useCallback((item: TdlItem) => {
    setModal({ isOpen: true, type: 'enquire', service: `Shop: ${item.title}` });
  }, []);

  const handleAsk = useCallback((item: TdlItem) => {
    // Sara is a consultant: the question asks for a fit check rather than dumping a description.
    import('@/lib/ask-sara')
      .then(({ askSara }) =>
        askSara(
          `I am interested in "${item.title}" (${categoryLabel(item.category)}). Before you explain it, ask me two questions about my business so you can tell me whether it actually fits.`,
        ),
      )
      .catch(() => {
        /* if the chat bundle is unavailable, fall back to the enquiry form */
        setModal({ isOpen: true, type: 'enquire', service: `Shop: ${item.title}` });
      });
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setGroup('all');
    setCategory('all');
    setFeaturedOnly(false);
    setSort('recommended');
    searchRef.current?.focus();
  }, []);

  const jumpTo = useCallback((slug: string) => {
    setQuery('');
    setGroup('all');
    setCategory('all');
    setFeaturedOnly(false);
    setVisible(TDL_ITEMS.length);
    setOpenSlug(slug);
    window.setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 80);
  }, []);

  const searchField = (
    <div className="relative">
      <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
      </svg>
      <input
        ref={searchRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search: invoice, credit, WhatsApp, Excel…"
        aria-label="Search the shop"
        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
      />
    </div>
  );

  const filterBody = (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[10.5px] font-black uppercase tracking-[0.14em] text-slate-400">Type</p>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => setGroup('all')}
              aria-pressed={group === 'all'}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                group === 'all' ? 'bg-[#006569] text-white' : 'text-slate-600 hover:bg-teal-50 hover:text-[#006569]'
              }`}
            >
              <span>All solutions</span>
              <span className={group === 'all' ? 'text-white/70' : 'text-slate-400'}>{TDL_ITEMS.length}</span>
            </button>
          </li>
          {TDL_GROUPS.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setGroup(g.id)}
                aria-pressed={group === g.id}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                  group === g.id ? 'bg-[#006569] text-white' : 'text-slate-600 hover:bg-teal-50 hover:text-[#006569]'
                }`}
              >
                <span>{g.label}</span>
                <span className={group === g.id ? 'text-white/70' : 'text-slate-400'}>{g.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-[10.5px] font-black uppercase tracking-[0.14em] text-slate-400">What it does</p>
        <ul className="max-h-[19rem] space-y-0.5 overflow-y-auto pr-1 lg:max-h-none">
          <li>
            <button
              type="button"
              onClick={() => setCategory('all')}
              aria-pressed={category === 'all'}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                category === 'all' ? 'bg-teal-50 text-[#006569]' : 'text-slate-600 hover:bg-teal-50 hover:text-[#006569]'
              }`}
            >
              <span>Every category</span>
              <span className="text-slate-400">{TDL_ITEMS.length}</span>
            </button>
          </li>
          {TDL_CATEGORIES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                  category === c.id ? 'bg-teal-50 text-[#006569]' : 'text-slate-600 hover:bg-teal-50 hover:text-[#006569]'
                }`}
              >
                <span className="leading-tight">{c.label}</span>
                <span className="shrink-0 text-slate-400">{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-[#FAFBF8] px-3 py-2.5">
        <input
          type="checkbox"
          checked={featuredOnly}
          onChange={(e) => setFeaturedOnly(e.target.checked)}
          className="h-4 w-4 accent-[#006569]"
        />
        <span className="text-[12px] font-bold text-slate-700">Popular only</span>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">{TDL_FEATURED.length}</span>
      </label>

      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11.5px] font-bold text-slate-500 transition-colors hover:border-[#006569] hover:text-[#006569]"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-7">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 lg:hidden">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-expanded={filtersOpen}
                  aria-controls="shop-filters"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-[12px] font-bold text-slate-700"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
                  </svg>
                  Filters
                  {activeFilters > 0 && (
                    <span className="rounded-full bg-[#006569] px-1.5 py-0.5 text-[10px] font-black text-white">{activeFilters}</span>
                  )}
                </button>
                <button type="button" onClick={clearAll} className="text-[11px] font-bold text-slate-400 hover:text-[#006569]">
                  Reset
                </button>
              </div>

              {/* Mobile: collapsible. Desktop: own scroll so it doesn't grow the page. */}
              <div
                id="shop-filters"
                className={`grid transition-[grid-template-rows] duration-300 ease-out lg:block ${
                  filtersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden lg:overflow-visible">
                  <div className="px-3 pb-3 pt-3 lg:pt-3 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
                    {searchField}
                    <div className="mt-4">{filterBody}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div ref={resultsRef} className="mt-5 min-w-0 lg:mt-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12.5px] font-bold text-slate-500" aria-live="polite">
                {activeFilters === 0 ? (
                  <>{TDL_ITEMS.length} solutions in the catalogue</>
                ) : (
                  <>
                    {results.length} {results.length === 1 ? 'result' : 'results'} of {TDL_ITEMS.length}
                  </>
                )}
              </p>
              <label className="flex items-center gap-2 text-[11.5px] font-semibold text-slate-500">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-[12px] font-bold text-slate-700 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-5 py-14 text-center">
                <p className="text-[15px] font-bold text-slate-700">Nothing matches that search.</p>
                <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-slate-500">
                  Try a simpler word like &ldquo;invoice&rdquo;, &ldquo;stock&rdquo; or &ldquo;Excel&rdquo;. If it genuinely does not exist
                  yet, we build custom TDLs too.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-full border border-slate-300 px-4 py-2 text-[12px] font-bold text-slate-600 hover:border-[#006569] hover:text-[#006569]"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ isOpen: true, type: 'callback', service: `Custom TDL requirement: ${query || 'not in the catalogue'}` })}
                    className="rounded-full bg-[#006569] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#045A57]"
                  >
                    Request a custom build
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* CHANGE: 2026-10-30 — `gap-y-6` (24px) instead of a uniform 12px gap: the
                    "Best Seller" tag now sits fully ABOVE the card, so each row needs that
                    vertical room or the tag of one row would overlap the card above it. */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {shown.map((item) => (
                    <ShopCard
                      key={item.slug}
                      item={item}
                      expanded={openSlug === item.slug}
                      onToggle={toggleOpen}
                      onBuy={handleBuy}
                      onAsk={handleAsk}
                    />
                  ))}
                </div>

                {visible < results.length && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className="rounded-full border border-[#006569]/30 bg-white px-6 py-2.5 text-[12.5px] font-bold text-[#006569] transition-colors hover:bg-teal-50"
                    >
                      Show {Math.min(PAGE_SIZE, results.length - visible)} more
                    </button>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Showing {shown.length} of {results.length}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Needs wizard — the "not sure what you need" path */}
            <NeedsWizard
              onAsk={(question) => {
                import('@/lib/ask-sara')
                  .then(({ askSara }) => askSara(question))
                  .catch(() => setModal({ isOpen: true, type: 'callback', service: question }));
              }}
              onSendToTeam={(message) => setModal({ isOpen: true, type: 'callback', service: message })}
            />
          </div>
        </div>
      </div>

      <UnifiedContactModal
        isOpen={modal.isOpen}
        onClose={() => setModal((m) => ({ ...m, isOpen: false }))}
        type={modal.type}
        prefillService={modal.service}
        destination="addons"
      />
    </>
  );
}
