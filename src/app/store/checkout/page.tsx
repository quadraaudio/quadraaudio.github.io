"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { getProductBySlug, products } from "@/data/products";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("product") || "hydra";

  const product = getProductBySlug(slug) || products[0];

  return <CheckoutClient product={product} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
