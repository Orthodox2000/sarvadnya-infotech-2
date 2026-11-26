'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// CHANGE: 2026-11-26 — /demo renders the REAL NewsFeed with the real nav/news data. Only the
// chrome layout and the Contact | Careers | cart rail are local to this preview.
import NewsFeed from '@/app/components/NewsFeed';
import { productItems, type ProductSubItem } from '@/lib/product-nav';
import { STATIC_NEWS } from '@/lib/static-site-content';

// CHANGE: 2026-11-26 — recursive items mirror the live Productbar hierarchy; the hover panel
// and the mobile drawer share one renderer (ItemLinks) below.
type Item = { label: string; desc: string; href: string; children?: Item[] };
type Section = { label: string; columns: { heading: string; items: Item[] }[] };

const byLabel = (label: string) => productItems.find((item) => item.label === label);

// CHANGE: 2026-11-26 — the real nav href /products#compare has no target element on /products.
// Demo-only override; the shared product-nav.ts and live Productbar are untouched.
const demoSubItems = (label: string): ProductSubItem[] =>
  (byLabel(label)?.subItems || []).map((sub) => ({
    ...sub,
    href: sub.href === '/products#compare' ? '/products' : sub.href,
  }));

const aiSubItems: ProductSubItem[] = [
  { id: 'ai-chat', label: 'Chat with Sara', href: '/ask-sara', description: 'Your AI sales consultant — instant answers.' },
  { id: 'ai-learn', label: 'Learn with Sara', href: '/learn-sara', description: 'Interactive lessons to master Tally.' },
  { id: 'ai-suggest', label: 'Smart Suggest', href: '/find-solution', description: 'Find the right solution for your business.' },
  { id: 'ai-search', label: 'Site Search', href: '/search', description: 'Search products, services, guides & more.' },
];

const solutionSubItems: ProductSubItem[] = [
  {
    id: 'sol-all',
    label: 'All Solutions',
    href: '/shop',
    description: '107 TDLs, Excel importers, boosters and industry modules.',
    subItems: [
      { id: 'sol-addons', label: 'TDL Add-ons', href: '/shop?group=addon' },
      { id: 'sol-excel', label: 'Excel to Tally', href: '/shop?group=excel' },
      // CHANGE: 2026-11-26 — Document Management was duplicated (also under Business Modules);
      // replaced with the real Bank Import deep link from lib/tdl-catalog.mjs.
      { id: 'sol-bank-import', label: 'Bank Import', href: '/shop#excel-bank-statement-import' },
      { id: 'sol-boosters', label: 'Business Boosters', href: '/shop?group=booster' },
      { id: 'sol-modules', label: 'Industry Modules', href: '/shop?group=module' },
    ],
  },
  { id: 'sol-by-need', label: 'Browse by business need', href: '/shop#shop-filters', description: 'Billing, credit control, stock, reports, Excel import or automation.' },
];

const toItems = (subs: ProductSubItem[]): Item[] =>
  subs.map((sub) => ({
    label: sub.label,
    desc: sub.description || '',
    href: sub.href,
    children: sub.subItems?.length ? toItems(sub.subItems) : undefined,
  }));

const itemMatches = (item: Item, needle: string): boolean =>
  `${item.label} ${item.desc}`.toLowerCase().includes(needle) ||
  (item.children || []).some((child) => itemMatches(child, needle));

const NAV_SECTIONS: Section[] = [
  { label: 'Products', columns: [{ heading: 'Core Tally Products', items: toItems(demoSubItems('Products')) }] },
  { label: 'Modules', columns: [{ heading: 'Modules & Solutions', items: toItems([...(byLabel('Modules')?.subItems || []), ...solutionSubItems]) }] },
  { label: 'AI & Learning', columns: [
    { heading: 'AI Automation', items: toItems(aiSubItems) },
    { heading: 'Learning', items: toItems(byLabel('Learning')?.subItems || []) },
  ] },
  { label: 'Services', columns: [{ heading: 'Enterprise Services', items: toItems(byLabel('Services')?.subItems || []) }] },
  // CHANGE: 2026-11-26 — display label only; the real nav data still uses the "Company" key.
  { label: 'About Us', columns: [{ heading: 'About Us', items: toItems(byLabel('Company')?.subItems || []) }] },
];

const POPULAR_SEARCHES = [
  { label: 'TallyPrime 5.0 Single & Multi-User', kind: 'Product' },
  { label: 'Automated Invoice OCR for Tally', kind: 'AI Module' },
  { label: 'Tally Software Services (TSS) Instant Renewal', kind: 'Service' },
];

