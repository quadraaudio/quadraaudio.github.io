"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuyHydraDirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/store/checkout?product=hydra");
  }, [router]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sk-glyph-gray-secondary)" }}>
      Taking you to checkout…
    </div>
  );
}
