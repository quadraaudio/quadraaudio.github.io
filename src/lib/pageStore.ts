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

export function defaultBlankPageData(title: string): Data {
  return {
    root: { props: { title } },
    content: [
      {
        type: "ProductHero",
        props: {
          id: `ProductHero-${title.toLowerCase().replace(/\s+/g, "-")}`,
          brand: title,
          headline: "Nova página",
          subheadline:
            "Edite este texto, troque a imagem e adicione mais blocos abaixo.",
          primaryCtaLabel: "Saiba mais",
          primaryCtaHref: "/",
          secondaryCtaLabel: "",
          secondaryCtaHref: "",
          mediaSrc: "",
          mediaAlt: "",
          mediaGradient:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1a1e 0%, #050506 55%, #000 100%)",
          theme: "dark",
        },
      },
    ],
  };
}

export async function resolvePublicPageData(slug: string): Promise<Data> {
  const remote = await fetchPublishedPage(slug);
  if (remote) {
    saveLocalPublishedCache(remote, slug);
    return remote;
  }

  const cached = loadLocalPublishedCache(slug);
  if (cached) return cached;

  return slug === "home" ? defaultHomeData : defaultBlankPageData(slug);
}

export async function resolveEditorPageData(
  slug: string,
  title?: string,
): Promise<Data> {
  const draft = loadLocalDraft(slug);
  if (draft) return draft;

  const remote = await fetchEditorPage(slug);
  if (remote && (remote.content?.length ?? 0) > 0) return remote;

  const published = await fetchPublishedPage(slug);
  if (published && (published.content?.length ?? 0) > 0) return published;

  return slug === "home"
    ? defaultHomeData
    : defaultBlankPageData(title || slug);
}

/** @deprecated use resolvePublicPageData("home") */
export async function resolvePublicHomeData(): Promise<Data> {
  return resolvePublicPageData("home");
}

/** @deprecated use resolveEditorPageData("home", "Home") */
export async function resolveEditorHomeData(): Promise<Data> {
  return resolveEditorPageData("home", "Home");
}

export interface EditorPageSummary {
  slug: string;
  title: string;
  published: boolean;
  updated_at: string | null;
}

export async function listEditorPages(): Promise<EditorPageSummary[]> {
  try {
    const { data, error } = await supabase.rpc("list_editor_pages", {
      p_secret: getEditorSecret(),
    });
    if (error || !Array.isArray(data)) return [];
    return data as EditorPageSummary[];
  } catch {
    return [];
  }
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidPageSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= 60;
}

export async function createEditorPage(
  slug: string,
  title: string,
): Promise<{ ok: boolean; error?: string }> {
  const cleanSlug = slug.trim().toLowerCase();

  if (!isValidPageSlug(cleanSlug)) {
    return {
      ok: false,
      error:
        "Endereço inválido. Use apenas letras minúsculas, números e hífens (ex: nossa-historia).",
    };
  }

  try {
    const { error } = await supabase.rpc("create_editor_page", {
      p_slug: cleanSlug,
      p_title: title.trim() || cleanSlug,
      p_secret: getEditorSecret(),
    });

    if (error) {
      const msg = error.message || "";
      if (msg.includes("slug_taken")) {
        return { ok: false, error: "Já existe uma página com esse endereço." };
      }
      if (msg.includes("invalid_slug")) {
        return { ok: false, error: "Endereço inválido." };
      }
      return { ok: false, error: msg || "Não foi possível criar a página." };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro ao criar página.",
    };
  }
}
