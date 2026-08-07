"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MATRIX_GLOSS, QUADRA_CTAS } from "@/data/brand.messaging";
import {
  fetchPublishedReleases,
  formatAssetSize,
  formatReleaseDate,
  pickLatestStable,
  type ProductRelease,
} from "@/lib/releases";
import styles from "./releases.module.scss";

export default function ReleasesPage() {
  const [releases, setReleases] = useState<ProductRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchPublishedReleases()
      .then((rows) => {
        if (!alive) return;
        setReleases(rows);
        setError(null);
      })
      .catch((err) => {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Could not load releases",
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const latest = pickLatestStable(releases);

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Releases</p>
        <h1 className="display display-lg">Download MATRIX.</h1>
        <p className="lede">
          Official installer builds for Mac. After install, authorize with your
          Quadra ID — or start the {MATRIX_GLOSS.trialDays}-day full trial from
          the app.
        </p>

        {loading ? (
          <p className={styles.muted}>Loading releases…</p>
        ) : null}

        {error ? (
          <p className={styles.notice} role="status">
            {error}. Try refreshing, or{" "}
            <Link href="/contact">contact support</Link>.
          </p>
        ) : null}

        {!loading && !error && latest ? (
          <section className={styles.latest} aria-labelledby="latest-heading">
            <div className={styles.latestHead}>
              <div>
                <p className={styles.versionLabel}>
                  Latest · v{latest.version} · build {latest.build}
                  {latest.channel === "stable" ? " · Stable" : " · Beta"}
                </p>
                <h2 id="latest-heading" className={styles.latestTitle}>
                  {latest.title}
                </h2>
                <p className={styles.latestMeta}>
                  {formatReleaseDate(latest.publishedAt)} · {latest.downloadKind}
                  {formatAssetSize(latest.downloadSizeBytes)
                    ? ` · ${formatAssetSize(latest.downloadSizeBytes)}`
                    : ""}
                </p>
              </div>
              <a
                href={latest.downloadUrl}
                className="btn btn-primary"
                download={latest.downloadFilename}
              >
                Download MATRIX for Mac
              </a>
            </div>
            {latest.summary ? (
              <p className={styles.summary}>{latest.summary}</p>
            ) : null}
            <p className={styles.fileHint}>
              File: <code>{latest.downloadFilename}</code>
            </p>
            <div className={styles.nextSteps}>
              <p className={styles.subLabel}>After download</p>
              <ol>
                <li>Open the ZIP, move MATRIX.app to Applications, and launch.</li>
                <li>
                  Launch MATRIX and open Authorization to sign in or start a
                  trial.
                </li>
                <li>
                  Bought a license? Seats live in your{" "}
                  <Link href={QUADRA_CTAS.account.href}>account</Link>.
                </li>
              </ol>
            </div>
          </section>
        ) : null}

        {!loading && !error && !latest ? (
          <section className={styles.latest}>
            <p className={styles.summary}>
              No installer is published yet. Check back soon, or{" "}
              <Link href="/contact">contact support</Link>.
            </p>
          </section>
        ) : null}

        {latest?.requirements.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>System requirements</h2>
            <ul className={styles.reqList}>
              {latest.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.sectionLede}>
              Prefer a guided walkthrough? See{" "}
              <Link href="/support/article/getting-started">Getting Started</Link>
              .
            </p>
          </section>
        ) : null}

        {releases.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Release history</h2>
            <ul className={styles.history}>
              {releases.map((release) => (
                <li key={release.id} className={styles.historyItem}>
                  <div className={styles.historyHead}>
                    <div>
                      <p className={styles.historyTitle}>
                        {release.title || `v${release.version}`}
                      </p>
                      <p className={styles.latestMeta}>
                        v{release.version} · build {release.build} ·{" "}
                        {formatReleaseDate(release.publishedAt)} ·{" "}
                        {release.channel}
                      </p>
                    </div>
                    <a
                      href={release.downloadUrl}
                      className="btn btn-secondary"
                      download={release.downloadFilename}
                    >
                      Download
                    </a>
                  </div>
                  {release.summary ? (
                    <p className={styles.summary}>{release.summary}</p>
                  ) : null}
                  {release.highlights.length ? (
                    <ul className={styles.highlights}>
                      {release.highlights.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
