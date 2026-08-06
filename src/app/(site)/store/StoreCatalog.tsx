"use client";

import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { MATRIX_GLOSS, QUADRA_CTAS } from "@/data/brand.messaging";
import styles from "./store.module.scss";

export function StoreCatalog() {
  const { products, loading, error } = useCatalog();

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Store</p>
        <h1 className="display display-lg">Buy MATRIX. Own it.</h1>
        <p className="lede">
          Perpetual license with your Quadra ID. {MATRIX_GLOSS.priceLine}. Sign
          in with Google and pay with PayPal.
        </p>
        <p className={styles.hint}>
          New to MATRIX?{" "}
          <Link href={QUADRA_CTAS.exploreMatrix.href}>
            See what it does
          </Link>{" "}
          before you buy — or start a {MATRIX_GLOSS.trialDays}-day trial from the
          app.
        </p>
        {loading ? (
          <p className="lede" role="status">
            Loading catalog…
          </p>
        ) : error ? (
          <p className="lede" role="alert">
            {error}
          </p>
        ) : !products.length ? (
          <p className="lede">No products in the catalog yet.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
