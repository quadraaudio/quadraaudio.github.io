"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  SUPPORT_ARTICLES,
  SUPPORT_CATEGORIES,
} from "@/data/supportArticles";
import styles from "./support.module.scss";

const TOPIC_CARDS = [
  {
    title: "Getting Started",
    body: "Install Hydra, verify HAL bridges, and create your first Matrix Grid patch.",
    href: "/support/article/getting-started",
  },
  {
    title: "Activation & Licensing",
    body: "Quadra ID, Quadra Guard HWID binding, seats, trial, and offline licenses.",
    href: "/support/article/license-activation",
  },
  {
    title: "Matrix Grid & Routing",
    body: "Cross-points, gainful connections, labels, scenes, and feedback protection.",
    href: "/support/article/matrix-grid",
  },
  {
    title: "Network Audio (AES67 / NDI)",
    body: "PTP/SAP/SDP AES67 streams, NDI runtime, subscribe and transmit on the LAN.",
    href: "/support/article/network-aes67-ndi",
  },
  {
    title: "Control Room Monitor",
    body: "DIM, MONO, SWAP L/R, MUTE, TALKBACK, and the floating Studio HUD.",
    href: "/support/article/control-room",
  },
  {
    title: "Troubleshooting",
    body: "Missing devices, silence, license mute, discovery issues, and plugin workers.",
    href: "/support/article/troubleshooting",
  },
];

export default function SupportPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUPPORT_ARTICLES;
    return SUPPORT_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.hubBlurb.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Support</p>
        <h1 className="display display-lg">Hydra help for working studios.</h1>
        <p className="lede">
          Guides for bridges, matrix routing, network audio, licensing, and
          troubleshooting — or reach the team directly.
        </p>

        <div className={styles.searchRow}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search Hydra support"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search Hydra support"
          />
        </div>

        <div className={styles.pills}>
          {["AES67", "NDI", "License", "Buffer", "VST", "Control Room"].map(
            (pill) => (
              <button
                key={pill}
                type="button"
                className={styles.pill}
                onClick={() => setQuery(pill)}
              >
                {pill}
              </button>
            )
          )}
        </div>

        {!query.trim() && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Popular topics</h2>
            <div className={styles.cards}>
              {TOPIC_CARDS.map((topic) => (
                <article key={topic.title}>
                  <h3>{topic.title}</h3>
                  <p>{topic.body}</p>
                  <Link href={topic.href}>Learn more →</Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {query.trim() ? "Search results" : "Knowledge base"}
          </h2>

          {filtered.length === 0 ? (
            <p className={styles.empty}>
              No articles matched. Try another term or{" "}
              <Link href="/contact">contact support</Link>.
            </p>
          ) : (
            SUPPORT_CATEGORIES.map((category) => {
              const items = filtered.filter((a) => a.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className={styles.category}>
                  <h3>{category}</h3>
                  <ul>
                    {items.map((article) => (
                      <li key={article.id}>
                        <Link href={`/support/article/${article.id}`}>
                          <span className={styles.articleTitle}>
                            {article.title}
                          </span>
                          <span className={styles.articleBlurb}>
                            {article.hubBlurb}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </section>

        <section className={styles.contactBand}>
          <h2 className={styles.sectionTitle}>Still need help?</h2>
          <p>
            Email{" "}
            <a href="mailto:support@quadraaudio.com">support@quadraaudio.com</a>{" "}
            or use the contact page. We typically reply within one business day.
          </p>
          <Link href="/contact" className={styles.cta}>
            Contact Quadra
          </Link>
        </section>
      </div>
    </main>
  );
}
