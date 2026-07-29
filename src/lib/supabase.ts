// ─────────────────────────────────────────────────────────
// Quadra Audio — Supabase Official Client Integration
// Domain: quadraaudio.com
// Purpose: Headless Database & Authentication (OAuth / Web-to-App)
// ─────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://accvrbqjndibljfpsspc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4o9Wc4iUQQ_foOStyoZkhw_OafU6";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  // Fallback to local catalog
  const { products } = await import("@/data/products");
  return products;
}

/**
 * Web-to-App Auth Token Generator via Supabase Auth Protocol
 */
export function getSupabaseWebToAppUrl(email: string, redirectUri: string = "quadra://auth/callback") {
  const token = btoa(JSON.stringify({
    iss: supabaseUrl,
    sub: email,
    aud: "hydra-desktop-app",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year token
  }));

  return `${redirectUri}?token=${token}&domain=quadraaudio.com`;
}
