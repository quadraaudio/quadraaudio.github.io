import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Privacy Policy — Quadra Audio",
  description: "Learn how Quadra Audio collects, uses, and protects your personal data under applicable US privacy laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Effective Date: July 2026</p>
        </header>

        <main className={styles.content}>
          <h2>1. Introduction</h2>
          <p>
            Quadra Audio ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, purchase our software licenses, use Quadra ID services, or operate Hydra software.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect minimal information necessary to deliver software licenses, process orders, and provide technical customer support:
          </p>
          <ul>
            <li><strong>Account &amp; Contact Information:</strong> Name, email address, and authentication identifiers provided when creating a Quadra ID or authenticating via Google OAuth.</li>
            <li><strong>Software License &amp; Machine Identifiers:</strong> Hardware GUIDs and local machine identifiers submitted exclusively to validate machine activations and generate offline <code>.qkey</code> license files.</li>
            <li><strong>Transaction &amp; Order History:</strong> Order numbers, product licenses purchased, discount codes applied, and transaction timestamps. Payment processing details (such as credit card numbers or PayPal credentials) are handled directly by payment service providers; we do not store full financial payment card numbers.</li>
            <li><strong>Technical Diagnostics (Optional):</strong> Anonymous crash reports, Core Audio buffer xrun logs, and software version information submitted voluntarily or during automated update checks.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use collected information solely for legitimate operational purposes:
          </p>
          <ul>
            <li>To issue, authenticate, and manage your software licenses and machine activations.</li>
            <li>To process orders and deliver electronic license keys.</li>
            <li>To provide engineering customer support for Core Audio, NDI®, AVB, and spatial audio configurations.</li>
            <li>To notify you about software updates, bug fixes, and security advisories.</li>
          </ul>

          <h2>4. Data Sharing and Non-Monetization</h2>
          <p>
            <strong>We do not sell, rent, lease, or trade your personal information to third parties or data brokers.</strong>
          </p>
          <p>
            Information is disclosed only to third-party service providers (such as payment gateways, database hosts, and authentication providers) strictly as required to operate our licensing infrastructure and services.
          </p>

          <h2>5. Your Rights &amp; Choices</h2>
          <p>
            Under applicable federal and state privacy laws (including the California Consumer Privacy Act / CCPA as amended by CPRA):
          </p>
          <ul>
            <li><strong>Right to Know &amp; Access:</strong> You have the right to request details regarding the personal information we collect and process.</li>
            <li><strong>Right to Deletion:</strong> You may request the deletion of your Quadra ID account and associated personal data, subject to legal recordkeeping requirements for completed financial transactions.</li>
            <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any of your privacy rights.</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards—including TLS encryption and database Row Level Security (RLS)—designed to protect your personal data from unauthorized access, loss, or disclosure.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our software and services are designed for professional audio producers and engineers. We do not knowingly collect or solicit personal information from children under the age of 13.
          </p>

          <h2>8. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable legal requirements. The updated policy will be posted on this page with an updated effective date.
          </p>

          <div className={styles.contactBox}>
            <h3>Contact Us</h3>
            <p>
              If you have any questions or requests regarding this Privacy Policy, please contact our support team at <Link style={{ color: '#0071e3', textDecoration: 'none' }} href="/support/contact">Quadra Support</Link>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
