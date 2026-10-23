// CHANGE: 2026-10-23 — TypeScript declarations for lib/tdl-catalog.mjs.
// Same pattern as lib/addons.d.mts / lib/prices-catalog.d.mts: TypeScript cannot infer types for
// a .mjs import, and the plain-Node scripts import the .mjs directly.

export type TdlGroupId = 'addon' | 'excel' | 'booster' | 'module';

export type TdlCategoryId =
  | 'sales'
  | 'purchase'
  | 'inventory'
  | 'accounts'
  | 'print'
  | 'security'
  | 'automation'
  | 'data'
  | 'industry';

export interface TdlItem {
  /** Stable id and deep-link anchor: /shop#<slug>. */
  slug: string;
  /** Alias of slug (mirrors lib/addons.mjs). */
  id: string;
  /** Display title. */
  title: string;
  /** What the item does. */
  category: TdlCategoryId;
  /** Which sheet of the owner's list it came from. */
  group: TdlGroupId;
  /** One plain-language sentence for the card. */
  summary: string;
  /** Extra bullets for the detail panel (may be empty). */
  detail: string[];
  /** Short chips (2-3 words). */
  tags: string[];
  /** Matching terms used by Ask Sara / Learn Sara. Never rendered. */
  keywords: string[];
  /** Highlighted in the shop's featured strip. */
  featured: boolean;
  /** Deep link: /shop#<slug>. */
  href: string;
}

export interface TdlGroup {
  id: TdlGroupId;
  label: string;
  blurb: string;
  count: number;
}

export interface TdlCategory {
  id: TdlCategoryId;
  label: string;
  count: number;
}

/** Every item, in catalogue order. NOTE: no price field exists anywhere by design. */
export const TDL_ITEMS: TdlItem[];
export const TDL_GROUPS: TdlGroup[];
export const TDL_CATEGORIES: TdlCategory[];
export const TDL_FEATURED: TdlItem[];
export function getTdlItem(slug: string): TdlItem | undefined;
export function getGroupLabel(id: string): string;
export function getCategoryLabel(id: string): string;
