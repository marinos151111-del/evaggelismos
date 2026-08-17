import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '@/types';
import { useCatalog } from '@/context/CatalogContext';

const STORAGE_KEY = 'ems-cart';
export const HOME_DELIVERY_FEE = 5;

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  isCartOpen: boolean;
  /** increments every time an item is added — used to pop the navbar badge */
  lastAddedAt: number;
  add: (id: number, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartState | null>(null);

function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (it) => typeof it?.id === 'number' && typeof it?.qty === 'number' && it.qty > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { byId } = useCatalog();
  const [items, setItems] = useState<CartItem[]>(loadInitial);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const skipPersist = useRef(true);

  useEffect(() => {
    // Skip the very first run (already hydrated from localStorage)
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const add = useCallback((id: number, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === id);
      if (existing) {
        return prev.map((it) => (it.id === id ? { ...it, qty: it.qty + qty } : it));
      }
      return [...prev, { id, qty }];
    });
    setLastAddedAt(Date.now());
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.id !== id)
        : prev.map((it) => (it.id === id ? { ...it, qty } : it))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const count = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);
  const subtotal = useMemo(
    () =>
      items.reduce((sum, it) => {
        const p = byId.get(it.id);
        return p ? sum + p.price * it.qty : sum;
      }, 0),
    [items, byId]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isCartOpen,
      lastAddedAt,
      add,
      remove,
      setQty,
      clear,
      openCart,
      closeCart,
    }),
    [items, count, subtotal, isCartOpen, lastAddedAt, add, remove, setQty, clear, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
