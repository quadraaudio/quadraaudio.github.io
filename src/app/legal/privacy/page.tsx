import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";
import styles from "@/components/LegalLayout.module.scss";

export const metadata = {
  title: "Privacy Policy — Quadra Audio Legal",
  description:
    "Learn how Quadra Audio collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      activeSlug="privacy"
      eyebrow="Quadra Privacy & Governance"
      title="Privacy Policy"
      updated="July 2026"
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          Quadra Audio (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is
          committed to protecting your personal data. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit{" "}
          <Link href="/">quadraaudio.com</Link>, purchase software licenses, use Quadra ID
          services, or operate Hydra virtual soundcard software.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>
          We collect minimal information strictly required to deliver software licenses,
          process orders, and provide technical customer support:
        </p>
        <ul>
          <li>
            <strong>Account &amp; Identity Information:</strong> Name, email address, and
            authentication identifiers provided when creating a Quadra ID.
          </li>
          <li>
            <strong>Hardware Identifiers:</strong> Hardware GUIDs and local Mac machine
            identifiers submitted exclusively to generate offline <code>.qkey</code>{" "}
            license files and validate machine activations.
          </li>
          <li>
            <strong>Transaction &amp; Order History:</strong> Order numbers, product
            licenses purchased, discount codes applied, and transaction timestamps.
            Payment card processing is handled directly by encrypted payment gateways
            (PayPal); we do not store full payment card numbers.
          </li>
          <li>
            <strong>Technical Diagnostics (Optional):</strong> Anonymous crash reports,
            Core Audio buffer xrun logs, and software version information submitted
            voluntarily or during automated update checks.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To issue, authenticate, and manage your software licenses and Mac machine activations.</li>
          <li>To process transactions and deliver electronic software licenses.</li>
          <li>To provide engineering support for Core Audio, AES67, NDI®, and Matrix Grid configurations.</li>
          <li>To notify you about critical software updates, bug fixes, and security advisories.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing and Non-Monetization</h2>
        <div className={styles.callout}>
          <strong>Notice on Data Monetization:</strong> We do not sell, rent, lease, or
          trade your personal information to third parties, advertising networks, or data
          brokers.
        </div>
        <p>
          Information is disclosed only to third-party service providers (such as payment
          processors, database hosts, and authentication services) strictly as required to
          operate our licensing infrastructure and customer support.
        </p>
      </section>

      <section>
        <h2>5. Your Rights &amp; Choices (CCPA / CPRA)</h2>
        <ul>
          <li><strong>Right to Access:</strong> Request details on personal information we collect and process.</li>
          <li><strong>Right to Deletion:</strong> Request deletion of your Quadra ID account and associated data, subject to legal recordkeeping requirements.</li>
          <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any statutory privacy right.</li>
        </ul>
      </section>

      <section>
        <h2>6. Data Security</h2>
        <p>
          We implement industry-standard administrative, technical, and physical
          safeguards — including TLS 1.3 transport encryption, database Row Level Security
          (RLS), and cryptographic signature validation — designed to protect your
          personal data from unauthorized access or disclosure.
        </p>
      </section>

      <section>
        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Our software and services are designed for professional audio producers and
          engineers. We do not knowingly collect or solicit personal information from
          children under the age of 13.
        </p>
      </section>

      <section>
        <h2>8. Contact Support</h2>
        <p>
          If you have questions regarding this Privacy Policy or your Quadra ID account,
          please submit a request through the{" "}
          <Link href="/support/contact">Quadra Support Desk</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
