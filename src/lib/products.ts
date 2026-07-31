import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseBrowser } from "@/lib/supabase";
import { PRODUCTS_SEED, type Product, getSeedProduct } from "@/data/products.seed";

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
};

function mapDbProduct(row: DbProduct): Product {
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
  };
}

export async function listProducts(): Promise<Product[]> {
  const admin = getSupabaseAdmin();
  const client = admin || getSupabaseBrowser();
  if (!client) return PRODUCTS_SEED;

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data?.length) return PRODUCTS_SEED;
    return data.map((row) => mapDbProduct(row as DbProduct));
  } catch {
    return PRODUCTS_SEED;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const admin = getSupabaseAdmin();
  const client = admin || getSupabaseBrowser();
  if (!client) return getSeedProduct(slug);

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return getSeedProduct(slug);
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
