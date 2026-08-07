/**
 * Cloudflare Pages Function — MATRIX update feed at /releases/latest.json
 * Returns 404 until a stable product_releases row is published.
 */

type DbRow = {
  product_slug: string;
  version: string;
  build: number;
  title: string;
  summary: string | null;
  published_at: string;
  download_url: string;
  download_filename: string | null;
  download_kind: string | null;
  download_size_bytes: number | null;
  sha256: string | null;
};

const SUPABASE_URL = "https://accvrbqjndibljfpsspc.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY3ZyYnFqbmRpYmxqZnBzc3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDIxNjYsImV4cCI6MjEwMDg3ODE2Nn0.L8kQq5322O2l0fR55OS5eiURZqpGazY0y6gK2ozx7Zs";
const PRODUCT_SLUG = "quadra-matrix";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequest: PagesFunction = async (context) => {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (
    context.request.method !== "GET" &&
    context.request.method !== "HEAD"
  ) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/product_releases`);
  url.searchParams.set("select", "*");
  url.searchParams.set("published", "eq.true");
  url.searchParams.set("channel", "eq.stable");
  url.searchParams.set("product_slug", `eq.${PRODUCT_SLUG}`);
  url.searchParams.set("order", "build.desc,published_at.desc");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: `Upstream ${res.status}` }), {
      status: 502,
      headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const rows = (await res.json()) as DbRow[];
  const row = rows?.[0];
  if (!row) {
    return new Response(null, {
      status: 404,
      headers: {
        ...CORS,
        "Cache-Control": "public, max-age=30",
      },
    });
  }

  const body = JSON.stringify(
    {
      product: row.product_slug,
      version: row.version,
      build: Number(row.build) || 1,
      channel: "stable",
      title: row.title,
      notes: row.summary || "",
      url: row.download_url,
      filename:
        row.download_filename || `${row.product_slug}-${row.version}.zip`,
      kind: row.download_kind || "Universal ZIP",
      size:
        row.download_size_bytes != null
          ? Number(row.download_size_bytes)
          : null,
      sha256: row.sha256,
      published_at: row.published_at,
    },
    null,
    2,
  );

  return new Response(context.request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      ...CORS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
};
