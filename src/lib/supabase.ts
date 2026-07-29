// ─────────────────────────────────────────────────────────
// Quadra Audio — Supabase Official Client Integration
// Domain: quadraaudio.com
// Purpose: Headless Database & Authentication (OAuth / Web-to-App)
// ─────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://accvrbqjndibljfpsspc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4o9Wc4iUQQ_foOStyozkhw_DafU6VmL";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_LICENSES_KEY = "quadra_user_licenses_v1";

/**
 * Validate discount coupon code directly against Supabase database
 */
export async function validateCouponWithSupabase(code: string): Promise<{
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discountAmount?: number;
  error?: string;
}> {
  if (!code || typeof code !== "string") {
    return { valid: false, error: "Coupon code is required" };
  }

  const rawCode = code.trim();
  const upperCode = rawCode.toUpperCase();

  // 1. Query Supabase coupons table directly from browser via JS SDK
  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", rawCode)
      .eq("active", true);

    if (!error && data && data.length > 0) {
      const c = data[0];
      return {
        valid: true,
        code: c.code,
        discountPercent: c.discount_percent || 0,
        discountAmount: c.discount_amount || 0,
      };
    }
  } catch (err) {
    console.warn("Supabase direct coupon lookup fallback:", err);
  }

  // 2. Preset Fallbacks
  const PRESET_COUPONS: Record<string, { percent: number; amount: number }> = {
    "ZUSKAB-XOCZEX-7GUGGA": { percent: 100, amount: 0 },
    "QUADRA10": { percent: 10, amount: 0 },
    "LAUNCH20": { percent: 20, amount: 0 },
    "STUDIO50": { percent: 50, amount: 0 },
    "HYDRA100": { percent: 100, amount: 0 },
  };

  if (PRESET_COUPONS[upperCode] || PRESET_COUPONS[rawCode]) {
    const preset = PRESET_COUPONS[upperCode] || PRESET_COUPONS[rawCode];
    return {
      valid: true,
      code: rawCode,
      discountPercent: preset.percent,
      discountAmount: preset.amount,
    };
  }

  return { valid: false, error: "Invalid or expired promo code" };
}

/**
 * Sync / Create license in Supabase database `public.licenses` table & LocalStorage
 */
export async function syncLicenseToSupabase(userEmail: string, userName: string, productSlug: string = "hydra") {
  if (!userEmail) return null;

  const cleanEmail = userEmail.trim().toLowerCase();
  const cleanName = userName ? userName.trim() : cleanEmail.split("@")[0];

  const newLicObj = {
    id: "LIC-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    user_email: cleanEmail,
    user_name: cleanName,
    product_slug: productSlug,
    status: "active",
    issued_at: new Date().toISOString(),
    expires_at: "PERPETUAL",
  };

  // 1. Save to LocalStorage immediately for instant UI availability
  try {
    const existingLocal = localStorage.getItem(LOCAL_LICENSES_KEY);
    const list = existingLocal ? JSON.parse(existingLocal) : [];
    list.unshift(newLicObj);
    localStorage.setItem(LOCAL_LICENSES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save local license fallback:", e);
  }

  // 2. Sync to Supabase PostgreSQL database
  try {
    const { data: existing } = await supabase
      .from("licenses")
      .select("*")
      .ilike("user_email", cleanEmail)
      .eq("product_slug", productSlug);

    if (existing && existing.length > 0) {
      return existing[0];
    }

    const { data, error } = await supabase
      .from("licenses")
      .insert([
        {
          user_email: cleanEmail,
          user_name: cleanName,
          product_slug: productSlug,
          status: "active",
        },
      ])
      .select();

    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Supabase direct sync failed:", err);
  }

  return newLicObj;
}

/**
 * Fetch licenses for user from Supabase `public.licenses` table with LocalStorage fallback
 */
export async function getSupabaseUserLicenses(userEmail: string) {
  if (!userEmail) return [];

  const cleanEmail = userEmail.trim().toLowerCase();

  // 1. Query Supabase Database (case-insensitive)
  try {
    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .ilike("user_email", cleanEmail);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error("Failed to fetch licenses from Supabase:", err);
  }

  // 2. LocalStorage Fallback
  try {
    const saved = localStorage.getItem(LOCAL_LICENSES_KEY);
    if (saved) {
      const list = JSON.parse(saved);
      const filtered = list.filter((l: any) => l.user_email?.toLowerCase() === cleanEmail);
      if (filtered.length > 0) return filtered;
    }
  } catch (e) {
    console.error("Failed to read local licenses:", e);
  }

  return [];
}

/**
 * Fetch products dynamically from Supabase `public.products` table
 */
export async function getSupabaseProducts() {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Supabase connection fallback to local catalog:", err);
  }

  const { products } = await import("@/data/products");
  return products;
}
