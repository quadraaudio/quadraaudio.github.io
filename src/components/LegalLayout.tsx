import Link from "next/link";
import ThemeSetter from "./ThemeSetter";
import styles from "./LegalLayout.module.scss";

interface LegalLayoutProps {
  activeSlug: "privacy" | "terms" | "refunds";
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}

const TABS = [
  { slug: "privacy", label: "Privacy", href: "/legal/privacy" },
  { slug: "terms", label: "Terms of Use", href: "/legal/terms" },
  { slug: "refunds", label: "Sales & Refunds", href: "/legal/refunds" },
] as const;

export default function LegalLayout({
  activeSlug,
  eyebrow,
  title,
  updated,
  children,
}: LegalLayoutProps) {
  const activeLabel = TABS.find((t) => t.slug === activeSlug)?.label;

  return (
    <div>
      <ThemeSetter theme="light" />

      <div className={styles.subNav}>
        <div className={styles.subNavInner}>
          <span className={styles.breadcrumb}>Legal &nbsp;/&nbsp; {activeLabel}</span>
          <nav className={styles.navLinks}>
            {TABS.map((tab) => (
              <Link
                key={tab.slug}
                href={tab.href}
                className={tab.slug === activeSlug ? styles.activeLink : ""}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Effective Date: {updated}</p>
        </header>

        <article className={styles.article}>{children}</article>
      </div>
    </div>
  );
}
