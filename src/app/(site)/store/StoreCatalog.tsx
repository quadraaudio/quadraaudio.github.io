"use client";

import { ProductCard } from "@/components/store/ProductCard";
import { useCatalog } from "@/components/providers/CatalogProvider";
import styles from "./store.module.scss";

export function StoreCatalog() {
  const { products, loading, error } = useCatalog();

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Store</p>
        <h1 className="display display-lg">Software for working studios.</h1>
        <p className="lede">
          Perpetual licenses with account-backed checkout.
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
