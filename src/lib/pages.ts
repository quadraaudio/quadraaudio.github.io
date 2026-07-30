import type { Data } from "@puckeditor/core";
import { supabase } from "@/lib/supabase";

const LS_KEY = "quadra_puck_pages_v1";

export type PageRecord = {
  slug: string;
  title: string;
  data: Data;
  status: "draft" | "published";
  updated_at?: string;
};

function readLocal(): Record<string, PageRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PageRecord>) : {};
  } catch {
    return {};
  }
}

function writeLocal(map: Record<string, PageRecord>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

/** Load published page JSON for the public site. */
export async function getPublishedPage(slug: string): Promise<Data | null> {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("data, status")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data?.data) {
      return data.data as Data;
    }
  } catch (err) {
    console.warn("Supabase page fetch failed:", err);
  }

  const local = readLocal()[slug];
  if (local?.status === "published" && local.data) {
    return local.data;
  }

  return null;
}

/** Load any saved page for the editor (published or draft). */
export async function getEditorPage(slug: string): Promise<PageRecord | null> {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("slug, title, data, status, updated_at")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data?.data) {
      return {
        slug: data.slug,
        title: data.title,
        data: data.data as Data,
        status: (data.status as PageRecord["status"]) || "published",
        updated_at: data.updated_at,
      };
    }
  } catch (err) {
    console.warn("Supabase editor page fetch failed:", err);
  }

  return readLocal()[slug] || null;
}

/** Publish page to Supabase (requires auth session) + local backup. */
export async function publishPage(
  slug: string,
  title: string,
  data: Data
): Promise<{ ok: boolean; error?: string; localOnly?: boolean }> {
  const record: PageRecord = {
    slug,
    title,
    data,
    status: "published",
    updated_at: new Date().toISOString(),
  };

  const map = readLocal();
  map[slug] = record;
  writeLocal(map);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      ok: false,
      localOnly: true,
      error:
        "Saved in this browser only. Sign in with Supabase Auth on /edit to publish live.",
    };
  }

  const { error } = await supabase.from("pages").upsert(
    {
      slug,
      title,
      data,
      status: "published",
      updated_at: record.updated_at,
      updated_by: session.user.email || session.user.id,
    },
    { onConflict: "slug" }
  );

  if (error) {
    return {
      ok: false,
      localOnly: true,
      error: `Local save OK. Supabase error: ${error.message}`,
    };
  }

  return { ok: true };
}
