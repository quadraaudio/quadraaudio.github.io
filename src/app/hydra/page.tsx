"use client";

import { useState, useRef } from "react";
import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import ProductRibbon from "@/components/ProductRibbon";
import Link from "next/link";
import styles from "./page.module.scss";

// Real high-resolution Apple media & video assets from Apple's CDN
const APPLE_ASSETS = {
  videos: {
    hero: "https://www.apple.com/105/media/us/logic-pro/2025/794dd86c-0741-407e-9c0f-3debae4027e9/anim/hero/large.mp4",
    beatMaking: "https://www.apple.com/105/media/us/logic-pro/2025/794dd86c-0741-407e-9c0f-3debae4027e9/anim/beat-making-hero/large.mp4",
    mixing: "https://www.apple.com/105/media/us/logic-pro/2025/794dd86c-0741-407e-9c0f-3debae4027e9/anim/mixing/large.mp4",
  },
  images: {
    heroFallback: "https://www.apple.com/v/logic-pro/n/images/overview/welcome/hero_endframe__dc7irycb3gia_large.jpg",
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
    ipadHero: "https://www.apple.com/v/logic-pro/n/images/overview/ipad/hero__d7n1vwlh7u standard_large.jpg",
    tiles: {
      drumKit: "https://www.apple.com/v/logic-pro/n/images/overview/beat_making/drum_kit__cioqfuz0ic2u_large.jpg",
      sampler: "https://www.apple.com/v/logic-pro/n/images/overview/beat_making/sampler__d2etbz4szeoi_large.jpg",
      sequencer: "https://www.apple.com/v/logic-pro/n/images/overview/beat_making/sequencer__f1h9xqirvxqq_large.jpg",
    }
  }
};