const PREVIEW_STYLES = `
  @keyframes demoShimmerSweep {
    0%   { transform: translateX(-120%) skewX(-18deg); }
    100% { transform: translateX(220%) skewX(-18deg); }
  }
  .btn-shimmer { position: relative; overflow: hidden; }
  .btn-shimmer::before {
    content: ''; position: absolute; top: 0; left: 0; width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
    animation: demoShimmerSweep 3.4s infinite ease-in-out; pointer-events: none;
  }
  @keyframes demoFadeSlideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dropdown-enter { animation: demoFadeSlideIn 0.2s ease-out forwards; }
  .nav-link-underline { position: relative; }
  .nav-link-underline::after {
    content: ''; position: absolute; left: 0; bottom: 2px; width: 0%; height: 2px;
    background-color: #006569; border-radius: 9999px; transition: width 0.22s ease;
  }
  .nav-link-underline:hover::after { width: 100%; }

  /* CHANGE: 2026-11-26 — +5px total (20 -> 25) on the demo news bar only; NewsFeed.tsx stays
     untouched. The imported ticker owns z-[2100], so it is lowered to z-0 inside this relative
     wrapper; that lets the demo-only right badge use the same z-[1010] as the real left badge. */
  [data-demo-news] > div:first-child { height: 25px !important; z-index: 0 !important; }

  /* CHANGE: 2026-11-26 — hide the site chrome and Ask Sara / WhatsApp stack that the (site)
     layout still mounts behind this fixed preview. Live components are unchanged. */
  body[data-demo-preview] [class*="z-[2000]"],
  body[data-demo-preview] [class*="z-[3000]"] { display: none !important; }
`;

function SearchIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
    </svg>
  );
}

