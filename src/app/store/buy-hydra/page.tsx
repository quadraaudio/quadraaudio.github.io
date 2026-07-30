"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";

export default function BuyHydraDirect() {
  const { productsList } = useProducts();
  const { addItem, items } = useCart();
  const router = useRouter();

  useEffect(() => {
    const hydraProduct = productsList.find((p) => p.slug === "hydra") || productsList[0];
    const status = hydraProduct?.availabilityStatus ?? (hydraProduct?.available ? "available" : "sold_out");
    
    if (status === "available") {
      const exists = items.some((i) => i.product.slug === "hydra");
      if (!exists && hydraProduct) {
        addItem(hydraProduct);
      }
      router.push("/store/bag");
    } else {
      router.push(`/store/${hydraProduct?.slug || "hydra"}`);
    }
  }, [addItem, items, productsList, router]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#86868b" }}>
      Checking Hydra availability...
    </div>
  );
}

