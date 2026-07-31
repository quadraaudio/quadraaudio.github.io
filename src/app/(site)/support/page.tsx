import Link from "next/link";
import styles from "./simple.module.scss";

export const metadata = {
  title: "Support",
  description: "Get help with Quadra software and licensing.",
};

export default function SupportPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Support</p>
        <h1 className="display display-lg">We&apos;re here for working studios.</h1>
        <p className="lede">
          Find answers about installs, licensing, and account access — or reach
          the team directly.
        </p>
        <div className={styles.cards}>
          <article>
            <h2>Licensing</h2>
            <p>Manage activations and orders from your Quadra account.</p>
            <Link href="/account">Open account</Link>
          </article>
          <article>
            <h2>Contact</h2>
            <p>Questions about products, purchases, or partnerships.</p>
            <Link href="/contact">Contact support</Link>
          </article>
          <article>
            <h2>Store</h2>
            <p>Browse current software and perpetual licenses.</p>
            <Link href="/store">Visit store</Link>
          </article>
        </div>
      </div>
    </main>
  );
}