// One recursive renderer for both surfaces: hover panel (with descriptions) and mobile drawer
// (compact). CHANGE: 2026-11-26 — replaces two copied nested maps.
function ItemLinks({ items, depth = 0, compact = false, className, onNavigate }: {
  items: Item[]; depth?: number; compact?: boolean; className?: string; onNavigate?: () => void;
}) {
  return (
    // CHANGE: 2026-11-26 — className lets the hover panel pass its grid classes here, so the
    // items remain direct grid children (a wrapper div collapsed them to one column).
    // CHANGE: 2026-11-26 — option gap 1.5 -> 1; the stacked options read too loose.
    <div className={className ?? (compact ? 'space-y-0.5' : 'flex flex-col gap-1')}>
      {items.map((item, index) => {
        const titleClass = compact
          ? undefined
          : depth === 0
            ? 'flex items-center gap-1.5 text-[13px] font-extrabold text-slate-900 transition-colors group-hover/item:text-[#006569]'
            : depth === 1 ? 'text-[12px] font-bold' : 'text-[11px] font-semibold';
        return (
          <div key={`${item.href}-${index}`} className={compact ? undefined : 'flex flex-col gap-1'}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={compact
                ? 'block rounded-md px-2 py-1.5 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-teal-50 hover:text-[#006569]'
                : depth === 0
                  ? 'group/item flex flex-col rounded-lg px-3 py-1.5 transition-colors hover:bg-teal-100'
                  // CHANGE: 2026-11-26 — third-level (nested leaf) options only: py-1.5 -> py-1
                  // so the stacked children stop reading tall. Parent rows keep their padding.
                  : 'block rounded-md px-2 py-1 text-slate-500 transition-colors hover:bg-teal-100 hover:text-[#006569]'}
            >
              {compact ? item.label : (
                <span className={titleClass}>
                  {item.label}
                  {depth === 0 && (
                    <svg className="h-3.5 w-3.5 -translate-x-1 text-[#006569] opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </span>
              )}
              {!compact && depth === 0 && item.desc && (
                <span className="mt-0.5 text-[11px] font-medium leading-tight text-slate-500 group-hover/item:text-[#006569]/70">{item.desc}</span>
              )}
            </Link>
            {item.children && item.children.length > 0 && (
              <div className={compact ? 'ml-3 border-l border-teal-100 pl-2.5' : 'ml-2 border-l border-teal-100 pl-3'}>
                <ItemLinks items={item.children} depth={depth + 1} compact={compact} onNavigate={onNavigate} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

type Toast = { id: number; message: string };
let toastSeq = 0;

export default function ChromePreview() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  // CHANGE: 2026-11-26 — hover state drives ONE full-width panel; search lives inside it.
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [menuQuery, setMenuQuery] = useState('');

  const notify = (message: string) => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2400);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const hadFlag = document.body.hasAttribute('data-demo-preview');
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-demo-preview', '');
    return () => {
      document.body.style.overflow = previousOverflow;
      if (!hadFlag) document.body.removeAttribute('data-demo-preview');
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setActiveSection(null);
        setMenuQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto text-slate-900 antialiased" style={{ backgroundColor: '#FBFAF6' }} aria-label="Two-bar chrome preview">
      <style dangerouslySetInnerHTML={{ __html: PREVIEW_STYLES }} />

      <div className="pointer-events-none fixed bottom-5 right-5 z-[100100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="dropdown-enter pointer-events-auto flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 shadow-lg">
            <span className="h-2 w-2 rounded-full bg-[#006569]" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-[100090] flex items-start justify-center bg-slate-900/45 px-4 pt-24 backdrop-blur-xs" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <SearchIcon className="h-5 w-5 shrink-0 text-[#006569]" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search TallyPrime, TDL modules, GST tools..." className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none" />
              <button type="button" onClick={() => setSearchOpen(false)} className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50">ESC</button>
            </div>
            <div className="mt-3 space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular Searches</p>
              {POPULAR_SEARCHES.map((item) => (
                <button key={item.label} type="button" onClick={() => { notify(`Searching: ${item.label}`); setSearchOpen(false); }} className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-[#006569]">
                  <span>{item.label}</span><span className="text-[10px] text-slate-400">{item.kind}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header
        className="sticky top-0 z-50 w-full border-b border-slate-200/80 text-slate-900 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', backgroundImage: 'linear-gradient(90deg, rgba(254,254,252,1) 0%, rgba(251,250,246,1) 53%, rgba(248,247,240,1) 100%)' }}
        onMouseLeave={() => { setActiveSection(null); setMenuQuery(''); }}
      >
        {/* BAR 1 — the real NewsFeed; only the Contact | Careers | cart rail is demo-only. */}
        <div className="relative flex w-full items-stretch bg-[#006569] text-white">
          {/* CHANGE: 2026-11-26 — the right badge now mirrors the real left badge: absolute
              inside the relative z-[2100] ticker wrapper, z-[1010], gradient-to-l with a solid
              via-[#006569] stop so Contact/Careers/cart stay readable over the marquee. */}
          <div className="relative z-[2100] min-w-0 flex-1" data-demo-news>
            <NewsFeed initialData={STATIC_NEWS} />
            {/* CHANGE: 2026-11-26 — the badge is now fully solid; the fade is a separate strip
                to its left, so no label can land on a transparent part of a gradient. */}
            <div className="absolute right-0 top-0 bottom-0 z-[1010] flex items-center gap-2 bg-[#006569] pl-16 pr-4 text-[11px] font-semibold text-white/90 md:pl-8
             md:pr-6 md:text-sm">
              <span aria-hidden="true" className="pointer-events-none absolute right-full top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-[#006569]" />
              <Link href="/contact" className="cursor-pointer whitespace-nowrap transition-colors hover:text-white">Contact</Link>
              <span className="text-white/35">|</span>
              <Link href="/careers" className="cursor-pointer whitespace-nowrap transition-colors hover:text-white">Careers</Link>
              <span className="text-white/35">|</span>
              <button
                type="button"
                onClick={() => { setCartCount((c) => c + 1); notify('Added to quote/cart'); }}
                aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart, empty'}
                title="Cart & Quote Items"
                className="relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white text-[8px] font-extrabold text-[#006569] ring-1 ring-[#006569]">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BAR 2 — nav + logo. CHANGE: 2026-11-26 — three flex groups keep the logo left,
            the nav and AI button together in the middle, and mobile controls right.
            Logo/wordmark step down with the smaller nav labels at sm/md/lg; xl is live-exact. */}
        <div className="mx-auto flex h-10 w-full max-w-[1400px] items-center pr-3 sm:h-11 md:h-12 lg:h-14 xl:h-16">
          {/* flex-1 absorbs free space so the nav group sits at the right edge. */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="group flex h-full shrink-0 cursor-pointer items-center justify-center transition-transform hover:scale-[1.01]">
              <div className="relative ml-2 block h-full max-w-[120px] shrink-0 opacity-90 transition-opacity group-hover:opacity-100 lg:ml-3 sm:max-w-none xl:max-w-[200px]">
                {/* Live at xl (200x64); smaller at sm/md/lg to track the 12/14px nav text. */}
                <Image src="/TallyCertificate.png" alt="Tally Certified Partner" width={300} height={80} className="h-10 w-auto object-contain sm:h-9 md:h-10 lg:h-11 xl:h-16" priority />
              </div>
              <span className="ml-2 flex items-center justify-center whitespace-nowrap leading-none">
                <span className="text-[11px] font-bold text-slate-900 sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[21px]">
                  Sarvadnya Infotech <span className="font-black">LLP</span>
                </span>
              </span>
            </Link>
          </div>

          {/* AI button sits with the nav items, not at the far right edge. */}
          <div className="flex shrink-0 items-center gap-2 pl-0 pr-0 md:pl-3 md:pr-3 lg:pl-2 xl:gap-4">
            <nav className="hidden items-center lg:flex">
              <ul className="flex items-center gap-0.5 whitespace-nowrap xl:gap-4">
                {NAV_SECTIONS.map((section) => {
                  const isActive = activeSection?.label === section.label;
                  return (
                    <li
                      key={section.label}
                      className="shrink-0"
                      onMouseEnter={() => { setActiveSection(section); setMenuQuery(''); }}
                      onFocus={() => { setActiveSection(section); setMenuQuery(''); }}
                    >
                      <button type="button" className={`nav-link-underline flex cursor-pointer items-center gap-0.5 py-2 text-[12px] font-bold tracking-tight transition-colors xl:gap-1 xl:text-[14px] ${isActive ? 'text-[#006569]' : 'text-slate-700 hover:text-[#006569]'}`}>
                        <span>{section.label}</span>
                        <svg className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 xl:h-4 xl:w-4 ${isActive ? 'rotate-180 opacity-100' : 'opacity-60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <button type="button" onClick={() => notify('Launching AI Smart Suggest Assistant...')} className="btn-shimmer hidden cursor-pointer items-center gap-1 rounded-full border border-teal-200 bg-teal-50/90 px-2 py-2 text-[11px] font-extrabold tracking-wide text-[#006569] transition-all duration-200 hover:bg-teal-100/80 md:inline-flex xl:gap-1.5 xl:px-3">
              <svg className="h-3.5 w-3.5 shrink-0 text-[#006569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span>AI SMART SUGGEST</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <button type="button" onClick={() => setSearchOpen(true)} title="Search Sarvadnya (⌘K)" aria-label="Open search modal" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50/90 text-slate-600 transition-all duration-200 hover:border-[#006569] hover:text-[#006569] md:hidden">
              <SearchIcon />
            </button>
            <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden">
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* ONE mega panel for the hovered category; its search field is the only one in the bar. */}
        {/* CHANGE: 2026-11-26 — panel now matches live Productbar: border border-[#E9F1FA],
            rounded-b-2xl and overflow-hidden (the live panel has square top corners). */}
        {activeSection && (
          <div className={`dropdown-enter absolute left-1/2 top-full z-40 ${activeSection.label === 'Services' || activeSection.label === 'About Us' ? 'w-[50%]' : 'w-[60%]'} -translate-x-1/2 overflow-hidden rounded-b-2xl border border-[#E9F1FA] bg-white/95 shadow-2xl backdrop-blur-xl`}>
            <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006569]">{activeSection.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Search inside this section or browse the items below.</p>
                </div>
                <label className="relative block w-full max-w-sm">
                  <span className="sr-only">Search {activeSection.label}</span>
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#006569]" />
                  <input
                    autoFocus
                    value={menuQuery}
                    onChange={(e) => setMenuQuery(e.target.value)}
                    placeholder={`Search ${activeSection.label}...`}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/90 pl-9 pr-3 text-[12px] text-slate-700 placeholder:text-slate-400 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 lg:grid-cols-4">
                {activeSection.columns.map((column) => {
                  const needle = menuQuery.trim().toLowerCase();
                  const items = needle ? column.items.filter((item) => itemMatches(item, needle)) : column.items;
                  return (
                    <div key={column.heading} className={activeSection.columns.length === 1 ? 'lg:col-span-4' : 'lg:col-span-2'}>
                      <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#006569]">{column.heading}</p>
                      {items.length > 0 ? (
                        <ItemLinks
                          items={items}
                          className={`grid grid-cols-1 gap-x-5 gap-y-3 ${activeSection.label === 'Modules' ? 'sm:grid-cols-2 lg:grid-cols-4' : activeSection.label === 'AI & Learning' ? '' : 'sm:grid-cols-2'}`}
                        />
                      ) : (
                        <p className="rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500">No matches for "{menuQuery}".</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CHANGE: 2026-11-26 — compact mobile drawer uses the same recursive ItemLinks renderer. */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 pb-8 pt-4 text-slate-800 shadow-2xl lg:hidden">
            <div className="grid gap-5 sm:grid-cols-2">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label} className="min-w-0">
                  <p className="mb-1.5 text-[13px] font-extrabold uppercase tracking-wider text-[#006569]">{section.label}</p>
                  <ItemLinks items={section.columns.flatMap((c) => c.items)} compact onNavigate={() => setMobileOpen(false)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <p className="text-sm font-bold text-slate-700">Two-bar chrome preview</p>
          <p className="mt-2 text-xs text-slate-500">Mockup design, real content, no product bar. Scroll to test the sticky rows; hover a category for its menu.</p>
        </div>
        <div className="h-[120vh]" aria-hidden="true" />
      </div>
    </div>
  );
}
