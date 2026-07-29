// ─────────────────────────────────────────────────────────
// Quadra Audio — Sanity.io Headless CMS Client Integration
// Domain: quadraaudio.com
// Purpose: Drag-and-Drop Visual Content & Carousel Editor
// ─────────────────────────────────────────────────────────

import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "quadra-audio";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-07-29";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Fetch page content dynamically from Sanity.io GROQ query
 */
export async function getSanityPageContent(slug: string = "home") {
  try {
    const query = `*[_type == "page" && slug.current == "${slug}"][0]`;
    const page = await sanityClient.fetch(query);
    if (page) return page;
  } catch (err) {
    console.warn("Sanity CMS fetch fallback to local defaults:", err);
  }
  return null;
}
