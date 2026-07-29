"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/data/products";
import { validateCouponWithSupabase } from "@/lib/supabase";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  discountTotal: number;
  finalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.product.slug === product.slug
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.product.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.slug !== slug));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.slug === slug ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      // Direct browser validation with Supabase (GitHub Pages compatible)
      const data = await validateCouponWithSupabase(code);

      if (data.valid && data.code) {
        setAppliedCoupon({
          code: data.code,
          discountPercent: data.discountPercent || 0,
          discountAmount: data.discountAmount || 0,
        });
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid or expired promo code" };
      }
    } catch (err: any) {
      return { success: false, error: "Network error validating promo code" };
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  let discountTotal = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountTotal = (totalPrice * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount > 0) {
      discountTotal = Math.min(totalPrice, appliedCoupon.discountAmount);
    }
  }

  const finalPrice = Math.max(0, totalPrice - discountTotal);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        appliedCoupon,
        discountTotal,
        finalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
