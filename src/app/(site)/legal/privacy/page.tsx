import styles from "../legal.module.scss";
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
  PRIVACY_VERSION,
} from "@/data/privacy.policy";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Quadra Audio Privacy Policy explaining how we collect, use, and protect personal data across our software and services.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Legal</p>
        <h1 className="display display-md">{PRIVACY_TITLE}</h1>
        <p className={styles.meta}>
          Version {PRIVACY_VERSION} · Effective {PRIVACY_EFFECTIVE_DATE}
        </p>
        <div className={styles.prose}>
          {PRIVACY_INTRO.map((paragraph, index) => (
            <p key={`intro-${index}`}>{paragraph}</p>
          ))}
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${index}`}>{paragraph}</p>
              ))}
            </section>
          ))}
          <p className={styles.footnote}>
            Version {PRIVACY_VERSION}. Related policies:{" "}
            <a href="/legal/terms">Terms of Use</a>
            {" · "}
            <a href="/legal/refunds">Refund Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
