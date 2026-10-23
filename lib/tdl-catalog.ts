// CHANGE: 2026-10-23 — NEW: typed facade over the pure-ESM /shop catalogue.
// Same pattern as lib/addons.ts over lib/addons.mjs. The data lives in the .mjs so the chat
// route, the offline Sara fallback and the plain-Node test suites share ONE list with the page.
//
// NOTE: there is no price field anywhere in this catalogue, by the owner's explicit instruction
// ("never mention or display prices from the Excel"). Do not add one.

export type { TdlItem, TdlGroup, TdlCategory, TdlGroupId, TdlCategoryId } from './tdl-catalog.mjs';
export {
  TDL_ITEMS,
  TDL_GROUPS,
  TDL_CATEGORIES,
  TDL_FEATURED,
  getTdlItem,
  getGroupLabel,
  getCategoryLabel,
} from './tdl-catalog.mjs';
