"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import styles from "./page.module.scss";

// Database of Support Articles for Hydra Software
const supportArticles = [
  {
    id: 1,
    category: "Setup",
    title: "Configuring NDI® Audio Streaming in Hydra",
    desc: "Learn how to route uncompressed multichannel audio across your local Ethernet network using NDI technology.",
    link: "#"
  },
  {
    id: 2,
    category: "Activation",
    title: "Managing Quadra ID License Activations",
    desc: "Find out how to activate your Hydra license across 2 machines simultaneously or transfer activations.",
    link: "#"
  },
  {
    id: 3,
    category: "Troubleshooting",
    title: "Optimizing Buffer Size & Preventing Audio Dropouts",
    desc: "Configure Core Audio buffer sizes and network switch QoS settings for heavy multichannel workloads.",
    link: "#"
  },
  {
    id: 4,
    category: "Virtual Soundcard",
    title: "Setting Up GroundControl Fusion Audio Drivers",
    desc: "Combine multiple physical audio interfaces into a single unified driver without clock drift.",
    link: "#"
  },
  {
    id: 5,
    category: "Spatial Audio",
    title: "Dolby Atmos 9.1.6 Matrix & HRTF Binaural Monitoring",
    desc: "How to configure Hydra's 256-channel matrix for spatial audio rendering and headphone head tracking.",
    link: "#"
  },
  {
    id: 6,
    category: "Account",
    title: "Updating Quadra ID Profile & Commercial Subscriptions",
    desc: "Manage your personal details, invoice history, and organization volume licenses.",
    link: "#"
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
        <h1 className={styles.heroTitle}>Quadra Support</h1>
        
        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search for topics, virtual drivers, or NDI routing solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Topic Filters */}
        <div className={styles.productGrid}>
          <button 
            className={styles.productItem}
            onClick={() => setSearchQuery("Hydra")}
          >
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <span>Hydra Software</span>
          </button>
          
          <button 
            className={styles.productItem}
            onClick={() => setSearchQuery("Virtual Soundcard")}
          >
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
            </div>
            <span>Virtual Drivers</span>
          </button>

          <button 
            className={styles.productItem}
            onClick={() => setSearchQuery("Quadra ID")}
          >
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span>Quadra ID</span>
          </button>
        </div>
      </section>

      {/* Helpful Topics Section */}
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>{searchQuery.trim() === "" ? "Helpful Topics" : "Search Results"}</h2>
        </div>
        
        {filteredArticles.length > 0 ? (
          <div className={styles.topicsGrid}>
            {filteredArticles.map((article) => (
              <Link href={article.link} className={styles.topicCard} key={article.id}>
                <span className={styles.topicCategory}>{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3>No results found for "{searchQuery}"</h3>
            <p>Try searching for a different keyword or check the product filters above.</p>
            <button onClick={() => setSearchQuery("")}>Clear Search</button>
          </div>
        )}

        {/* Human Support Escalation */}
        <div className={styles.supportBanner}>
          <h2>Need specialized technical support?</h2>
          <p>If you need assistance configuring complex multichannel NDI audio networks or DAW matrices, our audio engineers are ready to help.</p>
          <Link href="#">Speak with an Audio Specialist</Link>
        </div>
      </div>
    </div>
  );
}
