import Link from "next/link";
import { LogoMark } from "@/components/chrome/LogoMark";
import styles from "./GlobalFooter.module.scss";

export function GlobalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page-shell ${styles.inner}`}>
        <div className={styles.brand}>
          <LogoMark withWordmark size="lg" />
          <p className={styles.tag}>
            Professional audio software for studios, producers, and engineers.
          </p>
        </div>

        <div className={styles.cols}>
          <div>
            <p className={styles.label}>Product</p>
            <Link href="/products/matrix">MATRIX</Link>
            <Link href="/store/quadra-matrix">Buy MATRIX</Link>
            <Link href="/products">Products</Link>
            <Link href="/store">Store</Link>
            <Link href="/about">About</Link>
          </div>
          <div>
            <p className={styles.label}>Resources</p>
            <Link href="/support">Support</Link>
            <Link href="/support/article/getting-started">Getting Started</Link>
            <Link href="/support/article/troubleshooting">Troubleshooting</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/account">Account</Link>
            <Link href="/admin/products">Store admin</Link>
          </div>
          <div>
            <p className={styles.label}>Legal</p>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/refunds">Refunds</Link>
          </div>
        </div>
      </div>
      <div className={`page-shell ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Quadra Audio</p>
      </div>
    </footer>
  );
}
