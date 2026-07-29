// ─────────────────────────────────────────────────────────
// Quadra Audio — Sanity.io / Decap Headless CMS Integration Layer
// Domain: quadraaudio.com
// Purpose: Interactive Drag-and-Drop Visual Content Editor
// ─────────────────────────────────────────────────────────

export interface SanityCmsConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
}

export const defaultSanityConfig: SanityCmsConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "quadra-audio-cms",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-07-29",
  useCdn: true,
};

/**
 * Fetch page content from Sanity.io Headless CMS GROQ query.
 * Non-programmers edit content in Sanity Studio (https://sanity.io/studio)
 */
export async function getSanityPageContent(pageSlug: string) {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const query = encodeURIComponent(`*[_type == "page" && slug.current == "${pageSlug}"][0]`);
      const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${defaultSanityConfig.apiVersion}/data/query/${defaultSanityConfig.dataset}?query=${query}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.result) return json.result;
      }
    } catch (err) {
      console.warn("Sanity.io connection fallback:", err);
    }
  }

  return null; // Fallback to local default state
}
