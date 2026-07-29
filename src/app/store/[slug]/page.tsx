import { notFound, redirect } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import ProductPageClient from "./ProductPageClient";
import type { PageProps } from "next/types";

export async function generateStaticParams() {
  const { products } = await import("@/data/products");
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: PageProps<"/store/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  // If product exists but isn't available yet, redirect to store
  if (!product.available) redirect("/store");

  return <ProductPageClient product={product} />;
}
