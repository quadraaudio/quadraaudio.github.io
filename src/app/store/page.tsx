import { ProductCard } from "@/components/store/ProductCard";
import { listProducts } from "@/lib/products";
import styles from "./store.module.scss";

export const metadata = {
  title: "Store",
  description: "Buy Quadra professional audio software licenses.",
};

export default async function StorePage() {
  const products = await listProducts();

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Store</p>
        <h1 className="display display-lg">Software for working studios.</h1>
        <p className="lede">
          Perpetual licenses with account-backed checkout. Placeholder catalog —
          replace with your final SKUs anytime.
        </p>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
