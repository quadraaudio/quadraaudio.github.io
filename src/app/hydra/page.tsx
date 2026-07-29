"use client";

import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import ProductRibbon from "@/components/ProductRibbon";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Hydra() {
  return (
    <div className={styles.hydraPage} data-theme="dark">
      {/* Force global theme state to DARK MODE for Hydra page */}
      <ThemeSetter theme="dark" />

      {/* Apple Sticky LocalNav */}
      <LocalNav
        title="Hydra"
        price="$199.99"
        buyUrl="/store"
        links={[
          { label: "Overview", href: "#overview", active: true },
          { label: "Virtual Patchbay", href: "#tools" },
          { label: "Network Audio", href: "#network" },
          { label: "Spatial Audio", href: "#spatial" },
          { label: "Tech Specs", href: "#specs" },
        ]}
      />

      {/* Feature Capabilities Ribbon */}
      <ProductRibbon />

      <div className={styles.hydraContent}>
        
        {/* =========================================
           1. SECTION WELCOME (Apple Hero)
           ========================================= */}
        <section className={styles.sectionWelcome} id="overview">
          <div className={styles.appIconBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className={styles.welcomeEyebrow}>Hydra</h1>
          <h2 className={styles.welcomeHeadline}>Sound thinking. Endless routing.</h2>
          <p className={styles.welcomeBody}>
            Hydra is the ultimate virtual soundcard and multichannel audio routing software for Mac.
            Combine physical audio interfaces into a single unified driver, patch uncompressed audio between DAWs like Logic Pro and Pro Tools, and stream multichannel audio over NDI® and AVB networks with zero latency.
          </p>

          <div className={styles.welcomeHeroMedia}>
            <div className={styles.playButton}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span>Watch the launch film</span>
          </div>
        </section>


        {/* =========================================
           2. SECTION BANNER (Quadra Studio Suite)
           ========================================= */}
        <section className={styles.sectionBanner}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerCopy}>
              <span className={styles.bannerBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Quadra Creator Studio
              </span>
              <h2 className={styles.bannerHeadline}>The essential audio matrix for modern studios.</h2>
              <p className={styles.bannerDescription}>
                Hydra acts as your central virtual patchbay, monitor controller, and spatial audio renderer in a single unified Mac application.
              </p>
              <div className={styles.bannerCtas}>
                <Link href="/store" className="apple-button-primary">
                  Try free for 90 days
                </Link>
                <Link href="#specs" className="apple-button-secondary">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================
           3. SECTION HIGHLIGHTS ("Get to know Hydra")
           ========================================= */}
        <section className={styles.sectionHighlights}>
          <h2 className={styles.sectionHeaderHeadline}>Get to know Hydra.</h2>
          
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>256-Channel Virtual Patchbay</h3>
                <p className={styles.highlightBody}>
                  Route audio freely between any application, hardware input, or virtual Core Audio driver with zero latency and complete signal isolation.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="M6 12h12M12 6v12" />
                </svg>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>GroundControl Driver Fusion</h3>
                <p className={styles.highlightBody}>
                  Combine multiple physical audio interfaces into a single, unified high-channel-count driver without aggregate device clock drift.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>32-Bit Float Audio Engine</h3>
                <p className={styles.highlightBody}>
                  Ultra-pristine signal quality offering infinite dynamic headroom, zero digital clipping, and sample rates up to 384 kHz.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>NDI® & AVB Network Audio</h3>
                <p className={styles.highlightBody}>
                  Stream up to 128 NDI channels and 256 AVB channels uncompressed over local Ethernet to any Mac or broadcast receiver.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13M9 9l12-2" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================
           4. SECTION VIRTUAL ROUTING TOOLS
           ========================================= */}
        <section className={styles.sectionApp} id="tools">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Virtual Routing Tools</span>
            <h2 className={styles.appHeadline}>Unleash your signal flow.</h2>
            <p className={styles.appCopy}>
              Build custom virtual soundcards, <strong>route audio directly between software applications</strong>, and capture system audio with zero latency. Hydra gives you total freedom to route, split, and process sound without physical cabling.
            </p>
          </div>

          <div className={styles.captionTileRow}>
            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <circle cx="15" cy="15" r="2" />
                </svg>
              </div>
              <h3>Virtual Soundcard Engine</h3>
              <p>Create custom Core Audio virtual devices with up to 256 input and output channels per device.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </div>
              <h3>Application Audio Capture</h3>
              <p>Grab audio directly from Zoom, Chrome, Discord, or Spotify without needing third-party virtual cables.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v18M3 12h18" />
                </svg>
              </div>
              <h3>GroundControl LINK Plugin</h3>
              <p>AU / VST3 / AAX plugin for direct sub-millisecond audio routing straight from your DAW to Hydra.</p>
            </div>
          </div>
        </section>


        {/* =========================================
           5. SECTION NETWORK AUDIO & BROADCAST
           ========================================= */}
        <section className={styles.sectionApp} id="network">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Networked Audio & Broadcast</span>
            <h2 className={styles.appHeadline}>Audio over IP made seamless.</h2>
            <p className={styles.appCopy}>
              Turn your Mac into a high-capacity network audio hub. Send and receive <strong>multichannel uncompressed audio over local Ethernet</strong> using NDI® and AVB protocols.
            </p>
          </div>

          <div className={styles.captionTileRow}>
            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              </div>
              <h3>128-Channel NDI® Audio Streaming</h3>
              <p>Send uncompressed multichannel audio across your local network to any NDI-compatible broadcast receiver.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                </svg>
              </div>
              <h3>256-Channel AVB Protocol Support</h3>
              <p>Ultra-stable, low-latency Audio Video Bridging network streaming designed for large-scale studio facilities.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="7" cy="12" r="2" />
                  <circle cx="17" cy="12" r="2" />
                </svg>
              </div>
              <h3>Real-Time Remote Collaboration</h3>
              <p>Stream studio-quality uncompressed audio directly to remote collaborators over IP with low latency.</p>
            </div>
          </div>
        </section>


        {/* =========================================
           6. SECTION SPATIAL AUDIO & MONITOR CONTROL
           ========================================= */}
        <section className={styles.sectionApp} id="spatial">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Spatial Audio & Monitor Control</span>
            <h2 className={styles.appHeadline}>Surround yourself in sound.</h2>
            <p className={styles.appCopy}>
              Monitor <strong>9.1.6 Dolby Atmos mixes</strong> with built-in binaural renderers, Apple Spatial Audio HRTF head-tracking integration, custom AU plugin slots for speaker calibration, and bass management for up to four subwoofers.
            </p>
          </div>
        </section>


        {/* =========================================
           7. SECTION TECH SPECS
           ========================================= */}
        <section className={styles.sectionApp} id="specs">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>System Specifications</span>
            <h2 className={styles.appHeadline}>Engineered for macOS and Quadra Silicon.</h2>
          </div>

          <div className={styles.captionTileRow}>
            <div className={styles.captionTileCard}>
              <h3>Mac Compatibility</h3>
              <p>macOS Sonoma 14.0 or later. Fully native on Apple Silicon (M1/M2/M3/M4) and Intel-based Macs.</p>
            </div>

            <div className={styles.captionTileCard}>
              <h3>Driver Architecture</h3>
              <p>Native Core Audio extension with 0ms added driver latency and 32-bit Float processing precision.</p>
            </div>

            <div className={styles.captionTileCard}>
              <h3>Channel & Sample Rates</h3>
              <p>Up to 256 virtual channels. Sample rates from 44.1 kHz to 384 kHz with automatic clock synchronization.</p>
            </div>
          </div>
        </section>


        {/* =========================================
           8. TRIAL FOOTER CTA
           ========================================= */}
        <section className={styles.trialSection}>
          <h2 className={styles.trialTitle}>Try Hydra free for 90 days.</h2>
          <p className={styles.trialSub}>
            Instant activation with your Quadra ID on macOS.
          </p>
          <div className={styles.trialCtas}>
            <Link href="/store" className="apple-button-primary">
              Download 90-Day Free Trial
            </Link>
            <Link href="/store" className="apple-button-secondary">
              Buy Hydra License ($199.99)
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
