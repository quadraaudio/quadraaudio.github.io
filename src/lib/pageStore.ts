import type { Data } from "@puckeditor/core";
import { supabase } from "@/lib/supabase";
import { defaultHomeData } from "@/editor/puckConfig";

const DRAFT_KEY = "quadra_puck_draft_home_v1";
const PUBLISHED_CACHE_KEY = "quadra_puck_published_home_v1";

export function getEditorSecret(): string {
  return (
    process.env.NEXT_PUBLIC_EDITOR_PUBLISH_SECRET || "quadra-editor-change-me"
  );
}

export function loadLocalDraft(slug = "home"): Data | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY}:${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export function saveLocalDraft(data: Data, slug = "home"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${DRAFT_KEY}:${slug}`, JSON.stringify(data));
}

export function loadLocalPublishedCache(slug = "home"): Data | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PUBLISHED_CACHE_KEY}:${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export function saveLocalPublishedCache(data: Data, slug = "home"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PUBLISHED_CACHE_KEY}:${slug}`, JSON.stringify(data));
}

export async function fetchPublishedPage(slug = "home"): Promise<Data | null> {
  try {
    const { data, error } = await supabase
      .from("site_pages")
      .select("puck_data")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data?.puck_data) return null;
    const puckData = data.puck_data as Data;
    if (!puckData?.content) return null;
    return puckData;
  } catch {
    return null;
  }
}

export async function fetchEditorPage(slug = "home"): Promise<Data | null> {
  try {
    const { data, error } = await supabase.rpc("get_editor_site_page", {
      p_slug: slug,
      p_secret: getEditorSecret(),
    });

    if (error || !data?.puck_data) return null;
    const puckData = data.puck_data as Data;
    if (!puckData?.content) return null;
    return puckData;
  } catch {
    return null;
  }
}

export async function publishPage(options: {
  slug?: string;
  title?: string;
  data: Data;
  updatedBy?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const slug = options.slug ?? "home";
  const title = options.title ?? "Home";

  saveLocalDraft(options.data, slug);
  saveLocalPublishedCache(options.data, slug);

  try {
    const { error } = await supabase.rpc("publish_site_page", {
      p_slug: slug,
      p_title: title,
      p_data: options.data,
      p_secret: getEditorSecret(),
      p_updated_by: options.updatedBy ?? null,
    });

    if (error) {
      return {
        ok: false,
        error: error.message || "Publish failed. Draft saved locally.",
      };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Publish failed. Draft saved locally.",
    };
  }
}

export async function resolvePublicHomeData(): Promise<Data> {
  const remote = await fetchPublishedPage("home");
  if (remote) {
    saveLocalPublishedCache(remote, "home");
    return remote;
  }

  const cached = loadLocalPublishedCache("home");
  if (cached) return cached;

  return defaultHomeData;
}

export async function resolveEditorHomeData(): Promise<Data> {
  const draft = loadLocalDraft("home");
  if (draft) return draft;

  const remote = await fetchEditorPage("home");
  if (remote) return remote;

  const published = await fetchPublishedPage("home");
  if (published) return published;

  return defaultHomeData;
}
