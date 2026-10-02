'use client';

// CHANGE: 2026-10-02 — client cart state for the real site cart (SP-1 cart build).
// WHY: the cart must survive navigation (localStorage) and its totals must match the DB price
// list, so this provider also owns the GET /api/prices fetch and exposes the resolved
// catalogue to every consumer (pricing rows on silver/gold/tss/tallydrive, the bundle modal,
// the drawer, the popover). "Resolved" means: live list when loaded, the built-in catalogue
// otherwise — so prices are NEVER blank and totals are computable from the first render.
//
// HYDRATION: the persisted cart is read in `useEffect`, NEVER during render — the ConsentBanner
// hydration bug (2026-09-30) is the reason this codebase never reads localStorage during
// render. `hydrated` lets the UI hold a neutral state until the real cart is known.
//
// PERSISTENCE: the write effect is gated on `hydrated`, so the always-empty first render can
// never overwrite a stored cart before it was read.
//
// IMPORTANT: no "/demo" literal — the demo-independence guard scans lib/.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addItem as addItemPure,
  computeTotals,
  removeItem as removeItemPure,
  sanitizeItems,
  setQty as setQtyPure,
  toPriceMap,
  type CartItem,
  type CartTotals,
} from './math';
import { PRICES_FALLBACK } from '../prices-catalog.mjs';
import type { PriceItem } from '../prices-catalog.mjs';

const STORAGE_KEY = 'svd_cart';
/** How long the "added to cart" popover stays open before auto-hiding. */
export const POPOVER_TTL_MS = 8000;

export type AddBlockReason = 'unknown' | 'unpriced' | 'inactive';

export interface AddResult {
  ok: boolean;
  reason?: AddBlockReason;
  /** The item as priced for the cart (unknown when blocked). */
  item?: PriceItem;
}

export interface CartAddEvent {
  id: number;
  at: number;
  main: string;
  /** Companions that were NOT already in the cart and got added now. */
  addedCompanions: string[];
}

export interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  /** False until the persisted cart has been read. Do not render "empty cart" before this. */
  hydrated: boolean;
  /** Resolved price list (live /api/prices merged with the fallback catalogue). */
  prices: PriceItem[];
  /** False only for the first moment after mount, before the price fetch settles. */
  pricesReady: boolean;
  resolve: (slug: string) => PriceItem | null;
  priceOf: (slug: string) => PriceItem | undefined;
  /** Add one line (qty 1 default). Blocks unpriced/inactive/unknown; fires the popover. */
  add: (slug: string, qty?: number) => AddResult;
  /** Same as add() but does NOT fire the popover — used by the popover's own companion chips. */
  addQuiet: (slug: string, qty?: number) => AddResult;
  /** Amazon-style bundle add: main + chosen companions (already-in-cart are skipped). */
  addBundle: (main: string, companions: string[]) => { addedCompanions: string[] };
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** Popover event — set by every successful add; clear with clearLastAdd(). */
  lastAdd: CartAddEvent | null;
  clearLastAdd: () => void;
  /** Shared drawer open state (navbar button, drawer, popover's View Cart). */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [prices, setPrices] = useState<PriceItem[]>(PRICES_FALLBACK as unknown as PriceItem[]);
  const [pricesReady, setPricesReady] = useState(false);
  const [lastAdd, setLastAdd] = useState<CartAddEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const eventId = useRef(0);

  // The price map used by the pure math lives in a ref so add/setQty callbacks stay stable
  // while still sanitising against the CURRENT catalogue.
  const knownRef = useRef<ReadonlyMap<string, PriceItem>>(toPriceMap(PRICES_FALLBACK as unknown as PriceItem[]));
  const known = useMemo(() => toPriceMap(prices), [prices]);
  knownRef.current = known;

  // 1. Read the persisted cart once, after mount. Never during render — see HYDRATION above.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        const fallbackMap = toPriceMap(PRICES_FALLBACK as unknown as PriceItem[]);
        setItems(sanitizeItems(parsed, fallbackMap));
      }
    } catch {
      // Corrupt JSON, disabled storage, or a privacy mode that throws on access.
      // A broken cart must never take the page down.
    }
    setHydrated(true);
  }, []);

  // 2. Fetch the live price list. On failure (or empty) keep the fallback catalogue — a
  //    price fetch problem must NEVER blank a row or block checkout-amount display.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/prices');
        const data = (await res.json().catch(() => ({}))) as { items?: unknown };
        if (!cancelled && res.ok && Array.isArray(data.items)) {
          const list = data.items as PriceItem[];
          if (list.length) setPrices(list);
        }
      } catch {
        // offline / API down: fallback catalogue already in state
      } finally {
        if (!cancelled) setPricesReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 3. Persist on every change, but only once hydrated (see PERSISTENCE above).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota exceeded or storage disabled — the cart still works for this session.
    }
  }, [items, hydrated]);

  const firePopover = useCallback((main: string, addedCompanions: string[]) => {
    eventId.current += 1;
    setLastAdd({ id: eventId.current, at: Date.now(), main, addedCompanions });
  }, []);

  const resolve = useCallback(
    (slug: string): PriceItem | null => knownRef.current.get(slug) ?? null,
    [],
  );

  const priceOf = useCallback((slug: string): PriceItem | undefined => resolve(slug) ?? undefined, [resolve]);

  const addQuiet = useCallback(
    (slug: string, qty = 1): AddResult => {
      const item = knownRef.current.get(slug);
      if (!item) return { ok: false, reason: 'unknown' };
      if (item.priceStatus === 'unpriced') return { ok: false, reason: 'unpriced', item };
      if (item.priceStatus === 'inactive') return { ok: false, reason: 'inactive', item };
      setItems((prev) => addItemPure(prev, slug, qty, knownRef.current));
      return { ok: true, item };
    },
    [],
  );

  const add = useCallback(
    (slug: string, qty = 1): AddResult => {
      const result = addQuiet(slug, qty);
      if (result.ok) firePopover(slug, []);
      return result;
    },
    [addQuiet, firePopover],
  );

  const addBundle = useCallback(
    (main: string, companions: string[]): { addedCompanions: string[] } => {
      const wanted = [main, ...companions];
      // React 19 Strict Mode (dev) double-invokes state updaters to surface impurity.
      // Pushing into an OUTER array inside the updater would therefore record every
      // companion twice ("+ 4 paired items" for a 2-companion bundle). Instead the
      // updater COMPUTES the additions (a pure function of prev) and ASSIGNS the outer
      // variable — both invocations compute the identical list, so the second write
      // overwrites the first with the same value and the report stays correct.
      let added: string[] = [];
      setItems((prev) => {
        const present = new Set(prev.map((i) => i.slug));
        const addedHere: string[] = [];
        let cursor = prev;
        for (const slug of wanted) {
          if (present.has(slug)) continue;
          const item = knownRef.current.get(slug);
          if (!item || item.priceStatus !== 'priced') continue;
          cursor = addItemPure(cursor, slug, 1, knownRef.current);
          if (slug !== main) addedHere.push(slug);
        }
        added = addedHere;
        return cursor;
      });
      // Compute whether main was already present for the popover copy.
      firePopover(main, added);
      return { addedCompanions: added };
    },
    [firePopover],
  );

  const setQty = useCallback((slug: string, qty: number) => setItems((prev) => setQtyPure(prev, slug, qty, knownRef.current)), []);
  const remove = useCallback((slug: string) => setItems((prev) => removeItemPure(prev, slug, knownRef.current)), []);
  const clear = useCallback(() => {
    setItems([]);
    setLastAdd(null);
  }, []);

  const totals = useMemo(() => computeTotals(items, known), [items, known]);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const clearLastAdd = useCallback(() => setLastAdd(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      hydrated,
      prices,
      pricesReady,
      resolve,
      priceOf,
      add,
      addQuiet,
      addBundle,
      setQty,
      remove,
      clear,
      lastAdd,
      clearLastAdd,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, totals, hydrated, prices, pricesReady, resolve, priceOf, add, addQuiet, addBundle, setQty, remove, clear, lastAdd, clearLastAdd, drawerOpen, openDrawer, closeDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

/** Storage key exported for tests and the checkout page's "start over" control. */
export const CART_STORAGE_KEY = STORAGE_KEY;