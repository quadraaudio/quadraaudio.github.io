/**
 * Store admin — manage products in Supabase (Google session + editor_allowlist).
 *
 * Actions: list | upsert | delete
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Action = "list" | "upsert" | "delete";

interface ProductPayload {
  slug?: string;
  name?: string;
  tagline?: string | null;
  description?: string | null;
  price?: number;
  currency?: string;
  category?: string;
  badge?: string | null;
  availability_status?: "available" | "sold_out" | "coming_soon";
  features?: { title: string; description: string }[];
  system_requirements?: string[];
  card_gradient?: string | null;
  sort_order?: number;
}

interface Body {
  action?: Action;
  googleAccessToken?: string;
  product?: ProductPayload;
  slug?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function googleEmail(token: string): Promise<string | null> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { email?: string };
  return data.email?.trim().toLowerCase() || null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const body = (await req.json()) as Body;
    const action = body.action || "list";
    const token = body.googleAccessToken?.trim();
    if (!token) return json({ error: "Missing googleAccessToken" }, 401);

    const email = await googleEmail(token);
    if (!email) return json({ error: "Invalid Google session" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: adminRow, error: adminErr } = await supabase
      .from("editor_allowlist")
      .select("email")
      .eq("active", true)
      .ilike("email", email)
      .maybeSingle();

    if (adminErr) return json({ error: adminErr.message }, 500);
    if (!adminRow) return json({ error: "Not authorized" }, 403);

    if (action === "list") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) return json({ error: error.message }, 500);
      return json({ products: data || [] });
    }

    if (action === "delete") {
      const slug = body.slug?.trim() || body.product?.slug?.trim();
      if (!slug) return json({ error: "Missing slug" }, 400);
      const { error } = await supabase.from("products").delete().eq("slug", slug);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "upsert") {
      const p = body.product;
      if (!p?.slug?.trim() || !p?.name?.trim()) {
        return json({ error: "slug and name are required" }, 400);
      }
      const row = {
        slug: p.slug.trim(),
        name: p.name.trim(),
        tagline: p.tagline ?? null,
        description: p.description ?? null,
        price: Number(p.price ?? 0),
        currency: p.currency || "USD",
        category: p.category || "software",
        badge: p.badge ?? null,
        availability_status: p.availability_status || "available",
        features: p.features || [],
        system_requirements: p.system_requirements || [],
        card_gradient: p.card_gradient ?? null,
        sort_order: p.sort_order ?? 100,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("products")
        .upsert(row, { onConflict: "slug" })
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ product: data });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Server error" }, 500);
  }
});
