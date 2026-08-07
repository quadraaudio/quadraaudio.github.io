/**
 * Product releases — types + live fetch from Supabase (no local seed).
 * Publish builds via /admin/releases (store-admin-releases edge function).
 * MATRIX reads https://quadraaudio.com/releases/latest.json for updates.
 */
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";

export type ReleaseChannel = "stable" | "beta";

export type ProductRelease = {
  id: string;
  productSlug: string;
  version: string;
  /** Monotonic build id — must match Packaging/version.env MATRIX_BUILD. */
  build: number;
  channel: ReleaseChannel;
  title: string;
  summary: string;
  highlights: string[];
  requirements: string[];
  publishedAt: string;
  published: boolean;
  downloadUrl: string;
  downloadFilename: string;
  downloadKind: string;
  downloadSizeBytes: number | null;
  sha256: string | null;
};

export type DbProductRelease = {
  id: string;
  product_slug: string;
  version: string;
  build?: number | null;
  channel: string;
  title: string;
  summary: string | null;
  highlights: unknown;
  requirements: unknown;
  published_at: string;
  published: boolean;
  download_url: string;
  download_filename: string | null;
  download_kind: string | null;
  download_size_bytes: number | null;
  sha256: string | null;
};

/** Public feed payload consumed by MATRIX (`/releases/latest.json`). */
export type MatrixReleaseFeed = {
  product: string;
  version: string;
  build: number;
  channel: ReleaseChannel;
  title: string;
  notes: string;
  url: string;
  filename: string;
  kind: string;
  size: number | null;
  sha256: string | null;
  published_at: string;
};

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://accvrbqjndibljfpsspc.supabase.co";

export const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith("eyJ")
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY3ZyYnFqbmRpYmxqZnBzc3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDIxNjYsImV4cCI6MjEwMDg3ODE2Nn0.L8kQq5322O2l0fR55OS5eiURZqpGazY0y6gK2ozx7Zs";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function mapDbRelease(row: DbProductRelease): ProductRelease {
  const channel: ReleaseChannel =
    row.channel === "beta" ? "beta" : "stable";
  return {
    id: row.id,
    productSlug: row.product_slug,
    version: row.version,
    build: Number(row.build) > 0 ? Number(row.build) : 1,
    channel,
    title: row.title,
    summary: row.summary || "",
    highlights: asStringArray(row.highlights),
    requirements: asStringArray(row.requirements),
    publishedAt: row.published_at,
    published: Boolean(row.published),
    downloadUrl: row.download_url,
    downloadFilename:
      row.download_filename ||
      `${row.product_slug}-${row.version}.zip`,
    downloadKind: row.download_kind || "Universal ZIP",
    downloadSizeBytes:
      row.download_size_bytes != null
        ? Number(row.download_size_bytes)
        : null,
    sha256: row.sha256,
  };
}

export function toMatrixReleaseFeed(release: ProductRelease): MatrixReleaseFeed {
  return {
    product: release.productSlug,
    version: release.version,
    build: release.build,
    channel: release.channel,
    title: release.title,
    notes: release.summary,
    url: release.downloadUrl,
    filename: release.downloadFilename,
    kind: release.downloadKind,
    size: release.downloadSizeBytes,
    sha256: release.sha256,
    published_at: release.publishedAt,
  };
}

/** Public published releases, newest first (by build, then published_at). */
export async function fetchPublishedReleases(
  productSlug?: string,
): Promise<ProductRelease[]> {
  const url = new URL(`${SUPABASE_URL}/rest/v1/product_releases`);
  url.searchParams.set("select", "*");
  url.searchParams.set("published", "eq.true");
  url.searchParams.set("order", "build.desc,published_at.desc");
  if (productSlug) {
    url.searchParams.set("product_slug", `eq.${productSlug}`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Releases HTTP ${res.status}`);
    }
    const data = (await res.json()) as DbProductRelease[];
    return (data || []).map(mapDbRelease);
  } finally {
    clearTimeout(timer);
  }
}

export function pickLatestStable(
  releases: ProductRelease[],
  productSlug: string = MATRIX_PRODUCT_SLUG,
): ProductRelease | undefined {
  return releases.find(
    (release) =>
      release.productSlug === productSlug && release.channel === "stable",
  );
}

export function formatAssetSize(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 100) return `${Math.round(mb)} MB`;
  return `${mb.toFixed(1)} MB`;
}

export function formatReleaseDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
