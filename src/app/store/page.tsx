import Link from "next/link";
import ThemeSetter from "@/components/ThemeSetter";
import ProductTile from "@/components/ProductTile";
import { products } from "@/data/products";
import styles from "./page.module.scss";

export const metadata = {
  title: "Store — Quadra Audio",
  description: "Shop Hydra, Hydra Pro, and Quadra Core I/O.",
};

export default function StorePage() {
  return (
    <div>
      <ThemeSetter theme="light" />

      <section className={styles.hero}>
        <h1 className="headline">Store.</h1>
        <p className="body-text">The best way to buy the products you love.</p>
      </section>

      <section className={styles.section}>
        <div className="section-container-wide">
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductTile
                key={product.slug}
                eyebrow={product.name}
                headline={product.tagline}
                image={product.heroImage || product.cardImage || "/images/hydra_app_icon.jpg"}
                learnMoreHref={product.slug === "hydra" ? "/hydra" : `/store/${product.slug}`}
                buyHref={product.available ? `/store/checkout?product=${product.slug}` : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.helpBand}>
        <div className="section-container">
          <h2 className="callout">Need help choosing?</h2>
          <p className="body-text" style={{ marginTop: 8, marginBottom: 20 }}>
            Our team can help you find the right Quadra product for your studio.
          </p>
          <Link href="/support/contact" className="apple-button-secondary">
            Contact us &gt;
          </Link>
        </div>
      </section>
    </div>
  );
}
