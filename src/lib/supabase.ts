import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://accvrbqjndibljfpsspc.supabase.co";
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY3ZyYnFqbmRpYmxqZnBzc3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDIxNjYsImV4cCI6MjEwMDg3ODE2Nn0.L8kQq5322O2l0fR55OS5eiURZqpGazY0y6gK2ozx7Zs";

let browserClient: SupabaseClient | null = null;

/** Anon client for public catalog/coupon reads (no user session). */
export function getSupabaseBrowser(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;

  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return browserClient;
}
