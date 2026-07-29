"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import styles from "./page.module.scss";

export default function BagPage() {
  const { items, totalPrice, totalCount, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  // Related products: available products not already in bag
  const bagSlugs = new Set(items.map((i) => i.product.slug));
  const related = products.filter((p) => p.available && !bagSlugs.has(p.slug));

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <ThemeSwitcher forceTheme="light" />
        <div className={styles.emptyState}>
          <h1>Your bag is empty.</h1>
          <p>Browse our store to find your next tool.</p>
          <Link href="/store" className={styles.shopBtn}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1>Review your bag.</h1>
            <p className={styles.headerSub}>Free delivery on all software orders.</p>
          </div>
          <Link href="/store/checkout/gate" className={styles.checkoutBtnTop}>
            Check Out
          </Link>
        </header>

        <div className={styles.divider} />

        {/* Item list */}
        <section className={styles.itemList}>
          {items.map((item) => (
            <div key={item.product.slug} className={styles.item}>
              <div className={styles.itemMedia}>
                {item.product.cardImage ? (
                  <Image
                    src={item.product.cardImage}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className={styles.itemImg}
                  />
                ) : (
                  <div className={styles.itemImgPlaceholder} />
                )}
              </div>

              <div className={styles.itemDetails}>
                <div className={styles.itemInfo}>
                  <h3>{item.product.name}</h3>
                  <p className={styles.itemType}>
                    {item.product.category === "software"
                      ? "Digital License (Perpetual)"
                      : item.product.category}
                  </p>
                </div>

                <div className={styles.itemQtyPrice}>
                  <div className={styles.qtySelector}>
                    <button
                      onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                      className={styles.qtyBtn}
                      aria-label="Decrease"
                    >−</button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                      className={styles.qtyBtn}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <span className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.product.slug)}
                className={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <div className={styles.divider} />

        {/* Order summary */}
        <section className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Delivery</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Link href="/store/checkout/gate" className={styles.checkoutBtn}>
            Check Out
          </Link>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <>
            <div className={styles.divider} />
            <section className={styles.related}>
              <h2 className={styles.relatedTitle}>
                You might also like.
              </h2>
              <div className={styles.relatedGrid}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/store/${p.slug}`} className={styles.relatedCard}>
                    {p.cardImage && (
                      <Image
                        src={p.cardImage}
                        alt={p.name}
                        width={120}
                        height={120}
                        className={styles.relatedImg}
                      />
                    )}
                    <div className={styles.relatedInfo}>
                      <h3>{p.name}</h3>
                      <p>{p.priceLabel}</p>
                      <span className={styles.relatedLearn}>Learn more</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
