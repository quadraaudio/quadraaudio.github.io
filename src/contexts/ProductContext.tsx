"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { products as initialProducts, type Product } from "@/data/products";
import { getSupabaseProducts, supabase } from "@/lib/supabase";

interface ProductContextValue {
  productsList: Product[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (newProduct: Product) => void;
  updateProduct: (slug: string, updated: Partial<Product>) => void;
  deleteProduct: (slug: string) => void;
  resetToDefaults: () => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

const STORAGE_KEY = "quadra_products_catalog_v2";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCatalog = useCallback(async () => {
    try {
      const fetched = await getSupabaseProducts();
      if (fetched && fetched.length > 0) {
        setProductsList(fetched);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
      }
    } catch (err) {
      console.warn("Failed to sync products from Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial LocalStorage fallback read for speed
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProductsList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved products:", e);
      }
    }

    // 2. Fetch fresh catalog from Supabase
    fetchCatalog();

    // 3. Subscribe to Supabase Realtime changes on `products` table
    const channel = supabase
      .channel("supabase-products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (_payload) => {
          console.log("Realtime product change detected from Supabase, refreshing catalog...");
          fetchCatalog();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCatalog]);

  const saveProducts = (updatedList: Product[]) => {
    setProductsList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  const addProduct = (newProduct: Product) => {
    const updated = [newProduct, ...productsList];
    saveProducts(updated);
  };

  const updateProduct = (slug: string, updatedFields: Partial<Product>) => {
    const updated = productsList.map((p) =>
      p.slug === slug ? { ...p, ...updatedFields } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (slug: string) => {
    const updated = productsList.filter((p) => p.slug !== slug);
    saveProducts(updated);
  };

  const resetToDefaults = () => {
    saveProducts(initialProducts);
  };

  return (
    <ProductContext.Provider
      value={{
        productsList,
        isLoading,
        refreshProducts: fetchCatalog,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return ctx;
}

