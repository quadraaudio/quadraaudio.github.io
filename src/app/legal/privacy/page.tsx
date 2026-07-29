import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Privacy Policy — Quadra Audio Legal",
  description: "Learn how Quadra Audio collects, uses, and protects your personal data under applicable US privacy laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.legalPage}>
      <ThemeSwitcher forceTheme="dark" />

      {/* Sticky Apple Legal SubNav Header */}
      <div className={styles.legalSubNav}>
        <div className={styles.legalSubNavContent}>
          <span className={styles.legalBreadcrumb}>
            Legal <span className={styles.slash}>/</span> Privacy Policy
          </span>
          <nav className={styles.legalNavLinks}>
            <Link href="/legal/privacy" className={styles.activeLink}>Privacy</Link>
            <Link href="/legal/terms">Terms of Use</Link>
            <Link href="/legal/refunds">Sales &amp; Refunds</Link>
          </nav>
        </div>
      </div>

      <div className={styles.legalContainer}>
        <header className={styles.legalHeader}>
          <span className={styles.legalEyebrow}>Quadra Privacy &amp; Governance</span>
          <h1 className={styles.legalTitle}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Effective Date: July 2026</p>
        </header>

        <article className={styles.legalArticle}>
          <section className={styles.legalSection}>
            <h2>1. Introduction</h2>
            <p>
              Quadra Audio ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <Link href="/">quadraaudio.com</Link>, purchase software licenses, use Quadra ID services, or operate Hydra virtual soundcard software.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>2. Information We Collect</h2>
            <p>
              We collect minimal information strictly required to deliver software licenses, process orders, and provide technical customer support:
            </p>
            <ul className={styles.legalList}>
              <li><strong>Account &amp; Identity Information:</strong> Name, email address, and authentication identifiers provided when creating a Quadra ID or signing in via Google OAuth.</li>
              <li><strong>Hardware Identifiers:</strong> Hardware GUIDs and local Mac machine identifiers submitted exclusively to generate offline <code>.qkey</code> license files and validate machine activations.</li>
              <li><strong>Transaction &amp; Order History:</strong> Order numbers, product licenses purchased, discount codes applied, and transaction timestamps. Financial payment card processing is handled directly by encrypted payment gateways (PayPal / Stripe); we do not store full financial payment card numbers.</li>
              <li><strong>Technical Diagnostics (Optional):</strong> Anonymous crash reports, Core Audio buffer xrun logs, and software version information submitted voluntarily or during automated update checks.</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>3. How We Use Your Information</h2>
            <p>
              We use collected information solely for legitimate operational purposes:
            </p>
            <ul className={styles.legalList}>
              <li>To issue, authenticate, and manage your software licenses and Mac machine activations.</li>
              <li>To process transactions and deliver electronic software licenses.</li>
              <li>To provide engineering customer support for Core Audio, NDI®, AVB, and spatial audio configurations.</li>
              <li>To notify you about critical software updates, bug fixes, and security advisories.</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>4. Data Sharing and Non-Monetization</h2>
            <div className={styles.legalCallout}>
              <strong>Notice on Data Monetization:</strong> We do not sell, rent, lease, or trade your personal information to third parties, advertising networks, or data brokers.
            </div>
            <p>
              Information is disclosed only to third-party service providers (such as payment processors, database hosts, and authentication services) strictly as required to operate our licensing infrastructure and customer support services.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>5. Your Rights &amp; Choices (CCPA / CPRA)</h2>
            <p>
              Under applicable US federal and state privacy laws (including the California Consumer Privacy Act / CCPA as amended by CPRA):
            </p>
            <ul className={styles.legalList}>
              <li><strong>Right to Access:</strong> You have the right to request details regarding the personal information we collect and process.</li>
              <li><strong>Right to Deletion:</strong> You may request the deletion of your Quadra ID account and associated personal data, subject to legal recordkeeping requirements for financial transactions.</li>
              <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any of your statutory privacy rights.</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard administrative, technical, and physical safeguards—including TLS 1.3 transport encryption, database Row Level Security (RLS), and cryptographic signature validation—designed to protect your personal data from unauthorized access or disclosure.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>7. Children's Privacy</h2>
            <p>
              Our software and services are designed for professional audio producers and engineers. We do not knowingly collect or solicit personal information from children under the age of 13.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2>8. Contact Engineering Support</h2>
            <p>
              If you have any questions or requests regarding this Privacy Policy or your Quadra ID account, please submit a request through the <Link href="/support/contact">Quadra Support Desk</Link>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
