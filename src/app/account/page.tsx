"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSetter from "@/components/ThemeSetter";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseUserLicenses } from "@/lib/supabase";
import styles from "./page.module.scss";

interface LicenseRow {
  id?: string;
  product_slug: string;
  status: string;
  issued_at?: string;
}

export default function AccountPage() {
  const { user, isLoggedIn, isInitialized, logout } = useAuth();
  const router = useRouter();
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.push("/login");
    }
  }, [isInitialized, isLoggedIn, router]);

  useEffect(() => {
    if (!user?.email) return;
    getSupabaseUserLicenses(user.email).then((rows) => {
      setLicenses(rows as LicenseRow[]);
      setLoading(false);
    });
  }, [user?.email]);

  if (!isInitialized || !isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />

      <div className={styles.header}>
        <div className={styles.userInfo}>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <button className={styles.signOutBtn} onClick={logout}>
          Sign Out
        </button>
      </div>

      <div className={styles.section}>
        <h2>My Licenses</h2>
        {loading ? (
          <p className="body-reduced">Loading…</p>
        ) : licenses.length > 0 ? (
          licenses.map((lic, idx) => (
            <div key={lic.id || idx} className={styles.licenseCard}>
              <div>
                <h3>{lic.product_slug === "hydra" ? "Hydra" : lic.product_slug}</h3>
                <p>Perpetual License</p>
              </div>
              <span className={styles.statusBadge}>{lic.status || "active"}</span>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>You don&apos;t have any licenses yet.</p>
            <Link href="/store/buy-hydra" className="apple-button-primary">
              Buy Hydra
            </Link>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>Need help?</h2>
        <p className="body-reduced" style={{ marginBottom: 12 }}>
          Visit Support for activation, routing, and network audio guidance.
        </p>
        <Link href="/support" className="apple-button-secondary">
          Go to Support &gt;
        </Link>
      </div>
    </div>
  );
}
