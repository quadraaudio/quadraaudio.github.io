import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export const metadata = {
  title: "Sales and Refunds — Quadra Audio",
  description: "Quadra Audio Sales and Refund Policies for digital software licenses.",
};

export default function SalesAndRefundsPage() {
  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Sales and Refunds Policy</h1>
          <p className={styles.lastUpdated}>Effective Date: July 2026</p>
        </header>

        <main className={styles.content}>
          <h2>1. 14-Day Money-Back Guarantee</h2>
          <p>
            We want you to be completely satisfied with Hydra software. If you purchase a perpetual license or commercial subscription and experience technical incompatibility or dissatisfaction with the software, you are eligible to request a full refund within fourteen (14) days of your purchase date.
          </p>

          <h2>2. Electronic Software Delivery (ESD) &amp; Free Trial</h2>
          <p>
            All Quadra software products are delivered electronically via digital download and activated via Quadra ID or offline <code>.qkey</code> files. To ensure software suitability prior to purchase:
          </p>
          <ul>
            <li>We offer a fully functional 90-day free trial with no channel limits or watermarks.</li>
            <li>We encourage all users to test Hydra with their physical hardware interfaces, DAWs, and local network switches during the trial period.</li>
          </ul>

          <h2>3. How to Request a Refund</h2>
          <p>
            To submit a refund request within the 14-day window:
          </p>
          <ul>
            <li>Sign in to your <Link style={{ color: '#0071e3', textDecoration: 'none' }} href="/account">Quadra ID Account</Link>.</li>
            <li>Locate your Order Reference ID (e.g., <code>Q-ORD-XXXXXX</code>) or license key.</li>
            <li>Submit a request through our <Link style={{ color: '#0071e3', textDecoration: 'none' }} href="/support/contact">Engineering Support Portal</Link>.</li>
          </ul>

          <h2>4. Refund Processing and License Revocation</h2>
          <p>
            Once a refund is approved and processed:
          </p>
          <ul>
            <li>Refunds are credited back to the original payment method (Credit Card or PayPal) within 5–10 business days, depending on your financial institution.</li>
            <li>The associated software license will be revoked, and active Mac device authorizations registered to your Quadra ID will be automatically unregistered.</li>
          </ul>

          <h2>5. Promotions and Discount Codes</h2>
          <p>
            Orders completed using 100% off promotional discount codes ($0.00 orders) do not incur charges and are not eligible for monetary payouts.
          </p>
        </main>
      </div>
    </div>
  );
}
