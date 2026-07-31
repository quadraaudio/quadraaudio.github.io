import Link from "next/link";
import Image from "next/image";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/store/ProductCard";
import { HYDRA } from "@/data/hydra.landing";
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

        <Link href="/products/hydra" className={styles.hydraFeature}>
          <div className={styles.hydraMedia}>
            <Image
              src="/hydra/hero-studio.png"
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 60vw"
              className={styles.hydraImage}
            />
          </div>
          <div className={styles.hydraCopy}>
            <p className={styles.hydraEyebrow}>Featured</p>
            <h2>{HYDRA.name}</h2>
            <p>{HYDRA.headline}</p>
            <span className={styles.hydraLink}>Enter Hydra</span>
          </div>
        </Link>

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
