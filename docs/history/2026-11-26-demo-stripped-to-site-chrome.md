# 2026-11-26 — `/demo` main page stripped to the three chrome bars

## Why

Owner (typos preserved):

> "fremove /demo items and just kep navbar prodvtbar and newsbar for testing and redevelopement"

Scope was ambiguous, so it was confirmed before editing: **strip only the main `/demo` page** to
NewsFeed + Navbar + Productbar (a blank canvas under the chrome); **leave `/demo/checkout` and its
success/cancel children intact**.

## Changes

### 1. `app/(site)/demo/page.tsx`

- Removed the `ProductCard` grid (`lib/demo/catalog` items), the `CartSummary` aside, the
  "Cart test harness" header and the "Book a real demo" link.
- The page now renders a single empty `<main className="min-h-screen bg-[#FBFAF6]" />`. The three
  bars are inherited from `app/(site)/layout.tsx` — nothing in this route re-mounts them.
- `metadata.robots = { index: false, follow: false }` is kept: the route stays test-only and
  never becomes indexable content. `robots.ts` / sitemap exclusions are untouched.

### 2. `app/components/demo/DemoScopeBanner.tsx`

- Added `usePathname()` and an early `return null` when the pathname is **exactly `/demo`**.
  Segment-exact on purpose: a `startsWith('/demo')` would also suppress the notice on the checkout
  routes, where a test payment can still be triggered.
- The banner still mounts from `app/(site)/demo/layout.tsx`, so it keeps rendering on
  `/demo/checkout`, `/demo/checkout/success` and `/demo/checkout/cancel`. Keeping it in the layout
  (rather than moving it into each page) also preserves the `@media print` behaviour on the success
  receipt: the notice stays outside `.demo-receipt-page` and is still excluded from the PDF.

### 3. `app/(site)/demo/layout.tsx`

- Comment corrected — the old note said the banner appears on *every* `/demo` page; it now describes
  the pathname gate. `CartProvider` stays: the navbar cart button and the checkout subtree still
  consume it.

## Deliberately not touched

- `app/components/demo/ProductCard.tsx` and `app/(site)/demo/CartSummary.tsx` are now unreferenced
  but were **left on disk** — they are the natural starting point for the owner's redevelopment.
  No import of either remains, so they add no bundle weight to `/demo`.
- `/api/demo/*`, `lib/demo/*`, `assertTestKeys()` isolation, `check:demo` guard, test-key mode lock,
  and all checkout pages are unchanged. The payment harness is intact and still test-only.
- No build, dev server, typecheck or static guard was run (single-turn code-generation mode; the
  change is confined to a noindex test route). Re-run `npm run check:demo` and `npm run typecheck`
  before any deploy if desired.

## Result

- `/demo` → NewsFeed + Navbar + Productbar, blank body.
- `/demo/checkout*` → unchanged, including the test-mode warning banner.
