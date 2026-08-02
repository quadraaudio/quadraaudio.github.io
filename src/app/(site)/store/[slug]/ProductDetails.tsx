"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/products.seed";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/products";
import styles from "./pdp.module.scss";

export function ProductDetails({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.layout}`}>
        <div className={styles.art} style={{ background: product.cardGradient }} />
        <div className={styles.copy}>
          <p className="eyebrow">{product.badge || product.category}</p>
          <h1 className="display display-lg">{product.name}</h1>
          <p className="lede">{product.tagline}</p>
          <p className={styles.price}>
            {formatPrice(product.price, product.currency)}
          </p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={product.availabilityStatus !== "available" || added}
              onClick={() => {
                addProduct(product);
                setAdded(true);
                window.setTimeout(() => {
                  router.push("/store/bag");
                }, 450);
              }}
            >
              {added
                ? "Added — opening bag…"
                : product.availabilityStatus === "available"
                  ? "Buy now"
                  : product.availabilityStatus === "coming_soon"
                    ? "Coming soon"
                    : "Sold out"}
            </button>
            <Link href="/products/matrix" className="btn btn-secondary">
              Product overview
            </Link>
          </div>
          <ul className={styles.features}>
            {product.features.map((feature) => (
              <li key={feature.title}>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </li>
            ))}
          </ul>
          <div className={styles.reqs}>
            <p className={styles.reqsTitle}>System requirements</p>
            <ul>
              {product.systemRequirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
