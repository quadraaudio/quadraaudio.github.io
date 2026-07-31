"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/products";
import styles from "./bag.module.scss";

export default function BagPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Bag</p>
        <h1 className="display display-lg">Review your bag.</h1>

        {!items.length ? (
          <div className={styles.empty}>
            <p>Your bag is empty.</p>
            <Link href="/store" className="btn btn-primary">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.slug} className={styles.item}>
                  <div
                    className={styles.thumb}
                    style={{ background: item.cardGradient }}
                  />
                  <div className={styles.meta}>
                    <h2>{item.name}</h2>
                    <p>{formatPrice(item.price, item.currency)}</p>
                    <div className={styles.qty}>
                      <label htmlFor={`qty-${item.slug}`}>Qty</label>
                      <input
                        id={`qty-${item.slug}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          setQuantity(item.slug, Number(e.target.value) || 1)
                        }
                      />
                      <button type="button" onClick={() => removeItem(item.slug)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className={styles.summary}>
              <h2>Summary</h2>
              <div className={styles.row}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <Link href="/store/checkout" className="btn btn-primary">
                Continue to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
