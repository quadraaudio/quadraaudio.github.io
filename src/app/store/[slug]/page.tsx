import { notFound, redirect } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
  const { products } = await import("@/data/products");
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return <ProductPageClient product={product} />;
}

