"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import styles from "./page.module.scss";

const HIGHLIGHTS = [
  { image: "/images/hydra_mixing_hands.jpg", title: "The Matrix Grid: click a cross-point to patch a transmitter to a receiver." },
  { image: "/images/hydra_guitarist.jpg", title: "Eight Hydra Audio Bridges from 2 to 128 channels — any app can select one." },
  { image: "/images/hydra_producer_laptop.jpg", title: "Out-of-process VST3 hosting keeps a crashing plugin from taking down your DAW." },
  { image: "/images/hydra_patch_cables.jpg", title: "Subscribe to AES67 and NDI network audio streams straight into the grid." },
  { image: "/images/hydra_talkback_mic.jpg", title: "Control Room: DIM, MONO, SWAP L/R, MUTE and TALKBACK from one card." },
  { image: "/images/hydra_headphones_closeup.jpg", title: "Built-in ASRC keeps independent hardware clocks locked, drift-free." },
];

const TILES = [
  {
    image: "/images/hydra_guitarist.jpg",
    title: "Eight Hydra Audio Bridges.",
    body: "2‑A, 2‑B, 4, 8, 16, 32, 64 and 128‑channel virtual soundcards appear in System Settings and every DAW. Pick the size that fits the job — podcasting, stems, or a full orchestral session.",
  },
  {
    image: "/images/hydra_producer_laptop.jpg",
    title: "Flux Capture & Process Taps.",
    body: "Tap an individual app's audio — Zoom, Chrome, Spotify, Discord — via the macOS 14.4+ Core Audio Process Tap API. The app keeps playing normally; Hydra gets a continuous copy of the stream.",
  },
  {
    image: "/images/hydra_mixing_hands.jpg",
    title: "Out-of-Process VST3 Hosting.",
    body: "Third-party VST3 plugins run in dedicated, sandboxed worker processes. If a plugin crashes, the worker restarts automatically — your DAW and the Hydra engine keep running.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is Hydra and how does it work on macOS?",
    answer:
      "Hydra is a high-performance virtual audio patchbay for macOS. It exposes eight independent Hydra Audio Bridges (2 to 128 channels each, native Core Audio AudioServerPlugIn HAL devices) that any app can select as input or output. A visual Matrix Grid lets you route audio freely between applications, physical hardware, out-of-process VST3 plugins, and network endpoints — no physical cabling required.",
  },
  {
    question: "How does ASRC drift correction work with physical hardware?",
    answer:
      "When you add a physical audio interface to the grid, Hydra applies built-in Asynchronous Sample Rate Conversion (ASRC) with real-time jitter correction. This keeps devices running on independent hardware clocks — a USB microphone and a Thunderbolt interface, for example — in sync without pops, clicks, or drift.",
  },
  {
    question: "Can I stream audio over the network with AES67 or NDI?",
    answer:
      "Yes. Hydra subscribes to AES67 AoIP streams (PTPv2-synced, SAP/SDP discovery) and NDI audio sources directly into the Matrix Grid. Any bridge can also be marked to broadcast as an AES67 or NDI transmitter for other machines on the network to pick up.",
  },
  {
    question: "What is the Control Room Monitor?",
    answer:
      "The Control Room card gives you studio monitor-controller functions right from the sidebar: DIM, MONO sum (for phase checks), SWAP L/R, master MUTE, and a dedicated TALKBACK MIC that ducks background audio. A floating, always-on-top Studio HUD keeps these controls one click away while you work in your DAW.",
  },
  {
    question: "Is there a free trial and how does licensing work?",
    answer:
      "Hydra comes with a 90-day fully functional free trial. A full perpetual license is a single purchase with lifetime updates, protected by Quadra Guard 2.0 — hardware-bound (HWID) Ed25519 activation that works fully offline once activated, permitting up to 2 Macs per license via your Quadra ID.",
  },
];

