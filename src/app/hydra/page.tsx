"use client";

import { useState } from "react";
import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import ProductRibbon from "@/components/ProductRibbon";
import Link from "next/link";
import styles from "./page.module.scss";

// Real high-resolution Apple media assets
const APPLE_ASSETS = {
  hero: "https://www.apple.com/v/logic-pro/n/images/overview/welcome/hero_endframe__dc7irycb3gia_large.jpg",
  banner: "https://www.apple.com/v/logic-pro/n/images/overview/welcome/welcome_banner__ehgiu77lsru6_large.png",
  highlights: {
    playground: "https://www.apple.com/v/logic-pro/n/images/overview/highlights/playground__d9sjwzqicsqe_large.jpg",
    partner: "https://www.apple.com/v/logic-pro/n/images/overview/highlights/partner__exi088xbzt26_large.jpg",
    beatMaking: "https://www.apple.com/v/logic-pro/n/images/overview/highlights/beat_making__io5w14fjrl6q_large.jpg",
    sounds: "https://www.apple.com/v/logic-pro/n/images/overview/highlights/sounds_instruments__fpsglohz2jee_large.jpg",
    mixed: "https://www.apple.com/v/logic-pro/n/images/overview/highlights/mixed_mastered__gfhgq7ngylim_large.jpg",
    devices: "https://www.apple.com/v/logic-pro/n/images/overview/highlights/devices__d9ntdk3mic2u_large.jpg",
  },
  soundsHero: "https://www.apple.com/v/logic-pro/n/images/overview/sounds/hero__ebfnroijwc6e_large.jpg",
  tiles: {
    drumKit: "https://www.apple.com/v/logic-pro/n/images/overview/beat_making/drum_kit__cioqfuz0ic2u_large.jpg",
    sampler: "https://www.apple.com/v/logic-pro/n/images/overview/beat_making/sampler__d2etbz4szeoi_large.jpg",
    sequencer: "https://www.apple.com/v/logic-pro/n/images/overview/beat_making/sequencer__f1h9xqirvxqq_large.jpg",
  }
};

interface TabContent {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  mediaUrl: string;
}

const VIRTUAL_TOOLS_TABS: TabContent[] = [
  {
    id: "patchbay",
    tabLabel: "256-Channel Patchbay",
    title: "Virtual Soundcard Matrix Engine",
    description: "Create custom Core Audio virtual devices with up to 256 input and output channels per device. Route audio uncompressed between DAWs, virtual devices, and system apps with zero latency.",
    mediaUrl: APPLE_ASSETS.tiles.drumKit,
  },
  {
    id: "capture",
    tabLabel: "App Audio Capture",
    title: "System-wide Application Loopback",
    description: "Isolate and capture audio streams directly from Zoom, Chrome, Discord, or Spotify without needing third-party virtual cables or complex aggregate drivers.",
    mediaUrl: APPLE_ASSETS.tiles.sampler,
  },
  {
    id: "plugin",
    tabLabel: "GroundControl LINK",
    title: "Direct DAW Plugin Insertion",
    description: "AU / VST3 / AAX plugin for direct sub-millisecond audio routing straight from your DAW channel strips into Hydra's virtual patchbay.",
    mediaUrl: APPLE_ASSETS.tiles.sequencer,
  },
];

const NETWORK_TABS: TabContent[] = [
  {
    id: "ndi",
    tabLabel: "NDI® Multichannel",
    title: "128-Channel NDI® Audio over IP",
    description: "Stream up to 128 channels of uncompressed broadcast-grade audio over local Ethernet directly to any Mac, PC, or broadcast receiver.",
    mediaUrl: APPLE_ASSETS.soundsHero,
  },
  {
    id: "avb",
    tabLabel: "AVB Protocol",
    title: "256-Channel AVB Hardware Networking",
    description: "Native AVB protocol integration allows seamless hardware networking with zero buffer latency and guaranteed bandwidth reservation.",
    mediaUrl: APPLE_ASSETS.highlights.partner,
  },
];

const SPATIAL_TABS: TabContent[] = [
  {
    id: "atmos",
    tabLabel: "Dolby Atmos 9.1.6",
    title: "Immersive Dolby Atmos Matrix",
    description: "Full 9.1.6 surround monitoring with integrated binaural renderers, room speaker alignment, and quad-subwoofer bass management.",
    mediaUrl: APPLE_ASSETS.highlights.mixed,
  },
  {
    id: "hrtf",
    tabLabel: "Binaural Head-Tracking",
    title: "Apple Spatial Audio HRTF Monitoring",
    description: "Monitor spatial audio mixes directly on AirPods Max with dynamic head tracking and personalized HRTF binaural rendering.",
    mediaUrl: APPLE_ASSETS.highlights.devices,
  },
];

