"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "./seed-data";

export type CartLine = { slug: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  items: (CartLine & { product: Product })[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "iloveubetrayed_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function add(slug: string) {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { slug, qty: 1 }];
    });
  }

  function remove(slug: string) {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }

  function setQty(slug: string, qty: number) {
    if (qty <= 0) return remove(slug);
    setLines((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty } : l)));
  }

  function clear() {
    setLines([]);
  }

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = products.find((p) => p.slug === l.slug);
          return product ? { ...l, product } : null;
        })
        .filter(Boolean) as (CartLine & { product: Product })[],
    [lines, products]
  );

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.qty * i.product.price, 0);

  return (
    <CartContext.Provider value={{ lines, items, add, remove, setQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