export default function Hydra() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <ThemeSetter theme="dark" />

      <LocalNav
        title="Hydra"
        price="$199.99"
        buyUrl="/store/buy-hydra"
        links={[
          { label: "Overview", href: "#overview", active: true },
          { label: "Matrix Grid", href: "#tools" },
          { label: "Network Audio", href: "#network" },
          { label: "Control Room", href: "#control-room" },
          { label: "Tech Specs", href: "#specs" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <section className={styles.hero} id="overview">
        <img src="/images/hydra_hero_engineer.jpg" alt="Hydra virtual audio patchbay on macOS" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Hydra</p>
          <h1 className={styles.heroHeadline}>The complete virtual audio patchbay.</h1>
          <p className={styles.heroBody}>
            Eight selectable Hydra Audio Bridges (2 to 128 channels each) that any app can
            pick as its input or output, routed freely between apps, hardware interfaces,
            out-of-process VST3 plugins, and network audio — all in one visual Matrix Grid.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className="section-container">
          <div className={styles.bannerCard}>
            <div className={styles.bannerCopy}>
              <span className={styles.bannerBadge}>Quadra Guard 2.0</span>
              <h2 className={styles.bannerHeadline}>Eight bridges. One matrix.</h2>
              <p className={styles.bannerDescription}>
                Hydra Audio Bridges — 2‑A, 2‑B, 4, 8, 16, 32, 64 and 128 channels — give you
                up to 256 channels of routing headroom, unifying apps, hardware, plugins and
                the network into one cross-point Matrix Grid.
              </p>
              <div className={styles.bannerCtas}>
                <Link href="/store/buy-hydra" className="apple-button-primary">
                  Try free for 90 days
                </Link>
                <Link href="#specs" className="apple-button-secondary">
                  Learn more
                </Link>
              </div>
            </div>
            <div className={styles.bannerAsset}>
              <img src="/images/hydra_app_icon.jpg" alt="Hydra app icon" />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className="section-container-wide">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeadline}>Get to know Hydra.</h2>
          </div>
          <div className={styles.highlightsGrid}>
            {HIGHLIGHTS.map((item) => (
              <div key={item.title} className={styles.highlightCard}>
                <img src={item.image} alt={item.title} />
                <div className={styles.highlightOverlay}>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionDark}`} id="tools">
        <div className="section-container-wide">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>The Matrix Grid</p>
            <h2 className={styles.sectionHeadline}>Route anything, to anything.</h2>
            <p className={styles.sectionCopy}>
              Transmitters run down one axis, receivers across the other. Click any
              intersection to patch them together — a glowing indicator confirms the
              connection is live.
            </p>
          </div>
          <div className={styles.fullBleedMedia}>
            <img src="/images/hydra_control_room_wide.jpg" alt="Hydra Matrix Grid demo" />
          </div>
          <div className={styles.tilesGrid}>
            {TILES.map((tile) => (
              <div key={tile.title} className={styles.tile}>
                <div className={styles.tileImage}>
                  <img src={tile.image} alt={tile.title} />
                </div>
                <h3>{tile.title}</h3>
                <p>{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionGray}`} id="network">
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Network Audio</p>
            <h2 className={styles.sectionHeadline}>The studio is the network.</h2>
            <p className={styles.sectionCopy}>
              Turn your Mac into a network audio endpoint. Hydra receives PTP-synced AES67
              AoIP streams and NDI audio sources, and can broadcast any bridge back out to
              the network — no proprietary hardware required.
            </p>
          </div>
          <div className={styles.fullBleedMedia}>
            <img src="/images/hydra_patch_cables.jpg" alt="Hydra AES67 and NDI network audio" />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionDark}`} id="control-room">
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Control Room Monitor</p>
            <h2 className={styles.sectionHeadline}>Monitor control, always in reach.</h2>
            <p className={styles.sectionCopy}>
              DIM, MONO, SWAP L/R and MUTE your master output, plus a dedicated TALKBACK MIC
              that ducks background audio — right from the sidebar, or from a floating,
              always-on-top Studio HUD while you work in your DAW.
            </p>
          </div>
          <div className={styles.fullBleedMedia}>
            <img src="/images/hydra_talkback_mic.jpg" alt="Hydra Control Room monitor controller" />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionGray}`} id="specs">
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>System Specifications</p>
            <h2 className={styles.sectionHeadline}>Engineered for macOS and Apple Silicon.</h2>
          </div>
          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <h3>Mac Compatibility</h3>
              <p>macOS 26 (Tahoe) or later. Universal binary for Apple Silicon (M1/M2/M3/M4) and Intel (x86_64).</p>
            </div>
            <div className={styles.specCard}>
              <h3>Driver Architecture</h3>
              <p>Native Core Audio AudioServerPlugIn (HAL) driver — SIP stays enabled, no kernel extensions required.</p>
            </div>
            <div className={styles.specCard}>
              <h3>Network & Control</h3>
              <p>AES67 AoIP (PTPv2, SAP/SDP), NDI audio, out-of-process VST3 hosting, Core Audio Process Taps, OSC remote control, HUI control-surface MIDI.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionDark}`} id="faq">
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeadline}>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={`${styles.faqItem} ${openFaq === idx ? styles.faqOpen : ""}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className={styles.faqQuestion}>
                  <h3>{item.question}</h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {openFaq === idx && <div className={styles.faqAnswer}>{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.trial}>
        <h2 className={styles.trialHeadline}>Try Hydra free for 90 days.</h2>
        <p className={styles.trialSub}>Instant activation with your Quadra ID on macOS.</p>
        <div className={styles.trialCtas}>
          <Link href="/store/buy-hydra" className="apple-button-primary">
            Download 90-Day Free Trial
          </Link>
          <Link href="/store/buy-hydra" className="apple-button-secondary">
            Buy Hydra License ($199.99)
          </Link>
        </div>
      </section>
    </div>
  );
}
