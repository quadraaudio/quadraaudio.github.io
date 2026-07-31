import Link from "next/link";
import ThemeSetter from "@/components/ThemeSetter";
import styles from "./page.module.scss";

export const metadata = {
  title: "Support — Quadra Audio",
  description: "Get help with Hydra: activation, Matrix Grid routing, network audio, and more.",
};

const TOPICS = [
  {
    title: "Activation & Licensing",
    body: "Manage your Quadra ID, activate a new Mac, or troubleshoot an offline .qkey license file.",
    href: "/account",
  },
  {
    title: "Matrix Grid & Routing",
    body: "Learn how to patch apps, hardware, and plugins together using Hydra's cross-point Matrix Grid.",
    href: "/hydra#tools",
  },
  {
    title: "Network Audio (AES67 / NDI)",
    body: "Set up PTP clocking, subscribe to AES67 streams, and troubleshoot NDI audio discovery on your LAN.",
    href: "/hydra#network",
  },
  {
    title: "Control Room Monitor",
    body: "Configure DIM, MONO, SWAP L/R, MUTE and TALKBACK MIC for your studio monitor controller.",
    href: "/hydra#control-room",
  },
  {
    title: "System Requirements",
    body: "Check macOS version, Apple Silicon compatibility, and driver installation requirements.",
    href: "/hydra#specs",
  },
  {
    title: "Contact Engineering Support",
    body: "Can't find an answer? Reach the Quadra support team directly.",
    href: "/support/contact",
  },
];

export default function SupportPage() {
  return (
    <div>
      <ThemeSetter theme="light" />

      <section className={styles.hero}>
        <h1 className="headline">Support.</h1>
        <p className="body-text" style={{ marginBottom: 24 }}>
          Search for answers or browse a topic below.
        </p>
        <div className={styles.searchBox}>
          <input type="search" placeholder="Search Hydra support" />
        </div>
      </section>

      <section className={styles.topics}>
        <div className="section-container-wide">
          <div className={styles.grid}>
            {TOPICS.map((topic) => (
              <div key={topic.title} className={styles.card}>
                <h3>{topic.title}</h3>
                <p>{topic.body}</p>
                <Link href={topic.href} className="apple-button-secondary">
                  Learn more &gt;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
