"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products.seed";
import { useCatalog } from "@/components/providers/CatalogProvider";

export type BagItem = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  cardGradient: string;
};

type CartContextValue = {
  items: BagItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addProduct: (product: Product) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "quadra_bag_v1";
const CartContext = createContext<CartContextValue | null>(null);

function loadItems(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BagItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, loading: catalogLoading } = useCatalog();
  const [items, setItems] = useState<BagItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setHydrated(true);
  }, []);

  // Reprice / drop bag lines from the live Supabase catalog.
  useEffect(() => {
    if (!hydrated || catalogLoading) return;
    setItems((prev) => {
      const next = prev
        .map((item) => {
          const live = products.find((p) => p.slug === item.slug);
          if (!live) return null;
          if (live.availabilityStatus !== "available") return null;
          return {
            ...item,
            name: live.name,
            price: live.price,
            currency: live.currency,
            cardGradient: live.cardGradient,
          };
        })
        .filter((item): item is BagItem => item !== null);

      const same =
        next.length === prev.length &&
        next.every(
          (item, i) =>
            item.slug === prev[i].slug &&
            item.price === prev[i].price &&
            item.name === prev[i].name &&
            item.quantity === prev[i].quantity
        );
      return same ? prev : next;
    });
  }, [hydrated, catalogLoading, products]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addProduct = useCallback((product: Product) => {
    if (product.availabilityStatus !== "available") return;
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug
            ? {
                ...item,
                quantity: item.quantity + 1,
                price: product.price,
                name: product.name,
                currency: product.currency,
                cardGradient: product.cardGradient,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          currency: product.currency,
          quantity: 1,
          cardGradient: product.cardGradient,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      items,
      itemCount,
      subtotal,
      hydrated: hydrated && !catalogLoading,
      addProduct,
      removeItem,
      setQuantity,
      clear,
    };
  }, [
    items,
    hydrated,
    catalogLoading,
    addProduct,
    removeItem,
    setQuantity,
    clear,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
