// CHANGE: 2026-10-22 — TypeScript declarations for lib/addons.mjs.
// WHY: TS cannot infer types for a .mjs import; this companion file (the same pattern as
// lib/prices-catalog.d.mts and lib/email-autoreply.d.mts) types the pure-ESM add-ons
// catalogue for Next.js while the Node seed / test scripts import the .mjs directly.

export interface Addon {
  /** Stable id, also the /addons#anchor. */
  id: string;
  /** Display title (rendered on the /addons page). */
  title: string;
  /** Display description (rendered on the /addons page). */
  description: string;
  /** CHANGE: 2026-10-22 — one line on WHEN this add-on fits, used by Sara when advising. */
  useCase?: string;
  /** CHANGE: 2026-10-22 — matching terms so a business problem can be matched to this add-on. */
  keywords?: string[];
}

export const addons: Addon[];
export function getAddonById(id: string): Addon | undefined;
