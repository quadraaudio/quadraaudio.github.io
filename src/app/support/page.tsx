"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import styles from "./page.module.scss";

// Database of Support Articles for Hydra Software
const supportArticles = [
  {
    id: 1,
    category: "Setup & AoIP",
    title: "Configuring AES67 & NDI Network Audio in Hydra",
    desc: "Subscribe to PTP-synced AES67 streams and NDI sources across local machines directly into the Matrix Grid.",
    link: "/support/article/configuring-ndi"
  },
  {
    id: 2,
    category: "Licensing",
    title: "Managing Quadra ID License Activations",
    desc: "Activate your Hydra license across 2 Mac machines simultaneously with Quadra Guard 2.0 offline activation.",
    link: "/support/article/license-activation"
  },
  {
    id: 3,
    category: "Performance",
    title: "Optimizing Buffer Size & Preventing Audio Dropouts",
    desc: "Configure Core Audio buffer sizes for heavy multichannel workloads across bridges and hardware.",
    link: "/support/article/optimizing-buffer"
  },
  {
    id: 4,
    category: "Virtual Soundcard",
    title: "Setting Up Physical Devices with ASRC",
    desc: "Add hardware interfaces to the grid with drift-corrected sample rate conversion, zero manual clocking.",
    link: "/support/article/hardware-asrc-setup"
  },
  {
    id: 5,
    category: "Monitor Control",
    title: "Using the Control Room Monitor",
    desc: "Set up DIM, MONO, SWAP L/R, MUTE, TALKBACK MIC and the floating Studio HUD.",
    link: "/support/article/control-room-monitor"
  },
  {
    id: 6,
    category: "Account & Billing",
    title: "Updating Quadra ID Profile & Commercial Subscriptions",
    desc: "Manage your personal details, order invoices, and organization volume license keys.",
    link: "/support/article/license-activation"
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = supportArticles.filter((article) => {
    if (searchQuery.trim() === "") return true;
    
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.desc.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.supportPage}>
      <ThemeSwitcher forceTheme="light" />
      
      {/* Hero Search Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Quadra Customer Care</span>
          <h1 className={styles.heroTitle}>Quadra Support</h1>
          <p className={styles.heroSub}>
            Search technical guides, virtual soundcard documentation, and network routing setup articles.
          </p>
          
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search topics, Core Audio drivers, NDI® or AES67..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Category Filter Pills */}
          <div className={styles.filterGrid}>
            <button className={styles.filterPill} onClick={() => setSearchQuery("NDI")}>
              <span>NDI® Audio</span>
            </button>
            <button className={styles.filterPill} onClick={() => setSearchQuery("Licensing")}>
              <span>Quadra ID Licenses</span>
            </button>
            <button className={styles.filterPill} onClick={() => setSearchQuery("Buffer")}>
              <span>Buffer &amp; Xruns</span>
            </button>
            <button className={styles.filterPill} onClick={() => setSearchQuery("Control Room")}>
              <span>Control Room</span>
            </button>
          </div>
        </div>
      </section>

      {/* Helpful Topics Section */}
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>{searchQuery.trim() === "" ? "Knowledge Base Articles" : "Search Results"}</h2>
        </div>
        
        {filteredArticles.length > 0 ? (
          <div className={styles.topicsGrid}>
            {filteredArticles.map((article) => (
              <Link href={article.link} className={styles.topicCard} key={article.id}>
                <span className={styles.topicCategory}>{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
                <span className={styles.cardArrow}>Read guide ›</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3>No articles found for "{searchQuery}"</h3>
            <p>Try searching for a different term or check our direct help desk below.</p>
            <button onClick={() => setSearchQuery("")} className={styles.clearBtn}>
              Clear Search Filters
            </button>
          </div>
        )}

        {/* Human Support Escalation */}
        <div className={styles.supportBanner}>
          <div className={styles.bannerCopy}>
            <h2>Need direct engineering assistance?</h2>
            <p>Our audio engineers can help you configure custom Core Audio matrices, hardware driver fusion, or air-gapped studio licensing.</p>
          </div>
          <Link href="/support/contact" className="apple-button-primary">
            Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
