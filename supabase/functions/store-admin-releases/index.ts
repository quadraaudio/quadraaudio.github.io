/**
 * Store admin — manage product_releases (Google session + editor_allowlist).
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

interface ReleasePayload {
  id?: string;
  product_slug?: string;
  version?: string;
  build?: number | null;
  channel?: "stable" | "beta";
  title?: string;
  summary?: string | null;
  highlights?: string[];
  requirements?: string[];
  published_at?: string;
  published?: boolean;
  download_url?: string;
  download_filename?: string | null;
  download_kind?: string | null;
  download_size_bytes?: number | null;
  sha256?: string | null;
}

interface Body {
  action?: Action;
  googleAccessToken?: string;
  release?: ReleasePayload;
  id?: string;
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

function deriveBuild(version: string): number {
  const parts = version
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((p) => Number.parseInt(p, 10) || 0);
  const major = parts[0] ?? 0;
  const minor = parts[1] ?? 0;
  const patch = parts[2] ?? 0;
  return Math.max(1, major * 10000 + minor * 100 + patch);
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
      { auth: { persistSession: false } },
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
        .from("product_releases")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ releases: data || [] });
    }

    if (action === "delete") {
      const id = body.id?.trim() || body.release?.id?.trim();
      if (!id) return json({ error: "Missing id" }, 400);
      const { error } = await supabase
        .from("product_releases")
        .delete()
        .eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "upsert") {
      const r = body.release;
      if (
        !r?.product_slug?.trim() ||
        !r?.version?.trim() ||
        !r?.title?.trim() ||
        !r?.download_url?.trim()
      ) {
        return json(
          {
            error:
              "product_slug, version, title, and download_url are required",
          },
          400,
        );
      }

      const version = r.version.trim().replace(/^v/i, "");
      const build =
        typeof r.build === "number" && r.build > 0
          ? Math.floor(r.build)
          : deriveBuild(version);

      const row = {
        product_slug: r.product_slug.trim(),
        version,
        build,
        channel: r.channel === "beta" ? "beta" : "stable",
        title: r.title.trim(),
        summary: r.summary?.trim() || null,
        highlights: Array.isArray(r.highlights)
          ? r.highlights.filter((h) => h.trim())
          : [],
        requirements: Array.isArray(r.requirements)
          ? r.requirements.filter((req) => req.trim())
          : [],
        published_at: r.published_at || new Date().toISOString(),
        published: r.published !== false,
        download_url: r.download_url.trim(),
        download_filename: r.download_filename?.trim() || null,
        download_kind: r.download_kind?.trim() || "Universal DMG",
        download_size_bytes:
          r.download_size_bytes != null && Number(r.download_size_bytes) > 0
            ? Number(r.download_size_bytes)
            : null,
        sha256: r.sha256?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = r.id
        ? await supabase
            .from("product_releases")
            .update(row)
            .eq("id", r.id)
            .select("*")
            .single()
        : await supabase
            .from("product_releases")
            .upsert(row, {
              onConflict: "product_slug,version,channel",
            })
            .select("*")
            .single();

      if (error) return json({ error: error.message }, 500);
      return json({ release: data });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Server error" },
      500,
    );
  }
});
