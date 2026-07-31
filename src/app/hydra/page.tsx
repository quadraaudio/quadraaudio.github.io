"use client";

import { useState, useRef } from "react";
import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import ProductRibbon from "@/components/ProductRibbon";
import Link from "next/link";
import styles from "./page.module.scss";

// 100% Quadra-owned media. Structure follows Apple product-page conventions,
// but every asset served here is our own (no Apple CDN, no Apple assets).
const QUADRA_ASSETS = {
  images: {
    hero: "/images/hydra_hero_engineer.jpg",
    banner: "/images/hydra_app_icon.jpg",
    highlights: {
      matrixGrid: "/images/hydra_mixing_hands.jpg",
      asrc: "/images/hydra_headphones_closeup.jpg",
      vst3: "/images/hydra_producer_laptop.jpg",
      network: "/images/hydra_patch_cables.jpg",
      controlRoom: "/images/hydra_talkback_mic.jpg",
      bridges: "/images/hydra_guitarist.jpg",
    },
    networkHero: "/images/hydra_patch_cables.jpg",
    matrixDemo: "/images/hydra_control_room_wide.jpg",
    controlRoomDemo: "/images/hydra_talkback_mic.jpg",
    tiles: {
      bridges: "/images/hydra_guitarist.jpg",
      processTap: "/images/hydra_producer_laptop.jpg",
      vst3Host: "/images/hydra_mixing_hands.jpg",
    },
  },
};

// FAQ content matches Hydra's real DOCUMENTATION.md / README.md — no invented
// features (no AVB, no Dolby Atmos, no "GroundControl" branding).
const FAQ_ITEMS = [
  {
    question: "What is Hydra and how does it work on macOS?",
    answer: "Hydra is a high-performance virtual audio patchbay for macOS. It exposes eight independent Hydra Audio Bridges (2 to 128 channels each, native Core Audio AudioServerPlugIn HAL devices) that any app can select as input or output. A visual Matrix Grid lets you route audio freely between applications, physical hardware, out-of-process VST3 plugins, and network endpoints — no physical cabling required."
  },
  {
    question: "How does ASRC drift correction work with physical hardware?",
    answer: "When you add a physical audio interface to the grid, Hydra applies built-in Asynchronous Sample Rate Conversion (ASRC) with real-time jitter correction. This keeps devices running on independent hardware clocks — a USB microphone and a Thunderbolt interface, for example — in sync without pops, clicks, or drift."
  },
  {
    question: "Can I stream audio over the network with AES67 or NDI?",
    answer: "Yes. Hydra subscribes to AES67 AoIP streams (PTPv2-synced, SAP/SDP discovery) and NDI audio sources directly into the Matrix Grid. Any bridge can also be marked to broadcast as an AES67 or NDI transmitter for other machines on the network to pick up."
  },
  {
    question: "What is the Control Room Monitor?",
    answer: "The Control Room card gives you studio monitor-controller functions right from the sidebar: DIM, MONO sum (for phase checks), SWAP L/R, master MUTE, and a dedicated TALKBACK MIC that ducks background audio. A floating, always-on-top Studio HUD keeps these controls one click away while you work in your DAW."
  },
  {
    question: "Is there a free trial and how does licensing work?",
    answer: "Hydra comes with a 90-day fully functional free trial. A full perpetual license is a single purchase with lifetime updates, protected by Quadra Guard 2.0 — hardware-bound (HWID) Ed25519 activation that works fully offline once activated, permitting up to 2 Macs per license via your Quadra ID."
  }
];

