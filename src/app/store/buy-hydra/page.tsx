"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

export default function BuyHydraDirect() {
  const { addItem, items } = useCart();
  const router = useRouter();

  useEffect(() => {
    const hydraProduct = products.find((p) => p.slug === "hydra") || products[0];
    const exists = items.some((i) => i.product.slug === "hydra");
    
    if (!exists && hydraProduct) {
      addItem(hydraProduct);
    }
    
    router.push("/store/bag");
  }, [addItem, items, router]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#86868b" }}>
      Adding Hydra to your bag...
    </div>
  );
}
