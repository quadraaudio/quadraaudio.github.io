import Link from "next/link";
import styles from "./SupportArticleLayout.module.scss";

interface SupportArticleLayoutProps {
  category: string;
  title: string;
  date: string;
  articleId: string;
  summary: string;
  children: React.ReactNode;
}

export function SupportArticleLayout({
  category,
  title,
  date,
  articleId,
  summary,
  children,
}: SupportArticleLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/support">Support</Link>
          <span aria-hidden>/</span>
          <span>{category}</span>
        </nav>

        <p className="eyebrow">{category}</p>
        <h1 className={`display display-lg ${styles.title}`}>{title}</h1>
        <p className={styles.meta}>
          Updated: {date} · Reference: Q-KB-{articleId}
        </p>

        <div className={styles.lead}>{summary}</div>

        <div className={styles.content}>{children}</div>

        <aside className={styles.help}>
          <h2>Need more help?</h2>
          <p>
            Reach the team at{" "}
            <a href="mailto:support@quadraaudio.com">support@quadraaudio.com</a>{" "}
            or via the <Link href="/contact">contact page</Link>. Include your
            Hydra version, macOS version, and steps to reproduce.
          </p>
        </aside>

        <p className={styles.back}>
          <Link href="/support">← All support topics</Link>
        </p>
      </div>
    </main>
  );
}
