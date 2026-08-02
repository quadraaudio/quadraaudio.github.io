"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { ProductDetails } from "./ProductDetails";
import styles from "./pdp.module.scss";

export function ProductDetailsLoader() {
  const params = useParams();
  const slug = String(params.slug || "");
  const { getBySlug, loading, error } = useCatalog();
  const product = getBySlug(slug);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="lede" role="status">
            Loading product…
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="lede" role="alert">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Store</p>
          <h1 className="display display-lg">Product not found</h1>
          <p className="lede">
            This product is not in the live catalog.
          </p>
          <Link href="/store" className="btn btn-primary">
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  return <ProductDetails product={product} />;
}