export default function Hydra() {
  const [activeToolTab, setActiveToolTab] = useState(0);
  const [activeNetworkTab, setActiveNetworkTab] = useState(0);
  const [activeSpatialTab, setActiveSpatialTab] = useState(0);

  const currentTool = VIRTUAL_TOOLS_TABS[activeToolTab];
  const currentNetwork = NETWORK_TABS[activeNetworkTab];
  const currentSpatial = SPATIAL_TABS[activeSpatialTab];

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
          <h2 className={styles.welcomeHeadline}>Sound thinking. Boundless freedom.</h2>
          <p className={styles.welcomeBody}>
            Hydra is the ultimate virtual soundcard and multichannel audio routing software for Mac.
            It removes every routing boundary — allowing you to combine physical soundcards, patch uncompressed audio between DAWs like Logic Pro and Pro Tools, and stream multichannel audio over NDI® networks with <strong>zero latency and infinite digital headroom.</strong>
          </p>

          <div className={styles.welcomeHeroMediaContainer}>
            <img src={APPLE_ASSETS.hero} alt="MacBook Pro and iPad Pro running Hydra audio matrix" className={styles.heroImage} />
            <div className={styles.heroPlayOverlay}>
              <div className={styles.playButton}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span>Watch the launch film</span>
            </div>
          </div>
        </section>


        {/* =========================================
           2. SECTION BANNER (Quadra Creator Studio)
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
              <h2 className={styles.bannerHeadline}>Complete creative freedom for modern producers.</h2>
              <p className={styles.bannerDescription}>
                Hydra acts as your central virtual patchbay, monitor controller, and spatial audio renderer — connecting every app, interface, and hardware device without physical limitations.
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
              <img src={APPLE_ASSETS.banner} alt="Quadra Creator Studio suite icons" />
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
              <div className={styles.highlightCardHeader}>
                <h3 className={styles.highlightHeadline}>256-Channel Virtual Patchbay</h3>
                <p className={styles.highlightBody}>
                  Route audio freely between any application, hardware input, or virtual Core Audio driver with zero latency and zero signal loss.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <img src={APPLE_ASSETS.highlights.playground} alt="Producer creating without boundaries on MacBook Pro" />
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightCardHeader}>
                <h3 className={styles.highlightHeadline}>GroundControl Driver Fusion</h3>
                <p className={styles.highlightBody}>
                  Combine multiple physical audio interfaces into a single unified driver without aggregate clock drift or hardware constraints.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <img src={APPLE_ASSETS.highlights.partner} alt="Hydra channel strip and DSP routing controls" />
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightCardHeader}>
                <h3 className={styles.highlightHeadline}>32-Bit Float Dynamic Engine</h3>
                <p className={styles.highlightBody}>
                  Pristine signal quality offering infinite dynamic headroom, zero digital clipping, and sample rates up to 384 kHz.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <img src={APPLE_ASSETS.highlights.beatMaking} alt="Hydra matrix and waveform display" />
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightCardHeader}>
                <h3 className={styles.highlightHeadline}>NDI® & AVB Network Streaming</h3>
                <p className={styles.highlightBody}>
                  Stream up to 128 NDI channels and 256 AVB channels uncompressed over local Ethernet to any Mac or broadcast receiver.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <img src={APPLE_ASSETS.highlights.sounds} alt="Hydra network audio routing matrix" />
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightCardHeader}>
                <h3 className={styles.highlightHeadline}>Mixing & Master Suite Pro</h3>
                <p className={styles.highlightBody}>
                  Integrated precision faders, real-time spectral analysis, and custom AU plugin slots for room calibration.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <img src={APPLE_ASSETS.highlights.mixed} alt="Hydra mixing console with 24 track faders" />
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightCardHeader}>
                <h3 className={styles.highlightHeadline}>Seamless Ecosystem Integration</h3>
                <p className={styles.highlightBody}>
                  Works effortlessly across Mac, iPadOS, AirPods Max head-tracking, and external controllers like Stream Deck.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <img src={APPLE_ASSETS.highlights.devices} alt="Apple ecosystem devices running Hydra software" />
              </div>
            </div>
          </div>
        </section>


        {/* =========================================
           4. SECTION VIRTUAL ROUTING TOOLS (INTERACTIVE TABS)
           ========================================= */}
        <section className={styles.sectionApp} id="tools">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Virtual Routing Tools</span>
            <h2 className={styles.appHeadline}>Unleash your signal flow.</h2>
            <p className={styles.appCopy}>
              Build custom virtual soundcards, <strong>route audio directly between software applications</strong>, and capture system audio with zero latency. Hydra gives you total freedom to route, split, and process sound without physical cabling.
            </p>
          </div>

          <div className={styles.tabNavRow}>
            {VIRTUAL_TOOLS_TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveToolTab(idx)}
                className={`${styles.tabPill} ${activeToolTab === idx ? styles.activeTabPill : ''}`}
              >
                {tab.tabLabel}
              </button>
            ))}
          </div>

          <div className={styles.interactiveCanvasFrame}>
            <div className={styles.canvasMediaWrapper}>
              <img src={currentTool.mediaUrl} alt={currentTool.title} />
            </div>
            <div className={styles.canvasTextOverlay}>
              <h3>{currentTool.title}</h3>
              <p>{currentTool.description}</p>
            </div>
          </div>
        </section>


        {/* =========================================
           5. SECTION NETWORK AUDIO (INTERACTIVE TABS)
           ========================================= */}
        <section className={styles.sectionApp} id="network">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Networked Audio & Broadcast</span>
            <h2 className={styles.appHeadline}>Audio over IP made seamless.</h2>
            <p className={styles.appCopy}>
              Turn your Mac into a high-capacity network audio hub. Send and receive <strong>multichannel uncompressed audio over local Ethernet</strong> using NDI® and AVB protocols.
            </p>
          </div>

          <div className={styles.tabNavRow}>
            {NETWORK_TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveNetworkTab(idx)}
                className={`${styles.tabPill} ${activeNetworkTab === idx ? styles.activeTabPill : ''}`}
              >
                {tab.tabLabel}
              </button>
            ))}
          </div>

          <div className={styles.interactiveCanvasFrame}>
            <div className={styles.canvasMediaWrapper}>
              <img src={currentNetwork.mediaUrl} alt={currentNetwork.title} />
            </div>
            <div className={styles.canvasTextOverlay}>
              <h3>{currentNetwork.title}</h3>
              <p>{currentNetwork.description}</p>
            </div>
          </div>
        </section>


        {/* =========================================
           6. SECTION SPATIAL AUDIO (INTERACTIVE TABS)
           ========================================= */}
        <section className={styles.sectionApp} id="spatial">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Spatial Audio & Monitor Control</span>
            <h2 className={styles.appHeadline}>Surround yourself in sound.</h2>
            <p className={styles.appCopy}>
              Monitor <strong>9.1.6 Dolby Atmos mixes</strong> with built-in binaural renderers, Apple Spatial Audio HRTF head-tracking integration, custom AU plugin slots for speaker calibration, and bass management for up to four subwoofers.
            </p>
          </div>

          <div className={styles.tabNavRow}>
            {SPATIAL_TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveSpatialTab(idx)}
                className={`${styles.tabPill} ${activeSpatialTab === idx ? styles.activeTabPill : ''}`}
              >
                {tab.tabLabel}
              </button>
            ))}
          </div>

          <div className={styles.interactiveCanvasFrame}>
            <div className={styles.canvasMediaWrapper}>
              <img src={currentSpatial.mediaUrl} alt={currentSpatial.title} />
            </div>
            <div className={styles.canvasTextOverlay}>
              <h3>{currentSpatial.title}</h3>
              <p>{currentSpatial.description}</p>
            </div>
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
              <div className={styles.tileText}>
                <h3>Mac Compatibility</h3>
                <p>macOS Sonoma 14.0 or later. Fully native on Apple Silicon (M1/M2/M3/M4) and Intel-based Macs.</p>
              </div>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileText}>
                <h3>Driver Architecture</h3>
                <p>Native Core Audio extension with 0ms added driver latency and 32-bit Float processing precision.</p>
              </div>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileText}>
                <h3>Channel & Sample Rates</h3>
                <p>Up to 256 virtual channels. Sample rates from 44.1 kHz to 384 kHz with automatic clock synchronization.</p>
              </div>
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
