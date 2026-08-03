import styles from "../legal.module.scss";
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_INTRO,
  TERMS_SECTIONS,
  TERMS_TITLE,
  TERMS_VERSION,
} from "@/data/terms.eula";

export const metadata = {
  title: "Terms of Use",
  description:
    "Quadra Audio Terms of Use and End User License Agreement for all Quadra software and services.",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Legal</p>
        <h1 className="display display-md">{TERMS_TITLE}</h1>
        <p className={styles.meta}>
          Version {TERMS_VERSION} · Effective {TERMS_EFFECTIVE_DATE}
        </p>
        <div className={styles.prose}>
          {TERMS_INTRO.map((paragraph, index) => (
            <p key={`intro-${index}`}>{paragraph}</p>
          ))}
          {TERMS_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${index}`}>{paragraph}</p>
              ))}
            </section>
          ))}
          <p className={styles.footnote}>
            Version {TERMS_VERSION}. Related policies:{" "}
            <a href="/legal/privacy">Privacy Policy</a>
            {" · "}
            <a href="/legal/refunds">Refund Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
