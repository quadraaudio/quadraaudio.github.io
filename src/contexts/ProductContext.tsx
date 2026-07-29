"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts, type Product } from "@/data/products";

interface ProductContextValue {
  productsList: Product[];
  addProduct: (newProduct: Product) => void;
  updateProduct: (slug: string, updated: Partial<Product>) => void;
  deleteProduct: (slug: string) => void;
  resetToDefaults: () => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

const STORAGE_KEY = "quadra_products_catalog_v1";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProductsList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved products:", e);
      }
    }
  }, []);

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
