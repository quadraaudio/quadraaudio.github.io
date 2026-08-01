"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  SUPPORT_ARTICLES,
  type SupportArticle,
} from "@/data/supportArticles";
import styles from "./support.module.scss";

type Topic = {
  id: string;
  title: string;
  body: string;
  /** Categories that belong to this topic */
  categories: string[];
};

const TOPICS: Topic[] = [
  {
    id: "setup",
    title: "Setup & install",
    body: "Requirements, drivers, and first launch.",
    categories: ["Setup"],
  },
  {
    id: "licensing",
    title: "Licensing",
    body: "Activate, seats, trial, and offline licenses.",
    categories: ["Licensing"],
  },
  {
    id: "routing",
    title: "Routing",
    body: "Matrix Grid, app capture, scenes, and labels.",
    categories: ["Routing"],
  },
  {
    id: "devices",
    title: "Bridges & devices",
    body: "Audio bridges, hardware I/O, and ASRC.",
    categories: ["Virtual Soundcard"],
  },
  {
    id: "network",
    title: "Network audio",
    body: "AES67, NDI, PTP, and LAN transmit.",
    categories: ["Network"],
  },
  {
    id: "fix",
    title: "Fix a problem",
    body: "Silence, dropouts, discovery, and plugins.",
    categories: ["Troubleshooting", "Plugins", "Monitor Control"],
  },
];

const SUGGESTED_IDS = [
  "getting-started",
  "license-activation",
  "matrix-grid",
  "network-aes67-ndi",
  "troubleshooting",
] as const;

function matchesQuery(article: SupportArticle, q: string) {
  return (
    article.title.toLowerCase().includes(q) ||
    article.hubBlurb.toLowerCase().includes(q) ||
    article.category.toLowerCase().includes(q) ||
    article.summary.toLowerCase().includes(q)
  );
}

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [topicId, setTopicId] = useState<string | null>(null);

  const activeTopic = TOPICS.find((t) => t.id === topicId) ?? null;
  const searching = query.trim().length > 0;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (q) {
      return SUPPORT_ARTICLES.filter((a) => matchesQuery(a, q));
    }

    if (activeTopic) {
      return SUPPORT_ARTICLES.filter((a) =>
        activeTopic.categories.includes(a.category)
      );
    }

    return SUGGESTED_IDS.map(
      (id) => SUPPORT_ARTICLES.find((a) => a.id === id)!
    ).filter(Boolean);
  }, [query, activeTopic]);

  function clearBrowse() {
    setQuery("");
    setTopicId(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={`page-shell ${styles.heroInner}`}>
          <h1 className={styles.title}>Support</h1>
          <p className={styles.sub}>
            Find answers for MATRIX — or contact us if you&apos;re stuck.
          </p>

          <label className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>
            <input
              type="search"
              className={styles.search}
              placeholder="Search support"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) setTopicId(null);
              }}
              aria-label="Search support"
            />
          </label>
        </div>
      </header>

      <div className={`page-shell ${styles.body}`}>
        {!searching && !activeTopic && (
          <section className={styles.section} aria-labelledby="topics-heading">
            <h2 id="topics-heading" className={styles.sectionTitle}>
              Browse by topic
            </h2>
            <div className={styles.topicGrid}>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={styles.topicTile}
                  onClick={() => setTopicId(topic.id)}
                >
                  <span className={styles.topicTitle}>{topic.title}</span>
                  <span className={styles.topicBody}>{topic.body}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section} aria-labelledby="articles-heading">
          <div className={styles.sectionHead}>
            <h2 id="articles-heading" className={styles.sectionTitle}>
              {searching
                ? results.length
                  ? `Results (${results.length})`
                  : "No results"
                : activeTopic
                  ? activeTopic.title
                  : "Suggested articles"}
            </h2>

            {(searching || activeTopic) && (
              <button type="button" className={styles.backBtn} onClick={clearBrowse}>
                ← All topics
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <p className={styles.empty}>
              Nothing matched. Try another search, browse a topic, or{" "}
              <Link href="/contact">contact support</Link>.
            </p>
          ) : (
            <ul className={styles.articleList}>
              {results.map((article) => (
                <li key={article.id}>
                  <Link href={`/support/article/${article.id}`} className={styles.articleLink}>
                    <span className={styles.articleCategory}>{article.category}</span>
                    <span className={styles.articleTitle}>{article.title}</span>
                    <span className={styles.articleBlurb}>{article.hubBlurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!searching && !activeTopic && (
            <p className={styles.hint}>
              Pick a topic above to see every guide in that area.
            </p>
          )}
        </section>

        <section className={styles.help}>
          <h2 className={styles.helpTitle}>Still need help?</h2>
          <p>
            <Link href="/contact">Contact Quadra</Link>
            {" · "}
            <a href="mailto:support@quadraaudio.com">support@quadraaudio.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}
