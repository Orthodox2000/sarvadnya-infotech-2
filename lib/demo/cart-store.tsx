'use client';

// CHANGE: 2026-10-02 — client cart state for the /demo cart scaffold (SP-1).
// WHY: `localStorage` persistence matches the repo's existing `svd_*` key pattern
// (svd_consent_notice, svd_vid) and keeps the demo dependency-free.
//
// HYDRATION: the persisted cart is read in `useEffect`, NEVER during render. Reading
// localStorage during render is what caused the ConsentBanner hydration bug on
// 2026-09-30 — the server HTML says "empty cart" and the client's first paint would say
// otherwise, so React discards the tree. `hydrated` lets the UI hold a neutral state
// until the real cart is known, rather than flashing an empty cart that isn't.
//
// PERSISTENCE: the write effect is gated on `hydrated`. Without that gate the first render
// (always an empty cart) would immediately overwrite the stored cart before it was ever read.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  addItem as addItemPure,
  computeTotals,
  removeItem as removeItemPure,
  sanitizeItems,
  setQty as setQtyPure,
  type CartItem,
  type CartTotals,
} from './cart.ts';

const STORAGE_KEY = 'svd_demo_cart';

type CartAction =
  | { type: 'hydrate'; items: CartItem[] }
  | { type: 'add'; id: string; qty: number }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    // The reducer delegates to the PURE functions from lib/demo/cart.ts, so the pricing
    // rules exist in exactly one place and the UI can never drift from the server route.
    case 'hydrate':
      return action.items;
    case 'add':
      return addItemPure(state, action.id, action.qty);
    case 'setQty':
      return setQtyPure(state, action.id, action.qty);
    case 'remove':
      return removeItemPure(state, action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

export interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  /** False until the persisted cart has been read. Do not render "empty cart" before this. */
  hydrated: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);

  // Read once, after mount. Never during render — see HYDRATION above.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', items: sanitizeItems(JSON.parse(raw)) });
    } catch {
      // Corrupt JSON, disabled storage, or a privacy mode that throws on access.
      // A broken cart must never take the page down.
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only once hydrated (see PERSISTENCE above).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota exceeded or storage disabled — the cart still works for this session.
    }
  }, [items, hydrated]);

  const add = useCallback((id: string, qty = 1) => dispatch({ type: 'add', id, qty }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: 'setQty', id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: 'remove', id }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const totals = useMemo(() => computeTotals(items), [items]);

  // Memoised so ProductCard / CartLine / TotalsPanel (React.memo) are not re-rendered
  // every time any consumer re-renders — the AGENTS.md performance convention.
  const value = useMemo<CartContextValue>(
    () => ({ items, totals, hydrated, add, setQty, remove, clear }),
    [items, totals, hydrated, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

/** Storage key exported for tests and for the checkout page's "start over" control. */
export const CART_STORAGE_KEY = STORAGE_KEY;