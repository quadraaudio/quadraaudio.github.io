import styles from "../legal.module.scss";
import {
  REFUNDS_EFFECTIVE_DATE,
  REFUNDS_INTRO,
  REFUNDS_SECTIONS,
  REFUNDS_TITLE,
  REFUNDS_VERSION,
} from "@/data/refunds.policy";

export const metadata = {
  title: "Refunds",
  description:
    "Quadra Audio Refund & Returns Policy for digital software licenses, subscriptions, and store purchases.",
};

export default function RefundsPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Legal</p>
        <h1 className="display display-md">{REFUNDS_TITLE}</h1>
        <p className={styles.meta}>
          Version {REFUNDS_VERSION} · Effective {REFUNDS_EFFECTIVE_DATE}
        </p>
        <div className={styles.prose}>
          {REFUNDS_INTRO.map((paragraph, index) => (
            <p key={`intro-${index}`}>{paragraph}</p>
          ))}
          {REFUNDS_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${index}`}>{paragraph}</p>
              ))}
            </section>
          ))}
          <p className={styles.footnote}>
            Version {REFUNDS_VERSION}. Related policies:{" "}
            <a href="/legal/terms">Terms of Use</a>
            {" · "}
            <a href="/legal/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
