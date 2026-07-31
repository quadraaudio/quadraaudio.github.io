import Link from "next/link";
import styles from "./LocalNav.module.scss";

interface LocalNavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface LocalNavProps {
  title: string;
  price?: string;
  buyUrl?: string;
  links: LocalNavLink[];
}

export default function LocalNav({ title, price, buyUrl, links }: LocalNavProps) {
  return (
    <div className={styles.localNav}>
      <div className={styles.inner}>
        <span className={styles.title}>{title}</span>
        <nav className={styles.links}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${link.active ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          {price && <span className={styles.price}>From {price}</span>}
          {buyUrl && (
            <Link href={buyUrl} className={styles.buyBtn}>
              Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
