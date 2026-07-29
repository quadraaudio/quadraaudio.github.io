import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Sales & Refunds — Quadra Audio Legal",
  description: "Quadra Audio Sales and Refund Policies for digital software licenses.",
};

export default function SalesAndRefundsPage() {
  return (
    <div className={styles.legalPage}>
      <ThemeSwitcher forceTheme="light" />

      {/* Sticky Apple Legal SubNav Header */}
      <div className={styles.legalSubNav}>
        <div className={styles.legalSubNavContent}>
          <span className={styles.legalBreadcrumb}>
            Legal <span className={styles.slash}>/</span> Sales &amp; Refunds
          </span>
          <nav className={styles.legalNavLinks}>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms of Use</Link>
            <Link href="/legal/refunds" className={styles.activeLink}>Sales &amp; Refunds</Link>
          </nav>
        </div>
      </div>

      <div className={styles.legalContainer}>
        <header className={styles.legalHeader}>
          <span className={styles.legalEyebrow}>Quadra Store Policies</span>
          <h1 className={styles.legalTitle}>Sales &amp; Refunds Policy</h1>
          <p className={styles.lastUpdated}>Effective Date: July 2026</p>
        </header>

        <article className={styles.legalArticle}>
          <section className={styles.legalSection}>
            <h2>1. 14-Day Money-Back Guarantee</h2>
            <p>
              We want you to be completely satisfied with Hydra software. If you purchase a perpetual license or commercial subscription and experience technical incompatibility or dissatisfaction with the software, you are eligible to request a full refund within fourteen (14) days of your purchase date.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>2. Electronic Software Delivery (ESD) &amp; Free Trial</h2>
            <p>
              All Quadra software products are delivered electronically via digital download and activated via Quadra ID or offline <code>.qkey</code> files. To ensure software suitability prior to purchase:
            </p>
            <ul className={styles.legalList}>
              <li>We offer a fully functional 90-day free trial with no channel limits or watermarks.</li>
              <li>We encourage all users to test Hydra with their physical hardware interfaces, DAWs, and local network switches during the trial period.</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>3. How to Request a Refund</h2>
            <p>
              To submit a refund request within the 14-day window:
            </p>
            <ul className={styles.legalList}>
              <li>Sign in to your <Link href="/account">Quadra ID Account</Link>.</li>
              <li>Locate your Order Reference ID (e.g., <code>Q-ORD-XXXXXX</code>) or license key.</li>
              <li>Submit a request through our <Link href="/support/contact">Engineering Support Portal</Link>.</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>4. Refund Processing and License Revocation</h2>
            <p>
              Once a refund is approved and processed:
            </p>
            <ul className={styles.legalList}>
              <li>Refunds are credited back to the original payment method (Credit Card or PayPal) within 5–10 business days, depending on your financial institution.</li>
              <li>The associated software license will be revoked, and active Mac device authorizations registered to your Quadra ID will be automatically unregistered.</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>5. Promotions and Discount Codes</h2>
            <p>
              Orders completed using 100% off promotional discount codes ($0.00 orders) do not incur charges and are not eligible for monetary payouts.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
