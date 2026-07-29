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
  const [showOfflineBox, setShowOfflineBox] = useState(false);
  const [hardwareId, setHardwareId] = useState("");
  const [downloadedQKey, setDownloadedQKey] = useState<any>(null);

  // Guard: if not logged in, redirect to login page
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
  const hasActiveLicense = dbLicenses.length > 0;
  const activeLic = dbLicenses[0];

  const userOrderRef = activeLic?.id
    ? "Q-ORD-" + activeLic.id.substring(0, 8).toUpperCase()
    : "Q-ORD-" + Math.abs(userEmail.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 89731).toString(16).toUpperCase();

  const userLicenseId = activeLic?.id
    ? "LIC-" + activeLic.id.substring(0, 8).toUpperCase()
    : "LIC-" + Math.abs(userEmail.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 48271).toString(16).toUpperCase();

  const handleGenerateOfflineKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hardwareId.trim()) return;

    const lic = generateOfflineLicenseKey(
      userEmail,
      user?.name || "Samuel",
      "hydra",
      "Hydra",
      hardwareId.trim()
    );

    setDownloadedQKey(lic);

    // Auto-download real encrypted Base64 .qkey file for Hydra native Mac app
    const blob = new Blob([lic.signature], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hydra_${hardwareId.trim()}.qkey`;
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
            <p className={styles.accountLabel}>Quadra ID Account ({userEmail})</p>
            <h1>Hi, {user?.name || "Samuel"}.</h1>
          </div>
          <button onClick={logout} className={styles.signOutBtn}>
            Sign Out
          </button>
        </header>

        <div className={styles.divider} />

        {/* Section: Software Licenses */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Software Licenses</h2>

          {loadingDb ? (
            <div className={styles.licenseCard} style={{ padding: "40px", textAlign: "center", color: "#86868b" }}>
              Checking active licenses on Supabase...
            </div>
          ) : hasActiveLicense ? (
            /* Active License Card (From Supabase DB) */
            <div className={styles.licenseCard}>
              <div className={styles.cardHeaderRow}>
                <Image
                  src="/images/hydra_app_icon.jpg"
                  alt="Hydra"
                  width={80}
                  height={80}
                  className={styles.softwareIcon}
                />
                <div className={styles.headerMeta}>
                  <h3 className={styles.productName}>Hydra</h3>
                  <p className={styles.productType}>Perpetual Commercial License · macOS Sonoma 14.0+</p>
                </div>
              </div>

              <div className={styles.licenseDetails}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Activation Status</span>
                  <span className={styles.infoValue}>
                    <span className={styles.statusDot} />
                    Active — Verified on Supabase database for {userEmail}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>License Key ID</span>
                  <span className={styles.infoValue}>
                    <strong>{userLicenseId}</strong>
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Order Reference</span>
                  <span className={styles.infoValue}>
                    <Link href="#" className={styles.inlineLink}>{userOrderRef}</Link>
                  </span>
                </div>
              </div>

              {/* Actions Row */}
              <div className={styles.actionRow}>
                <a href="#" className={styles.downloadButton}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Hydra Software
                </a>

                <button
                  className={styles.offlineKeyBtn}
                  onClick={() => setShowOfflineBox(!showOfflineBox)}
                >
                  {showOfflineBox ? "Hide Offline Generator" : "Generate Offline License (.qkey)"}
                </button>
              </div>

              {/* Offline License Generator Box */}
              {showOfflineBox && (
                <div className={styles.offlineBox}>
                  <h4>Offline Studio License (.qkey)</h4>
                  <p>
                    For studio computers without internet access. Enter your Mac's Hardware ID (found in Hydra &gt; License &gt; Offline Activation):
                  </p>

                  <form onSubmit={handleGenerateOfflineKey} className={styles.offlineForm}>
                    <input
                      type="text"
                      placeholder="e.g. MAC-98F-21A-001"
                      value={hardwareId}
                      onChange={(e) => setHardwareId(e.target.value)}
                      className={styles.hwInput}
                      required
                    />
                    <button type="submit" className={styles.genBtn}>
                      Generate &amp; Download .qkey
                    </button>
                  </form>

                  {downloadedQKey && (
                    <div className={styles.qkeySuccess}>
                      ✓ File <strong>hydra_{downloadedQKey.hardwareId}.qkey</strong> downloaded for {userEmail}! Import this file into Hydra software on your offline studio Mac.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Empty State: No Licenses Yet */
            <div className={styles.licenseCard} style={{ padding: "48px 32px", textAlign: "center" }}>
              <h3 style={{ fontSize: "21px", fontWeight: 600, marginBottom: "8px" }}>No active software licenses</h3>
              <p style={{ fontSize: "15px", color: "#86868b", maxWidth: "500px", margin: "0 auto 24px" }}>
                You don't have an active Quadra software license associated with <strong>{userEmail}</strong> yet. Visit our store or download the 90-day free trial.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Link href="/store" className="apple-button-primary">
                  Visit Quadra Store
                </Link>
                <Link href="/hydra" className="apple-button-secondary">
                  Download Free Trial
                </Link>
              </div>
            </div>
          )}
        </section>

        <div className={styles.divider} />

        {/* Section: Account Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Settings</h2>

          <div className={styles.quickLinksGrid}>
            <Link href="#" className={styles.linkCard}>
              <div className={styles.linkCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
              </div>
              <div>
                <h3>Payment Methods</h3>
                <p>Manage your saved credit cards.</p>
              </div>
            </Link>

            <Link href="#" className={styles.linkCard}>
              <div className={styles.linkCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <h3>Order History</h3>
                <p>View invoices and receipts.</p>
              </div>
            </Link>

            <Link href="/login" className={styles.linkCard}>
              <div className={styles.linkCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <div>
                <h3>Quadra ID</h3>
                <p>Update email, password, and security.</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
