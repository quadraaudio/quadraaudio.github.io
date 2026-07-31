import Link from "next/link";
import styles from "./SupportArticleLayout.module.scss";

interface RelatedArticle {
  id: string;
  title: string;
}

interface SupportArticleLayoutProps {
  category: string;
  title: string;
  date: string;
  articleId: string;
  summary: string;
  related?: RelatedArticle[];
  children: React.ReactNode;
}

export function SupportArticleLayout({
  category,
  title,
  date,
  summary,
  related = [],
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

        <p className={styles.category}>{category}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.meta}>Updated {date}</p>

        <div className={styles.lead}>{summary}</div>

        <div className={styles.content}>{children}</div>

        {related.length > 0 && (
          <aside className={styles.related}>
            <h2>Related articles</h2>
            <ul>
              {related.map((item) => (
                <li key={item.id}>
                  <Link href={`/support/article/${item.id}`}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <aside className={styles.help}>
          <h2>Need more help?</h2>
          <p>
            <Link href="/contact">Contact Quadra</Link>
            {" · "}
            <a href="mailto:support@quadraaudio.com">support@quadraaudio.com</a>
          </p>
        </aside>

        <p className={styles.back}>
          <Link href="/support">← Back to Support</Link>
        </p>
      </div>
    </main>
  );
}
