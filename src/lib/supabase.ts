// ─────────────────────────────────────────────────────────
// Quadra Audio — Supabase Official Client Integration
// Domain: quadraaudio.com
// Purpose: Headless Database & Authentication (OAuth / Web-to-App)
// ─────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://accvrbqjndibljfpsspc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "dummy_key");

/**
 * Sync / Create license in Supabase database `public.licenses` table
 */
export async function syncLicenseToSupabase(userEmail: string, userName: string, productSlug: string = "hydra") {
  if (!supabaseAnonKey || supabaseAnonKey.includes("dummy")) {
    console.warn("Supabase Anon Key is pending configuration in .env.local");
    return null;
  }

  try {
    // Check if license already exists for this email
    const { data: existing } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", userEmail)
      .eq("product_slug", productSlug);

    if (existing && existing.length > 0) {
      return existing[0];
    }

    // Insert new license row into Supabase licenses table
    const { data, error } = await supabase
      .from("licenses")
      .insert([
        {
          user_email: userEmail,
          user_name: userName,
          product_slug: productSlug,
          status: "active",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase license insertion error:", error);
      return null;
    }

    return data ? data[0] : null;
  } catch (err) {
    console.error("Supabase sync error:", err);
    return null;
  }
}

/**
 * Fetch licenses for user from Supabase `public.licenses` table
 */
export async function getSupabaseUserLicenses(userEmail: string) {
  if (!supabaseAnonKey || supabaseAnonKey.includes("dummy")) {
    return null;
  }

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
  if (!supabaseAnonKey || supabaseAnonKey.includes("dummy")) {
    const { products } = await import("@/data/products");
    return products;
  }

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
