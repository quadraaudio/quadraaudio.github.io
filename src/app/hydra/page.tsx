"use client";

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

export default function Hydra() {
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
          <h2 className={styles.welcomeHeadline}>Sound thinking.</h2>
          <p className={styles.welcomeBody}>
            Hydra is the ultimate virtual soundcard and multichannel audio routing software for Mac and iPad.
            It features a 256-channel virtual patchbay, driver fusion engine, and zero-latency AoIP streaming — giving you <strong>unrestricted creative freedom to route and capture sound without limits.</strong>
          </p>

          <div className={styles.welcomeHeroMediaContainer}>
            <img src={APPLE_ASSETS.hero} alt="MacBook Pro 16 and iPad Pro running Hydra audio matrix" className={styles.heroImage} />
            <div className={styles.heroPlayOverlay}>
              <div className={styles.playButton}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span>Watch the film</span>
            </div>
          </div>
        </section>


        {/* =========================================
           2. SECTION BANNER (Apple Creator Studio)
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
              <h2 className={styles.bannerHeadline}>A suite deal for any creator.</h2>
              <p className={styles.bannerDescription}>
                Hydra is part of Quadra Creator Studio, the essential collection of creative audio software built for macOS and Quadra Silicon.
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
           3. SECTION HIGHLIGHTS (Apple Media Card Gallery)
           ========================================= */}
        <section className={styles.sectionHighlights}>
          <div className={styles.highlightsHeaderCopy}>
            <h2 className={styles.sectionHeaderHeadline}>Get to know Hydra.</h2>
          </div>
          
          <div className={styles.highlightsGalleryContainer}>
            <div className={styles.highlightsRow}>
              
              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.highlights.playground} alt="Producer creating without boundaries on MacBook Pro" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>A musical playground for beats, songwriting, recording, and remixing.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.highlights.partner} alt="Hydra channel strip and DSP routing controls" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Intelligent tools handle the complex so you can focus on the creative.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.highlights.beatMaking} alt="Hydra matrix and waveform display" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Unbeatable features for quick and easy virtual audio routing.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.highlights.sounds} alt="Hydra network audio routing matrix" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Network audio over IP with up to 128 NDI and 256 AVB channels.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.highlights.mixed} alt="Hydra mixing console with 24 track faders" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>The tools you need to turn your ideas into fully mixed and mastered tracks.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.highlights.devices} alt="Apple ecosystem devices running Hydra software" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Your Apple devices, apps, and accessories all play well together.</h3>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================
           4. VIRTUAL ROUTING TOOLS (Caption Tile Gallery)
           ========================================= */}
        <section className={styles.sectionApp} id="tools">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Virtual Routing Tools</span>
            <h2 className={styles.appHeadline}>Unleash the beats.</h2>
            <p className={styles.appCopy}>
              Build custom virtual soundcards, <strong>route audio directly between software applications</strong>, and transform samples into entirely new instruments. It’s everything you need to route, split, and bring your ideas to life.
            </p>
          </div>

          <div className={styles.scrollGalleryContainer}>
            <div className={styles.captionTileRow}>
              
              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Build custom virtual soundcards.</h3>
                  <p>Create Core Audio virtual devices with up to 256 input/output channels per device. Integrated with Step Sequencer for fast workflows.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.tiles.drumKit} alt="Virtual Soundcard Engine" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>App Audio Capture & Loopback.</h3>
                  <p>Record, chop, flip, and transform application audio streams directly from Zoom, Chrome, Discord, or Spotify.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.tiles.sampler} alt="App Audio Capture" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>GroundControl LINK Plugin.</h3>
                  <p>Sub-millisecond DAW routing plugin (AU / VST3 / AAX) for direct signal insertion straight from your DAW channel strips.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.tiles.sequencer} alt="GroundControl LINK plugin" />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================
           5. NETWORKED AUDIO & BROADCAST
           ========================================= */}
        <section className={styles.sectionApp} id="network">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Networked Audio & Broadcast</span>
            <h2 className={styles.appHeadline}>Sounds by the trackload.</h2>
            <p className={styles.appCopy}>
              Turn your Mac into a high-capacity network audio hub. Send and receive <strong>multichannel uncompressed audio over local Ethernet</strong> using NDI® and AVB protocols.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <img src={APPLE_ASSETS.soundsHero} alt="Studio Display running Hydra Audio Matrix" />
          </div>
        </section>


        {/* =========================================
           6. SPATIAL AUDIO & MONITOR CONTROL
           ========================================= */}
        <section className={styles.sectionApp} id="spatial">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Spatial Audio & Monitor Control</span>
            <h2 className={styles.appHeadline}>Surround yourself in sound.</h2>
            <p className={styles.appCopy}>
              Monitor <strong>9.1.6 Dolby Atmos mixes</strong> with built-in binaural renderers, Apple Spatial Audio HRTF head-tracking integration, and custom AU plugin slots for speaker calibration.
            </p>
          </div>
        </section>


        {/* =========================================
           7. TECH SPECS
           ========================================= */}
        <section className={styles.sectionApp} id="specs">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>System Specifications</span>
            <h2 className={styles.appHeadline}>Engineered for macOS and Quadra Silicon.</h2>
          </div>

          <div className={styles.scrollGalleryContainer}>
            <div className={styles.captionTileRow}>
              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Mac Compatibility</h3>
                  <p>macOS Sonoma 14.0 or later. Fully native on Apple Silicon (M1/M2/M3/M4) and Intel-based Macs.</p>
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Driver Architecture</h3>
                  <p>Native Core Audio extension with 0ms added driver latency and 32-bit Float processing precision.</p>
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Channel & Sample Rates</h3>
                  <p>Up to 256 virtual channels. Sample rates from 44.1 kHz to 384 kHz with automatic clock synchronization.</p>
                </div>
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
