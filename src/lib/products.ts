import {
  PRODUCTS_SEED,
  type Product,
  getSeedProduct,
} from "@/data/products.seed";
import { getSupabaseBrowser } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type DbProduct = {
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number | string;
  currency: string | null;
  category: string | null;
  badge: string | null;
  availability_status: Product["availabilityStatus"];
  features: Product["features"] | null;
  system_requirements: string[] | null;
  card_gradient: string | null;
  sort_order?: number | null;
};

export function mapDbProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || "",
    description: row.description || "",
    price: Number(row.price),
    currency: row.currency || "USD",
    category: (row.category as Product["category"]) || "software",
    badge: row.badge || undefined,
    availabilityStatus: row.availability_status,
    features: row.features || [],
    systemRequirements: row.system_requirements || [],
    cardGradient:
      row.card_gradient ||
      "linear-gradient(145deg, #0e1218 0%, #243041 55%, #00a3a0 120%)",
    sortOrder: row.sort_order ?? 100,
  };
}

function sortProducts(products: Product[]) {
  return [...products].sort(
    (a, b) =>
      (a.sortOrder ?? 100) - (b.sortOrder ?? 100) ||
      a.name.localeCompare(b.name)
  );
}

function storeClient() {
  return getSupabaseAdmin() || getSupabaseBrowser();
}

/**
 * Live catalog from Supabase `products`.
 * Prefer CatalogProvider in the browser (static export). Seed is last resort only.
 */
export async function listProducts(options?: {
  /** When false, only `available` rows. Default true so admin status changes show. */
  includeUnavailable?: boolean;
}): Promise<Product[]> {
  const includeUnavailable = options?.includeUnavailable ?? true;
  const client = storeClient();
  if (!client) return sortProducts(PRODUCTS_SEED);

  try {
    let query = client.from("products").select("*").order("sort_order", {
      ascending: true,
    });

    if (!includeUnavailable) {
      query = query.eq("availability_status", "available");
    }

    const { data, error } = await query;
    if (error) throw error;
    return sortProducts((data || []).map((row) => mapDbProduct(row as DbProduct)));
  } catch {
    // Build-time / offline only — never pretend seed is live admin state.
    if (typeof window !== "undefined") throw new Error("Catalog unavailable");
    return sortProducts(PRODUCTS_SEED);
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const client = storeClient();
  if (!client) return getSeedProduct(slug);

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;
    return mapDbProduct(data as DbProduct);
  } catch {
    return getSeedProduct(slug);
  }
}

export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function productToDbPayload(product: Partial<Product> & { slug: string }) {
  return {
    slug: product.slug,
    name: product.name,
    tagline: product.tagline ?? null,
    description: product.description ?? null,
    price: product.price ?? 0,
    currency: product.currency ?? "USD",
    category: product.category ?? "software",
    badge: product.badge ?? null,
    availability_status: product.availabilityStatus ?? "available",
    features: product.features ?? [],
    system_requirements: product.systemRequirements ?? [],
    card_gradient: product.cardGradient ?? null,
    sort_order: product.sortOrder ?? 100,
    updated_at: new Date().toISOString(),
  };
}

export function availabilityLabel(status: Product["availabilityStatus"]) {
  switch (status) {
    case "coming_soon":
      return "Coming soon";
    case "sold_out":
      return "Sold out";
    default:
      return "Available";
  }
}
