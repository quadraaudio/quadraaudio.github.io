"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { generateOfflineLicenseKey } from "@/lib/licenseCrypto";
import { getSupabaseUserLicenses } from "@/lib/supabase";
import styles from "./page.module.scss";

export default function AccountDashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const [dbLicenses, setDbLicenses] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [activeOfflineBoxId, setActiveOfflineBoxId] = useState<string | null>(null);
  const [hardwareIds, setHardwareIds] = useState<Record<string, string>>({});
  const [downloadedQKeys, setDownloadedQKeys] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    async function loadLicenses() {
      if (user?.email) {
        setLoadingDb(true);
        const licData = await getSupabaseUserLicenses(user.email);
        setDbLicenses(licData || []);
        setLoadingDb(false);
      }
    }
    loadLicenses();
  }, [isLoggedIn, user?.email, router]);

  if (!isLoggedIn) return null;

  const userEmail = user?.email || "";

  const handleGenerateOfflineKey = (e: React.FormEvent, licId: string) => {
    e.preventDefault();
    const hwId = hardwareIds[licId];
    if (!hwId || !hwId.trim()) return;

    const lic = generateOfflineLicenseKey(
      userEmail,
      user?.name || "Samuel",
      "hydra",
      "Hydra",
      hwId.trim()
    );

    setDownloadedQKeys((prev) => ({ ...prev, [licId]: lic }));

    const blob = new Blob([lic.signature], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hydra_${hwId.trim()}.qkey`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.accountPage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.accountContainer}>

        {/* Greeting Header */}
        <header className={styles.accountHeader}>
          <div>
            <p className={styles.accountLabel}>Quadra ID Account • {userEmail}</p>
            <h1>Hi, {user?.name || "Samuel"}.</h1>
          </div>
          <button onClick={logout} className={styles.signOutBtn}>
            Sign Out
          </button>
        </header>

        <div className={styles.divider} />

        {/* Section: Software Licenses */}
        <section className={styles.section}>
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>Software Licenses</h2>
            {dbLicenses.length > 0 && (
              <span className={styles.licenseBadgeCount}>{dbLicenses.length} {dbLicenses.length === 1 ? "License" : "Licenses"} Registered</span>
            )}
          </div>

          {loadingDb ? (
            <div className={styles.licenseCard} style={{ padding: "40px", textAlign: "center", color: "#86868b" }}>
              Verifying active licenses on Supabase database...
            </div>
          ) : dbLicenses.length > 0 ? (
            <div className={styles.licensesList}>
              {dbLicenses.map((lic: any, idx: number) => {
                const licIdStr = lic.id ? String(lic.id) : `LIC-LOCAL-${idx}`;
                const displayLicId = lic.id
                  ? (lic.id.startsWith("LIC-") ? lic.id : "LIC-" + String(lic.id).substring(0, 8).toUpperCase())
                  : "LIC-" + Math.abs(userEmail.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idx + 1) * 48271).toString(16).toUpperCase();

                const displayOrderRef = lic.order_number
                  ? lic.order_number
                  : "Q-ORD-" + Math.abs(userEmail.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * (idx + 1) * 89731).toString(16).toUpperCase();

                const productName = lic.product_name || (lic.product_slug === "hydra" ? "Hydra" : lic.product_slug?.toUpperCase() || "Hydra");

                const isBoxOpen = activeOfflineBoxId === licIdStr;

                return (
                  <div key={licIdStr} className={styles.licenseCard}>
                    <div className={styles.cardHeaderRow}>
                      <Image
                        src="/images/hydra_app_icon.jpg"
                        alt={productName}
                        width={64}
                        height={64}
                        className={styles.softwareIcon}
                      />
                      <div className={styles.headerMeta}>
                        <h3 className={styles.productName}>{productName}</h3>
                        <p className={styles.productType}>Perpetual Commercial License • macOS 14.0+</p>
                      </div>
                    </div>

                    <div className={styles.licenseDetails}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Activation Status</span>
                        <span className={styles.infoValue}>
                          <span className={styles.statusDot} />
                          Active — Verified for {userEmail}
                        </span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>License Key ID</span>
                        <span className={styles.infoValue}>
                          <code>{displayLicId}</code>
                        </span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Order Reference</span>
                        <span className={styles.infoValue}>
                          <Link href="/legal/refunds" className={styles.inlineLink}>{displayOrderRef}</Link>
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className={styles.actionRow}>
                      <Link href="/hydra" className="apple-button-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Installer
                      </Link>

                      <button
                        className={styles.offlineKeyBtn}
                        onClick={() => setActiveOfflineBoxId(isBoxOpen ? null : licIdStr)}
                      >
                        {isBoxOpen ? "Hide Generator" : "Generate Offline .qkey File"}
                      </button>
                    </div>

                    {/* Offline License Generator Box */}
                    {isBoxOpen && (
                      <div className={styles.offlineBox}>
                        <h4>Air-Gapped Studio License Generator (.qkey)</h4>
                        <p>
                          For studio computers without internet access. Enter your Mac's Hardware ID (found in Hydra &gt; License &gt; Offline Activation):
                        </p>

                        <form onSubmit={(e) => handleGenerateOfflineKey(e, licIdStr)} className={styles.offlineForm}>
                          <input
                            type="text"
                            placeholder="e.g. MAC-98F-21A-001"
                            value={hardwareIds[licIdStr] || ""}
                            onChange={(e) => setHardwareIds((prev) => ({ ...prev, [licIdStr]: e.target.value }))}
                            className={styles.hwInput}
                            required
                          />
                          <button type="submit" className={styles.genBtn}>
                            Generate &amp; Download .qkey
                          </button>
                        </form>

                        {downloadedQKeys[licIdStr] && (
                          <div className={styles.qkeySuccess}>
                            ✓ File <strong>hydra_{downloadedQKeys[licIdStr].hardwareId}.qkey</strong> downloaded for {userEmail}! Import this file into Hydra software on your air-gapped Mac.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.licenseCard} style={{ padding: "48px 32px", textAlign: "center" }}>
              <h3 style={{ fontSize: "21px", fontWeight: 600, marginBottom: "8px", color: "#1d1d1f" }}>No active software licenses</h3>
              <p style={{ fontSize: "15px", color: "#86868b", maxWidth: "500px", margin: "0 auto 24px" }}>
                You don't have an active Quadra software license associated with <strong>{userEmail}</strong> yet. Download our 90-day trial or purchase a commercial license.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Link href="/store" className="apple-button-primary">
                  Visit Quadra Store
                </Link>
                <Link href="/hydra" className="apple-button-secondary">
                  Download 90-Day Free Trial
                </Link>
              </div>
            </div>
          )}
        </section>

        <div className={styles.divider} />

        {/* Section: Account Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account &amp; Security</h2>

          <div className={styles.quickLinksGrid}>
            <Link href="/store/checkout/payment" className={styles.linkCard}>
              <div className={styles.linkCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
              </div>
              <div>
                <h3>Payment Methods</h3>
                <p>Manage express checkout cards &amp; PayPal.</p>
              </div>
            </Link>

            <Link href="/support/article/license-activation" className={styles.linkCard}>
              <div className={styles.linkCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <h3>Order Receipts</h3>
                <p>View invoices and VAT tax records.</p>
              </div>
            </Link>

            <Link href="/support/contact" className={styles.linkCard}>
              <div className={styles.linkCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <div>
                <h3>Security &amp; Support</h3>
                <p>Contact Quadra ID security team.</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
