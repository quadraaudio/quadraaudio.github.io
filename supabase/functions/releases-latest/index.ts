/**
 * Public MATRIX release feed — no auth.
 * Proxied at https://quadraaudio.com/releases/latest.json
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept",
};

const PRODUCT_SLUG = "quadra-matrix";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase
      .from("product_releases")
      .select("*")
      .eq("published", true)
      .eq("channel", "stable")
      .eq("product_slug", PRODUCT_SLUG)
      .order("build", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...CORS,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    }

    if (!data) {
      return new Response(null, {
        status: 404,
        headers: {
          ...CORS,
          "Cache-Control": "public, max-age=30",
        },
      });
    }

    const body = {
      product: data.product_slug,
      version: data.version,
      build: Number(data.build) || 1,
      channel: "stable",
      title: data.title,
      notes: data.summary || "",
      url: data.download_url,
      filename:
        data.download_filename || `${data.product_slug}-${data.version}.zip`,
      kind: data.download_kind || "Universal ZIP",
      size:
        data.download_size_bytes != null
          ? Number(data.download_size_bytes)
          : null,
      sha256: data.sha256,
      published_at: data.published_at,
    };

    return new Response(JSON.stringify(body, null, 2), {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Server error",
      }),
      {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      },
    );
  }
});
