import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeSetter from "@/components/ThemeSetter";
import { products, getProductBySlug } from "@/data/products";
import styles from "./page.module.scss";

export function generateStaticParams() {
  return products
    .filter((p) => p.slug !== "hydra")
    .map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.slug === "hydra") notFound();

  return (
    <div>
      <ThemeSetter theme="light" />

      <section className={styles.hero}>
        <p className="eyebrow">{product.name}</p>
        <h1 className="headline">{product.tagline}</h1>
        <p className="body-text" style={{ maxWidth: 560, margin: "16px auto 0" }}>
          {product.description}
        </p>
        <div className={styles.ctas}>
          {product.available ? (
            <Link href={`/store/checkout?product=${product.slug}`} className="apple-button-primary">
              Buy — {product.priceLabel}
            </Link>
          ) : (
            <span className={styles.comingSoon}>{product.priceLabel}</span>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <div className="section-container">
          <div className={styles.featureGrid}>
            {product.features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
