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
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Engineering Support Desk</h1>
          <p>Direct assistance for Core Audio, NDI®, AVB, and spatial audio workflows.</p>
        </header>

        {submitted ? (
          <div className={styles.successBox}>
            <div className={styles.checkIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Ticket Created (#QDR-ENG-9821)</h2>
            <p>
              Thank you, {name || "Engineer"}. A Quadra Audio Specialist has received your request and will reply to <strong>{email}</strong> within 4 business hours.
            </p>
            <Link href="/support" className="apple-button-primary">
              Return to Support Portal
            </Link>
          </div>
        ) : (
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Your Name</label>
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
                <label htmlFor="category">Support Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Technical Support">Technical Support (Core Audio &amp; Matrix)</option>
                  <option value="Network AoIP">Network Audio (NDI® &amp; AVB Setup)</option>
                  <option value="Spatial Monitoring">Spatial Audio (Dolby Atmos 9.4.6)</option>
                  <option value="Licensing">Quadra ID &amp; License Transfer</option>
                  <option value="Enterprise">Volume Licensing &amp; Broadcast</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Describe your issue or setup</label>
                <textarea
                  id="message"
                  placeholder="Include details such as macOS version, DAW used (Logic, Pro Tools, OBS), and physical audio interface hardware..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Technical Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
