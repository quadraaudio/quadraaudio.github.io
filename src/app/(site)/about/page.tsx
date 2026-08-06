import Link from "next/link";
import {
  MATRIX_GLOSS,
  QUADRA_BRAND,
  QUADRA_CTAS,
} from "@/data/brand.messaging";
import styles from "./simple.module.scss";

export const metadata = {
  title: "About",
  description: QUADRA_BRAND.story,
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">About</p>
        <h1 className="display display-lg">Software for Mac studios.</h1>
        <p className="lede">{QUADRA_BRAND.story}</p>
        <div className={styles.prose}>
          <p>
            Quadra is a software house for professional audio. We make tools
            you buy once, activate with your Quadra ID, and keep using offline —
            the kind of utilities that stay installed for years.
          </p>
          <p>
            <strong>{QUADRA_BRAND.catalogNote}</strong> {MATRIX_GLOSS.oneLiner}{" "}
            {MATRIX_GLOSS.who}
          </p>
          <p>
            Buy a perpetual license in the Quadra Store, or start a{" "}
            {MATRIX_GLOSS.trialDays}-day full trial from MATRIX on your Mac.
            Seats and account tools live under your Quadra ID.
          </p>
        </div>
        <div className={styles.ctaRow}>
          <Link href={QUADRA_CTAS.exploreMatrix.href} className="btn btn-primary">
            {QUADRA_CTAS.exploreMatrix.label}
          </Link>
          <Link href={QUADRA_CTAS.buyMatrix.href} className="btn btn-secondary">
            {QUADRA_CTAS.buyMatrix.label}
          </Link>
        </div>
      </div>
    </main>
  );
}
