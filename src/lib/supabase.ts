// ─────────────────────────────────────────────────────────
// Quadra Audio — Supabase Official Client Integration
// Domain: quadraaudio.com
// Purpose: Headless Database & Authentication (OAuth / Web-to-App)
// ─────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://accvrbqjndibljfpsspc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4o9Wc4iUQQ_foOStyozkhw_DafU6VmL";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Validate discount coupon code directly against Supabase database (browser-safe for GitHub Pages static host)
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

  // 2. Preset Fallbacks (including user generated codes)
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
 * Sync / Create license in Supabase database `public.licenses` table directly
 */
export async function syncLicenseToSupabase(userEmail: string, userName: string, productSlug: string = "hydra") {
  try {
    // Check if license exists
    const { data: existing } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", userEmail)
      .eq("product_slug", productSlug);

    if (existing && existing.length > 0) {
      return existing[0];
    }

    // Insert new license row directly into Supabase licenses table
    const { data, error } = await supabase
      .from("licenses")
      .insert([
        {
          user_email: userEmail,
          user_name: userName || userEmail.split("@")[0],
          product_slug: productSlug,
          status: "active",
        },
      ])
      .select();

    if (!error && data) {
      return data[0];
    }
  } catch (err) {
    console.error("Supabase direct sync failed:", err);
  }
  return null;
}

/**
 * Fetch licenses for user from Supabase `public.licenses` table
 */
export async function getSupabaseUserLicenses(userEmail: string) {
  try {
    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", userEmail);

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.error("Failed to fetch licenses from Supabase:", err);
  }
  return null;
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
