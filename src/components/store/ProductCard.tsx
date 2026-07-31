"use client";

import Link from "next/link";
import type { Product } from "@/data/products.seed";
import { formatPrice } from "@/lib/products";
import styles from "./ProductCard.module.scss";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/store/${product.slug}`} className={styles.card}>
      <div className={styles.art} style={{ background: product.cardGradient }} />
      <div className={styles.body}>
        {product.badge ? <p className={styles.badge}>{product.badge}</p> : null}
        <h3>{product.name}</h3>
        <p>{product.tagline}</p>
        <div className={styles.meta}>
          <span>{formatPrice(product.price, product.currency)}</span>
          <span className={styles.status}>{product.availabilityStatus.replace("_", " ")}</span>
        </div>
      </div>
    </Link>
  );
}
