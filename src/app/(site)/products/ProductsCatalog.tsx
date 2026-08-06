"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/store/ProductCard";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { HYDRA } from "@/data/hydra.landing";
import {
  MATRIX_GLOSS,
  QUADRA_BRAND,
  QUADRA_CTAS,
} from "@/data/brand.messaging";
import styles from "./products.module.scss";

export function ProductsCatalog() {
  const { products, loading, error } = useCatalog();

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Products</p>
        <h1 className="display display-lg">Starting with MATRIX.</h1>
        <p className="lede">
          {QUADRA_BRAND.purpose} {MATRIX_GLOSS.oneLiner}
        </p>

        <Link href="/products/matrix" className={styles.hydraFeature}>
          <div className={styles.hydraMedia}>
            <Image
              src={HYDRA.heroMedia.src}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 60vw"
              className={styles.hydraImage}
            />
          </div>
          <div className={styles.hydraCopy}>
            <p className={styles.hydraEyebrow}>Start 1.0 · Mac</p>
            <h2>{HYDRA.brandLine}</h2>
            <p>{HYDRA.lede}</p>
            <span className={styles.hydraLink}>
              {QUADRA_CTAS.exploreMatrix.label}
            </span>
          </div>
        </Link>

        {loading ? (
          <p className="lede" role="status">
            Loading catalog…
          </p>
        ) : error ? (
          <p className="lede" role="alert">
            {error}
          </p>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
        <div className={styles.cta}>
          <Link href={QUADRA_CTAS.buyMatrix.href} className="btn btn-primary">
            {QUADRA_CTAS.buyMatrix.label}
          </Link>
          <Link href={QUADRA_CTAS.exploreMatrix.href} className="btn btn-secondary">
            See how MATRIX works
          </Link>
        </div>
      </div>
    </main>
  );
}
