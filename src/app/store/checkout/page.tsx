import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { getProductBySlug } from "@/data/products";

export default async function CheckoutPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const slug = searchParams?.product as string | undefined;

  // If no product specified, redirect to store
  if (!slug) redirect("/store");

  const product = getProductBySlug(slug);
  if (!product || !product.available) redirect("/store");

  return <CheckoutClient product={product} />;
}
