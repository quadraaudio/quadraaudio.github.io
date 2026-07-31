import Link from "next/link";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/store/ProductCard";
import styles from "./products.module.scss";

export const metadata = {
  title: "Products",
  description: "Professional audio software from Quadra.",
};

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Products</p>
        <h1 className="display display-lg">Software built for working rooms.</h1>
        <p className="lede">
          Quadra develops professional audio software for studios, producers, and
          engineers — processors you can trust on real sessions.
        </p>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className={styles.cta}>
          <Link href="/store" className="btn btn-primary">
            Shop all software
          </Link>
        </div>
      </div>
    </main>
  );
}
