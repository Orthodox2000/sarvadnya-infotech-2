// CHANGE: 2026-08-21 — NEW: static catalog of Tally TDL add-ons for /addons page + Productbar "Addons" column.
// CHANGE: 2026-08-21 — Trimmed to top 20 most-demanded add-ons (per client request) from the initial 73-item list.
//
// CHANGE: 2026-10-22 — This file is now a thin TYPED FACADE over the pure-ESM source of truth
// lib/addons.mjs (same pattern as lib/prices.ts over lib/prices-catalog.mjs).
// WHY: the owner asked Sara to know the add-ons "with details" so she can suggest them; the
// chat route, the offline fallback and the plain-Node test suites all need the SAME list, so
// it must not be duplicated. The .mjs holds the data; this file only adds the TS conveniences
// the app needs (`Addon` type, typed `addons` array, `getAddonById`).
// The public exports are unchanged, so `import { addons, type Addon } from '@/lib/addons'`
// (app/(site)/addons/page.tsx) and `import { getAddonById } from '@/lib/addons'`
// (app/components/cart/CartDrawer.tsx) keep working exactly as before.

export type { Addon } from './addons.mjs';
export { addons, getAddonById } from './addons.mjs';
