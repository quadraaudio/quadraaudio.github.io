import {
  MATRIX_GLOSS,
  QUADRA_BRAND,
} from "@/data/brand.messaging";
import styles from "../about/simple.module.scss";

export const metadata = {
  title: "Contact",
  description: "Contact Quadra Audio for support, sales, and press.",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Contact</p>
        <h1 className="display display-lg">Talk to Quadra.</h1>
        <p className="lede">
          Questions about MATRIX, licensing, or your order — we read every
          message. Most replies arrive within one business day.
        </p>
        <div className={styles.prose}>
          <p>
            <strong>Support:</strong>{" "}
            <a href="mailto:support@quadraaudio.com">support@quadraaudio.com</a>
          </p>
          <p>
            <strong>Sales:</strong>{" "}
            <a href="mailto:sales@quadraaudio.com">sales@quadraaudio.com</a>
          </p>
          <p>
            <strong>Press:</strong>{" "}
            <a href="mailto:press@quadraaudio.com">press@quadraaudio.com</a>
          </p>
          <p>
            {QUADRA_BRAND.catalogNote} For setup help, start with{" "}
            <a href="/support">Support</a> or the{" "}
            <a href="/support/article/getting-started">Getting Started</a> guide
            — including the {MATRIX_GLOSS.trialDays}-day trial and activation
            flow.
          </p>
        </div>
      </div>
    </main>
  );
}
