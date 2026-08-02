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
import { mapDbProduct } from "@/lib/products";

type CatalogContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getBySlug: (slug: string) => Product | undefined;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://accvrbqjndibljfpsspc.supabase.co";

/** Prefer JWT anon key — publishable keys work for REST but are easy to mis-deploy. */
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith("eyJ")
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY3ZyYnFqbmRpYmxqZnBzc3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDIxNjYsImV4cCI6MjEwMDg3ODE2Nn0.L8kQq5322O2l0fR55OS5eiURZqpGazY0y6gK2ozx7Zs";

type DbRow = Parameters<typeof mapDbProduct>[0];

async function fetchCatalog(): Promise<Product[]> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 10_000);

  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/products`);
    url.searchParams.set("select", "*");
    url.searchParams.set("order", "sort_order.asc");

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Catalog HTTP ${res.status}`);
    }

    const data = (await res.json()) as DbRow[];
    return (data || []).map((row) => mapDbProduct(row));
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Client catalog from Supabase. Required because the site is a static export —
 * server data only runs at build time and would bake seed prices.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const next = await fetchCatalog();
      setProducts(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load catalog");
      throw err;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetchCatalog()
      .then((next) => {
        if (!alive) return;
        setProducts(next);
        setError(null);
      })
      .catch((err) => {
        if (!alive) return;
        const message =
          err instanceof Error
            ? err.name === "AbortError"
              ? "Catalog request timed out"
              : err.message
            : "Could not load catalog";
        setError(message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const getBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const value = useMemo(
    () => ({ products, loading, error, refresh, getBySlug }),
    [products, loading, error, refresh, getBySlug]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
