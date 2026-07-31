"use client";

import { useState } from "react";
import ThemeSetter from "@/components/ThemeSetter";
import styles from "./page.module.scss";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />

      <div className={styles.header}>
        <h1 className="headline">Contact Us.</h1>
        <p className="body-text">Our engineering support team typically replies within one business day.</p>
      </div>

      {sent ? (
        <div className={styles.successBox}>
          <h2>Thanks — we&apos;ve got your message.</h2>
          <p className="body-reduced">A confirmation has been sent to your email.</p>
        </div>
      ) : (
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input id="name" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="topic">Topic</label>
            <select id="topic" defaultValue="activation">
              <option value="activation">Activation & Licensing</option>
              <option value="routing">Matrix Grid & Routing</option>
              <option value="network">Network Audio (AES67 / NDI)</option>
              <option value="billing">Billing & Refunds</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" required />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