const FAQ_ITEMS = [
  {
    question: "What is Hydra and how does it work on macOS?",
    answer: "Hydra is a professional virtual soundcard, AoIP network matrix, and spatial audio monitor controller for macOS. It uses native Core Audio driver extensions to create up to 4 configurable virtual audio devices (2 to 256 channels per device), allowing you to route, record, and monitor audio between any DAW, system application, physical hardware interface, or network stream without physical cables."
  },
  {
    question: "How does GroundControl Interface Fusion work?",
    answer: "GroundControl Interface Fusion combines up to 8 physical hardware audio interfaces (such as Apogee, Universal Audio, Focusrite, or RME) into a single aggregate driver. It features Automatic Sample Rate Conversion (ASRC) to eliminate clock drift, buffer xruns, and sample rate mismatches between hardware interfaces."
  },
  {
    question: "Can I stream uncompressed audio over local Ethernet networks?",
    answer: "Yes. Hydra natively supports NDI® Audio (up to 128 uncompressed channels), AVB Audio (up to 256 channels), and AES67 RTP multicast streaming via SAP/SDP parsing. This lets you stream uncompressed low-latency audio between computers, broadcast setups, and mixing consoles on local Ethernet networks."
  },
  {
    question: "What spatial audio monitoring and Dolby Atmos features are included?",
    answer: "Hydra includes a complete monitor controller for setups up to 9.4.6 Dolby Atmos. It features integrated binaural renderers with Apple Spatial Audio HRTF head-tracking integration, quad-subwoofer crossover bass management, individual speaker mute/solo, and per-channel AU plugin slots for room correction EQ."
  },
  {
    question: "Is there a free trial and how does licensing work?",
    answer: "Hydra comes with a 90-day fully functional free trial with no channel limits or watermarks. A full perpetual license costs $199.99, includes lifetime minor and major v1.x updates, and permits activation on up to 2 Macs simultaneously using your Quadra ID."
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
          { label: "Virtual Patchbay", href: "#tools" },
          { label: "Network Audio", href: "#network" },
          { label: "Spatial Monitoring", href: "#spatial" },
          { label: "Tech Specs", href: "#specs" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      {/* Feature Capabilities Ribbon */}
      <ProductRibbon />

      <div className={styles.hydraContent}>
        
        {/* =========================================
           1. SECTION WELCOME (Full Viewport Video + Text Overlay & Shadow Fade)
           ========================================= */}
        <section className={styles.sectionWelcome} id="overview">
          
          {/* Full Viewport Background Video Canvas */}
          <div className={styles.welcomeHeroMediaContainer}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              poster={APPLE_ASSETS.images.heroFallback}
              className={styles.heroVideo}
            >
              <source src={APPLE_ASSETS.videos.hero} type="video/mp4" />
            </video>
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
            <h2 className={styles.welcomeHeadline}>Sound thinking.</h2>
            <p className={styles.welcomeBody}>
              Hydra is the ultimate virtual soundcard, AoIP network matrix, and spatial audio monitor controller for macOS.
              Engineered directly around native Core Audio driver extensions, Hydra features 4 configurable virtual audio soundcards with up to 256 I/O channels per driver, GroundControl hardware interface fusion, zero-latency application process capture, and high-density NDI® and AVB network streaming — giving producers, mix engineers, and broadcasters <strong>unrestricted freedom to route, process, and monitor sound without physical patchbays or limits.</strong>
            </p>
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
                Hydra unifies physical hardware interfaces, virtual drivers, DAWs, and local networks into one cohesive 32-bit float matrix — eliminating routing bottlenecks and hardware cabling.
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
              <img src={APPLE_ASSETS.images.banner} alt="Quadra Creator Studio software icons" />
            </div>
          </div>
        </section>


        {/* =========================================
           3. SECTION HIGHLIGHTS (Apple Media Card Gallery with Fluid Drag + Navigation)
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
                <img src={APPLE_ASSETS.images.highlights.playground} alt="Producer operating Hydra audio routing matrix" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>256-Channel Configurable Virtual Patchbay for DAWs and system apps.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.images.highlights.partner} alt="Hydra DSP routing channel strips" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>GroundControl Fusion combines up to 8 physical interfaces into one driver.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.images.highlights.beatMaking} alt="Hydra high-resolution waveform matrix" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>32-Bit Float C++ processing engine with sub-millisecond buffer speeds.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.images.highlights.sounds} alt="Hydra network audio matrix" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Stream 128 NDI® and 256 AVB channels over Ethernet with zero latency.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.images.highlights.mixed} alt="Hydra 9.4.6 Dolby Atmos spatial monitoring console" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Dolby Atmos 9.4.6 monitoring with Apple Spatial Audio HRTF head tracking.</h3>
                </div>
              </div>

              <div className={styles.highlightMediaCard}>
                <img src={APPLE_ASSETS.images.highlights.devices} alt="Apple Silicon Mac ecosystem running Hydra" />
                <div className={styles.highlightCaptionOverlay}>
                  <h3>Stream Deck, EUCON, MIDI CC, and OSC automation for instant snapshot recall.</h3>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =========================================
           4. VIRTUAL ROUTING TOOLS (Caption Tile Gallery + Autoplay Video)
           ========================================= */}
        <section className={styles.sectionApp} id="tools">
          <div className={styles.appHeaderCopy}>
            <div className={styles.appHeaderTopRow}>
              <div>
                <span className={styles.appEyebrow}>Virtual Routing Tools</span>
                <h2 className={styles.appHeadline}>Unleash the beats.</h2>
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
              Build custom virtual soundcards, <strong>route audio directly between software applications</strong>, and capture system audio with zero latency. It’s everything you need to route, split, and monitor sound cleanly.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className={styles.heroVideo}
            >
              <source src={APPLE_ASSETS.videos.beatMaking} type="video/mp4" />
            </video>
          </div>

          <div 
            className={styles.scrollGalleryContainer} 
            ref={toolsContainerRef}
            {...toolsDragProps}
          >
            <div className={styles.captionTileRow}>
              
              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>4 Custom Virtual Drivers.</h3>
                  <p>Create and customize 4 independent virtual audio soundcards with 2 to 256 channels per driver. Seamlessly patch audio between Logic Pro, Pro Tools, and OBS Studio.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.images.tiles.drumKit} alt="Virtual Soundcard matrix" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>Core Audio Process Tap.</h3>
                  <p>Isolate and capture high-fidelity audio streams directly from running applications like Zoom, Chrome, Discord, or Spotify with zero added driver latency.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.images.tiles.sampler} alt="Application Audio Capture" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>GroundControl LINK Plugin.</h3>
                  <p>Sub-millisecond DAW routing plugin (AU / VST3 / AAX) for direct signal insertion straight from DAW channel strips into Hydra’s virtual patchbay.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.images.tiles.sequencer} alt="GroundControl LINK plugin" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>GroundControl Interface Fusion.</h3>
                  <p>Combine up to 8 physical hardware audio interfaces into a single unified driver with automatic sample rate conversion (ASRC) and zero clock drift.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.images.highlights.partner} alt="Interface Fusion Engine" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>AoIP Network Audio (NDI® & AVB).</h3>
                  <p>Transmit and receive up to 128 NDI® channels and 256 AVB uncompressed Ethernet audio channels across local studio machines with zero packet loss.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.images.highlights.sounds} alt="AoIP Network Streaming" />
                </div>
              </div>

              <div className={styles.captionTileItem}>
                <div className={styles.tileCopy}>
                  <h3>9.4.6 Spatial Audio Monitoring.</h3>
                  <p>Comprehensive monitor controller supporting 9.4.6 Dolby Atmos layouts, binaural renderers, Apple Spatial Audio HRTF, quad-subwoofer bass crossovers, and AU plugin slots.</p>
                </div>
                <div className={styles.tileMediaFrame}>
                  <img src={APPLE_ASSETS.images.highlights.mixed} alt="Spatial Audio Monitoring" />
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
              Turn your Mac into a high-capacity network audio hub. Send and receive <strong>multichannel uncompressed audio over local Ethernet</strong> using NDI®, AVB, and AES67 RTP protocols.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <img src={APPLE_ASSETS.images.soundsHero} alt="Studio Display displaying Hydra Network Audio Matrix" />
          </div>
        </section>


        {/* =========================================
           6. SPATIAL AUDIO & MONITOR CONTROL (Autoplay Video)
           ========================================= */}
        <section className={styles.sectionApp} id="spatial">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Spatial Audio & Monitor Control</span>
            <h2 className={styles.appHeadline}>Surround yourself in sound.</h2>
            <p className={styles.appCopy}>
              Monitor <strong>9.4.6 Dolby Atmos mixes</strong> with built-in binaural renderers, Apple Spatial Audio HRTF head-tracking integration, quad-subwoofer crossover bass management, and per-channel AU plugin slots for room correction.
            </p>
          </div>

          <div className={styles.fullBleedMediaFrame}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className={styles.heroVideo}
            >
              <source src={APPLE_ASSETS.videos.mixing} type="video/mp4" />
            </video>
          </div>
        </section>


        {/* =========================================
           7. HYDRA REMOTE & MOBILITY
           ========================================= */}
        <section className={styles.sectionApp}>
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Hydra Remote & iPadOS</span>
            <h2 className={styles.appHeadline}>Control your matrix anywhere.</h2>
            <p className={styles.appCopy}>
              Use the Hydra Remote app for iPadOS to control your matrix routing, recall snapshots, tweak 9.4.6 speaker mute/solo settings, and adjust monitor volumes wirelessly from anywhere in the studio.
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
              <p>macOS Sonoma 14.0 or later. Universal Binary natively optimized for Apple Silicon (M1/M2/M3/M4) and Intel Core processors.</p>
            </div>

            <div className={styles.specCard}>
              <h3>Driver & DSP Architecture</h3>
              <p>32-bit Float real-time C++ engine with 0ms added driver latency and sample rates from 44.1 kHz up to 384 kHz.</p>
            </div>

            <div className={styles.specCard}>
              <h3>Network & Automation</h3>
              <p>128 NDI® channels, 256 AVB channels, AES67 SAP/SDP, Core Audio Process Tap, Elgato Stream Deck, EUCON, MIDI CC, and OSC automation.</p>
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
