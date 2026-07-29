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
 * Sync / Create license in Supabase database `public.licenses` table
 */
export async function syncLicenseToSupabase(userEmail: string, userName: string, productSlug: string = "hydra") {
  try {
    const res = await fetch("/api/sync-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, name: userName, productSlug }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.license;
    }
  } catch (err) {
    console.error("Supabase sync API call failed:", err);
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
