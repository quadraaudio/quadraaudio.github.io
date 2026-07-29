"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import styles from "./page.module.scss";

export default function ContactSupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Technical Support");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className={styles.contactPage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.contactContainer}>
        <header className={styles.contactHeader}>
          <span className={styles.contactEyebrow}>Quadra Support Desk</span>
          <h1 className={styles.contactTitle}>Engineering Support</h1>
          <p className={styles.contactSub}>
            Direct technical assistance for Core Audio drivers, NDI® AoIP routing, GroundControl fusion, and spatial monitoring.
          </p>
        </header>

        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.checkIconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Technical Ticket Dispatched</h2>
            <p className={styles.ticketRef}>Ticket Reference: <code>#QDR-ENG-9821</code></p>
            <p className={styles.ticketDesc}>
              Thank you, {name || "Engineer"}. A Quadra Audio Specialist has received your request and will reply to <strong>{email}</strong> within 4 business hours.
            </p>
            <Link href="/support" className="apple-button-primary">
              Return to Support Hub
            </Link>
          </div>
        ) : (
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Samuel Bacaro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address / Quadra ID</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Topic Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="Technical Support">Core Audio &amp; Virtual Soundcard Setup</option>
                  <option value="Network AoIP">Network Audio (NDI® &amp; AVB Streaming)</option>
                  <option value="Spatial Monitoring">Spatial Audio (Dolby Atmos 9.4.6)</option>
                  <option value="Licensing">Quadra ID &amp; License Transfer</option>
                  <option value="Enterprise">Volume Licensing &amp; Broadcast</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Issue Description</label>
                <textarea
                  id="message"
                  placeholder="Include details such as macOS version, DAW used (Logic, Pro Tools, OBS), and physical audio interface models..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="apple-button-primary" style={{ width: "100%", padding: "14px", fontSize: "16px" }}>
                Submit Technical Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
