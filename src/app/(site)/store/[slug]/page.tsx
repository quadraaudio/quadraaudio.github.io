import { PRODUCTS_SEED } from "@/data/products.seed";
import { getProductBySlug, listProducts } from "@/lib/products";
import { ProductDetailsLoader } from "./ProductDetailsLoader";

export async function generateStaticParams() {
  const fromDb = await listProducts({ includeUnavailable: true });
  const slugs = new Set([
    ...PRODUCTS_SEED.map((p) => p.slug),
    ...fromDb.map((p) => p.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    const seed = PRODUCTS_SEED.find((p) => p.slug === slug);
    return {
      title: seed?.name || "Product",
      description: seed?.tagline,
    };
  }
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default function ProductPage() {
  return <ProductDetailsLoader />;
}
