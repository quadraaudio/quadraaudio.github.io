"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products.seed";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/products";
import styles from "./pdp.module.scss";

export function ProductDetails({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const router = useRouter();

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
              disabled={product.availabilityStatus !== "available"}
              onClick={() => {
                addProduct(product);
                router.push("/store/bag");
              }}
            >
              Add to bag
            </button>
            <Link href="/store" className="btn btn-secondary">
              Back to store
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