export default function Hydra() {
  const highlightsContainerRef = useRef<HTMLDivElement>(null);
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mouse drag scrolling handler for fluid carousel interaction
  const setupDragScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    return {
      onMouseDown: (e: React.MouseEvent) => {
        if (!ref.current) return;
        isDown = true;
        startX = e.pageX - ref.current.offsetLeft;
        scrollLeft = ref.current.scrollLeft;
      },
      onMouseLeave: () => { isDown = false; },
      onMouseUp: () => { isDown = false; },
      onMouseMove: (e: React.MouseEvent) => {
        if (!isDown || !ref.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        ref.current.scrollLeft = scrollLeft - walk;
      }
    };
  };

  const highlightsDragProps = setupDragScroll(highlightsContainerRef);
  const toolsDragProps = setupDragScroll(toolsContainerRef);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -640 : 640;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.hydraPage} data-theme="dark">
      <ThemeSetter theme="dark" />

      {/* Apple Sticky LocalNav */}
      <LocalNav
        title="Hydra"
        price="$199.99"
        buyUrl="/store"
        links={[
          { label: "Overview", href: "#overview", active: true },
          { label: "Matrix Grid", href: "#tools" },
          { label: "Network Audio", href: "#network" },
          { label: "Control Room", href: "#control-room" },
          { label: "Tech Specs", href: "#specs" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      {/* Feature Capabilities Ribbon */}
      <ProductRibbon />

      <div className={styles.hydraContent}>

        {/* =========================================
           1. SECTION WELCOME (Full Viewport Media + Text Overlay & Shadow Fade)
           ========================================= */}
        <section className={styles.sectionWelcome} id="overview">

          {/* Full Viewport Background Media Canvas */}
          <div className={styles.welcomeHeroMediaContainer}>
            <img
              src={QUADRA_ASSETS.images.hero}
              alt="Hydra Matrix Grid routing audio on macOS"
              className={styles.heroVideo}
            />
            <div className={styles.shadowOverlay} />
          </div>

          {/* Overlaid Content with Shadow Fade Animation */}
          <div className={styles.welcomeHeroOverlayContent}>
            <div className={styles.appIconBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className={styles.welcomeEyebrow}>Hydra</h1>
            <h2 className={styles.welcomeHeadline}>The complete virtual audio patchbay.</h2>
            <p className={styles.welcomeBody}>
              Hydra is a high-performance virtual audio patchbay for macOS: eight selectable Hydra Audio Bridges (2 to 128 channels each) that any app can pick as its input or output, routed freely between apps, hardware interfaces, out-of-process VST3 plugins, and network audio — <strong>all in one visual Matrix Grid.</strong>
            </p>
          </div>

        </section>


        {/* =========================================
           2. SECTION BANNER
           ========================================= */}
        <section className={styles.sectionBanner}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerCopy}>
              <span className={styles.bannerBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Quadra Guard 2.0
              </span>
              <h2 className={styles.bannerHeadline}>Eight bridges. One matrix.</h2>
              <p className={styles.bannerDescription}>
                Hydra Audio Bridges — 2‑A, 2‑B, 4, 8, 16, 32, 64 and 128 channels — give you up to 256 channels of routing headroom, unifying apps, hardware, plugins and the network into one cross-point Matrix Grid.
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
            <div className={styles.bannerAsset}>
              <img src={QUADRA_ASSETS.images.banner} alt="Hydra app icon" />
            </div>
          </div>
        </section>


        {/* =========================================
           3. SECTION HIGHLIGHTS (Media Card Gallery with Fluid Drag + Navigation)
           ========================================= */}
        <section className={styles.sectionHighlights}>
          <div className={styles.highlightsHeaderCopy}>
            <h2 className={styles.sectionHeaderHeadline}>Get to know Hydra.</h2>
            <div className={styles.carouselNavControls}>
              <button
                onClick={() => scrollCarousel(highlightsContainerRef, "left")}
                aria-label="Previous card"
                className={styles.carouselNavBtn}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                onClick={() => scrollCarousel(highlightsContainerRef, "right")}
                aria-label="Next card"
                className={styles.carouselNavBtn}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div
            className={styles.highlightsGalleryContainer}
            ref={highlightsContainerRef}
            {...highlightsDragProps}
          >
            <div className={styles.highlightsRow}>

              <div className={styles.highlightMediaCard}>
                <img src={QUADRA_ASSETS.images.highlights.matrixGrid} alt="Hydra Matrix Grid cross-point routing" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>The Matrix Grid: click a cross-point to patch a transmitter to a receiver.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={QUADRA_ASSETS.images.highlights.bridges} alt="Eight Hydra Audio Bridges" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Eight Hydra Audio Bridges from 2 to 128 channels — any app can select one.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={QUADRA_ASSETS.images.highlights.vst3} alt="Out-of-process VST3 hosting" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Out-of-process VST3 hosting keeps a crashing plugin from taking down your DAW.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={QUADRA_ASSETS.images.highlights.network} alt="AES67 and NDI network audio" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Subscribe to AES67 and NDI network audio streams straight into the grid.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={QUADRA_ASSETS.images.highlights.controlRoom} alt="Hydra Control Room monitor controller" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Control Room: DIM, MONO, SWAP L/R, MUTE and TALKBACK from one card.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={QUADRA_ASSETS.images.highlights.asrc} alt="ASRC drift correction for physical devices" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Built-in ASRC keeps independent hardware clocks locked, drift-free.</h3>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================
           4. THE MATRIX GRID (Caption Tile Gallery + Full-bleed demo)
           ========================================= */}
        <section className={styles.sectionApp} id="tools">
          <div className={styles.appHeaderCopy}>
            <div className={styles.appHeaderTopRow}>
              <div>
                <span className={styles.appEyebrow}>The Matrix Grid</span>
                <h2 className={styles.appHeadline}>Route anything, to anything.</h2>
              </div>
              <div className={styles.carouselNavControls}>
                <button
                  onClick={() => scrollCarousel(toolsContainerRef, "left")}
                  aria-label="Previous tool"
                  className={styles.carouselNavBtn}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button
                  onClick={() => scrollCarousel(toolsContainerRef, "right")}
                  aria-label="Next tool"
                  className={styles.carouselNavBtn}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>
            <p className={styles.appCopy}>
              Transmitters run down one axis, receivers across the other. <strong>Click any intersection to patch them together</strong> — a glowing indicator confirms the connection is live.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <img
              src={QUADRA_ASSETS.images.matrixDemo}
              alt="Hydra Matrix Grid demo"
              className={styles.heroVideo}
            />
          </div>

          <div
            className={styles.scrollGalleryContainer}
            ref={toolsContainerRef}
            {...toolsDragProps}
          >
            <div className={styles.captionTileRow}>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Eight Hydra Audio Bridges.</h3>
                  <p>2‑A, 2‑B, 4, 8, 16, 32, 64 and 128‑channel virtual soundcards appear in System Settings and every DAW. Pick the size that fits the job — podcasting, stems, or a full orchestral session.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={QUADRA_ASSETS.images.tiles.bridges} alt="Hydra Audio Bridges" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Flux Capture & Process Taps.</h3>
                  <p>Tap an individual app's audio — Zoom, Chrome, Spotify, Discord — via the macOS 14.4+ Core Audio Process Tap API. The app keeps playing normally; Hydra gets a continuous copy of the stream.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={QUADRA_ASSETS.images.tiles.processTap} alt="Per-app process tap capture" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Out-of-Process VST3 Hosting.</h3>
                  <p>Third-party VST3 plugins run in dedicated, sandboxed worker processes. If a plugin crashes, the worker restarts automatically — your DAW and the Hydra engine keep running.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={QUADRA_ASSETS.images.tiles.vst3Host} alt="Out-of-process VST3 worker hosting" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Hardware ASRC.</h3>
                  <p>Add a physical interface to the grid and Hydra applies drift-corrected Asynchronous Sample Rate Conversion automatically — no pops, clicks or buffer xruns between independent clocks.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={QUADRA_ASSETS.images.highlights.asrc} alt="ASRC hardware clock correction" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>AES67 & NDI Network Audio.</h3>
                  <p>Hydra slaves to PTPv2 and subscribes to SAP-announced AES67 multicast streams, plus NDI sources on the network — both land directly as channels in the grid.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={QUADRA_ASSETS.images.highlights.network} alt="AES67 and NDI network streaming" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>OSC & Control-Surface MIDI.</h3>
                  <p>Drive Hydra from Stream Deck (via Companion), TouchOSC, or a console over OSC — or connect a Pro Tools / Logic Pro control surface over HUI-compatible MIDI.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={QUADRA_ASSETS.images.highlights.controlRoom} alt="OSC and control surface support" />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================
           5. NETWORKED AUDIO (AES67 + NDI)
           ========================================= */}
        <section className={styles.sectionApp} id="network">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Network Audio</span>
            <h2 className={styles.appHeadline}>The studio is the network.</h2>
            <p className={styles.appCopy}>
              Turn your Mac into a network audio endpoint. Hydra receives <strong>PTP-synced AES67 AoIP streams</strong> and <strong>NDI audio sources</strong>, and can broadcast any bridge back out to the network — no proprietary hardware required.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <img src={QUADRA_ASSETS.images.networkHero} alt="Hydra AES67 and NDI network audio matrix" />
          </div>
        </section>


        {/* =========================================
           6. CONTROL ROOM MONITOR
           ========================================= */}
        <section className={styles.sectionApp} id="control-room">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Control Room Monitor</span>
            <h2 className={styles.appHeadline}>Monitor control, always in reach.</h2>
            <p className={styles.appCopy}>
              <strong>DIM, MONO, SWAP L/R and MUTE</strong> your master output, plus a dedicated <strong>TALKBACK MIC</strong> that ducks background audio — right from the sidebar, or from a floating, always-on-top Studio HUD while you work in your DAW.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <img
              src={QUADRA_ASSETS.images.controlRoomDemo}
              alt="Hydra Control Room monitor controller interface"
              className={styles.heroVideo}
            />
          </div>
        </section>


        {/* =========================================
           7. SECURITY & LICENSING
           ========================================= */}
        <section className={styles.sectionApp}>
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Quadra Guard 2.0</span>
            <h2 className={styles.appHeadline}>Licensed once, yours for good.</h2>
            <p className={styles.appCopy}>
              Hydra activation is hardware-bound (HWID) and verified with Ed25519 asymmetric signatures — checked locally, fully offline, once activated. Every license covers up to two Macs under your Quadra ID.
            </p>
          </div>
        </section>


        {/* =========================================
           8. TECH SPECS
           ========================================= */}
        <section className={styles.sectionApp} id="specs">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>System Specifications</span>
            <h2 className={styles.appHeadline}>Engineered for macOS and Apple Silicon.</h2>
          </div>

          <div className={styles.techSpecsGrid}>
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
        </section>


        {/* =========================================
           9. FREQUENTLY ASKED QUESTIONS (Apple FAQ Accordion)
           ========================================= */}
        <section className={styles.sectionFaq} id="faq">
          <div className={styles.faqHeaderCopy}>
            <h2 className={styles.sectionHeaderHeadline}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={`${styles.faqItem} ${openFaq === idx ? styles.faqOpen : ""}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className={styles.faqQuestionRow}>
                  <h3>{item.question}</h3>
                  <span className={styles.faqChevron}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </span>
                </div>
                {openFaq === idx && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* =========================================
           10. TRIAL FOOTER CTA
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
