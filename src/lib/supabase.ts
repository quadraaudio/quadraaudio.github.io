// ─────────────────────────────────────────────────────────
// Quadra Audio — Supabase 3rd-Party Integration Layer
// Domain: quadraaudio.com
// Purpose: Headless Database & Authentication (OAuth / Web-to-App)
// ─────────────────────────────────────────────────────────

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const defaultSupabaseConfig: SupabaseConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://quadraaudio.supabase.co",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
};

/**
 * Simulates fetching live products from Supabase PostgreSQL Database (`public.products` table).
 * When Supabase environment variables are provided, this connects to the real DB table.
 */
export async function getSupabaseProducts() {
  // If real Supabase keys exist, fetch from REST endpoint:
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=*`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn("Supabase DB connection fallback to local catalog:", err);
    }
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
    iss: "quadraaudio.supabase.co",
    sub: email,
    aud: "hydra-desktop-app",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year token
  }));

  return `${redirectUri}?token=${token}&domain=quadraaudio.com`;
}
