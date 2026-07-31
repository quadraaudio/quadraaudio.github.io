import Link from "next/link";
import ThemeSetter from "@/components/ThemeSetter";
import styles from "./page.module.scss";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Hydra", href: "/hydra" },
      { label: "Hydra Pro", href: "/store/hydra-pro" },
      { label: "Quadra Core I/O", href: "/store/quadra-core-io" },
      { label: "Store", href: "/store" },
    ],
  },
  {
    title: "Account & Support",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Sign In", href: "/login" },
      { label: "Support", href: "/support" },
      { label: "Contact Us", href: "/support/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Sales & Refunds", href: "/legal/refunds" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />
      <h1 className={`headline ${styles.title}`}>Site Map</h1>
      <div className={styles.grid}>
        {COLUMNS.map((col) => (
          <div key={col.title} className={styles.column}>
            <h2>{col.title}</h2>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
