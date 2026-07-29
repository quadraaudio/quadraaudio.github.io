import Link from "next/link";
import ThemeSwitcher from "../../../hydra/ThemeSwitcher";
import styles from "./page.module.scss";

const ARTICLES_DB: Record<string, {
  title: string;
  category: string;
  date: string;
  summary: string;
  steps: { heading: string; text: string; bullets?: string[] }[];
}> = {
  "configuring-ndi": {
    title: "Configuring NDI® Audio Streaming in Hydra",
    category: "Setup & AoIP",
    date: "July 2026",
    summary: "Hydra allows sending and receiving up to 128 uncompressed channels of low-latency NDI® Audio over standard Gigabit or 10GbE Ethernet networks.",
    steps: [
      {
        heading: "1. Enable NDI Audio Server in Hydra",
        text: "Launch Hydra on your Mac, open Preferences (Cmd + ,), and navigate to the Network & AoIP tab. Toggle 'Enable NDI Audio Streamer'.",
        bullets: [
          "Set your preferred sample rate (48 kHz or 96 kHz).",
          "Specify the channel group count (e.g. 8ch, 16ch, or 128ch matrix).",
          "Ensure your local firewall permits mDNS discovery on port 5353."
        ]
      },
      {
        heading: "2. Assign Application or DAW Inputs",
        text: "In the Hydra Matrix patchbay grid, connect the application sources (Logic Pro, Pro Tools, OBS Studio) to the designated NDI output buses.",
        bullets: [
          "NDI streams will be broadcast automatically to all machines on the local subnet.",
          "Use NDI Monitor or NDI Tools to verify incoming stream feeds."
        ]
      }
    ]
  },
  "license-activation": {
    title: "Managing Quadra ID License Activations",
    category: "Licensing & Account",
    date: "July 2026",
    summary: "Each perpetual Hydra license permits concurrent activation on 2 Mac computers under a single Quadra ID, as well as air-gapped offline .qkey generation.",
    steps: [
      {
        heading: "1. Online Activation via Quadra ID",
        text: "Open Hydra software, select Hydra > License > Sign In, and log in with your Quadra ID credentials or Google OAuth account.",
        bullets: [
          "Your activation token is instantly verified against the database.",
          "You can manage active devices from your Account Dashboard."
        ]
      },
      {
        heading: "2. Offline Studio License (.qkey)",
        text: "For air-gapped studio machines without internet connectivity, navigate to your Quadra ID Account dashboard on a connected device.",
        bullets: [
          "Copy your Mac's Hardware ID (found in Hydra > License > Offline Activation).",
          "Paste the Hardware ID in the offline generator on your account page.",
          "Download the encrypted .qkey file and import it directly into Hydra."
        ]
      }
    ]
  },
  "optimizing-buffer": {
    title: "Optimizing Buffer Size & Preventing Audio Dropouts",
    category: "Troubleshooting",
    date: "July 2026",
    summary: "Eliminate buffer xruns, audio dropouts, and CPU overload when routing heavy multichannel audio streams across DAWs and system drivers.",
    steps: [
      {
        heading: "1. Adjust Core Audio Buffer Size",
        text: "In Hydra Preferences > Driver Settings, set the Core Audio System Extension buffer size to 128 or 256 samples for real-time live performance, or 512 samples for heavy 9.4.6 Atmos mixes.",
        bullets: [
          "Ensure GroundControl ASRC (Automatic Sample Rate Conversion) is enabled when mixing physical hardware interfaces.",
          "Disable macOS App Nap for background DAW processes."
        ]
      }
    ]
  },
  "groundcontrol-fusion": {
    title: "Setting Up GroundControl Fusion Audio Drivers",
    category: "Virtual Soundcard",
    date: "July 2026",
    summary: "GroundControl Interface Fusion combines up to 8 physical hardware audio interfaces into a single aggregate driver without clock drift or buffer desynchronization.",
    steps: [
      {
        heading: "1. Create a Fusion Aggregation Group",
        text: "In Hydra > Virtual Soundcards, click 'New GroundControl Fusion Driver'. Select your hardware interfaces (Apogee, UAD, Focusrite, RME).",
        bullets: [
          "Enable Automatic Sample Rate Conversion (ASRC).",
          "Assign the primary master clock interface."
        ]
      }
    ]
  },
  "dolby-atmos-916": {
    title: "Dolby Atmos 9.4.6 Matrix & HRTF Binaural Monitoring",
    category: "Spatial Audio",
    date: "July 2026",
    summary: "Configure Hydra as a spatial audio monitor controller supporting 9.4.6 Dolby Atmos speaker layouts, quad-subwoofer bass crossovers, and Apple Spatial Audio HRTF head tracking.",
    steps: [
      {
        heading: "1. Configure Speaker Matrix",
        text: "Open Hydra Spatial Controller tab and select 9.4.6 Dolby Atmos preset. Assign output physical channels to your multi-speaker monitor rig.",
        bullets: [
          "Apply room correction AU plugins on per-channel insert slots.",
          "Enable binaural headphone monitoring with Apple Head Tracking."
        ]
      }
    ]
  }
};

export function generateStaticParams() {
  return [
    { id: "configuring-ndi" },
    { id: "license-activation" },
    { id: "optimizing-buffer" },
    { id: "groundcontrol-fusion" },
    { id: "dolby-atmos-916" },
    { id: "quadra-id-account" },
    { id: "getting-started" },
  ];
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const article = ARTICLES_DB[id] || {
    title: id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    category: "Support Guide",
    date: "July 2026",
    summary: "Detailed engineering guide for configuring Hydra software drivers and spatial audio routing on macOS.",
    steps: [
      {
        heading: "1. Check System Compatibility",
        text: "Ensure your Mac is running macOS Sonoma 14.0 or later with an Apple Silicon M1/M2/M3/M4 or Intel Core i7/i9 processor.",
        bullets: [
          "Verify Core Audio Driver Extensions permissions in System Settings > Privacy & Security.",
          "Ensure your Quadra ID is signed in for automatic driver authorization."
        ]
      },
      {
        heading: "2. Configure Audio Engine",
        text: "Open Hydra Preferences (Cmd + ,) to select your primary buffer size and sample rate preferences."
      }
    ]
  };

  return (
    <div className={styles.articlePage}>
      <ThemeSwitcher forceTheme="dark" />

      {/* Apple Support Breadcrumb Bar */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContent}>
          <Link href="/support">Support Hub</Link>
          <span className={styles.slash}>/</span>
          <span className={styles.activePage}>{article.category}</span>
        </div>
      </div>

      <article className={styles.articleContainer}>
        <header className={styles.articleHeader}>
          <span className={styles.categoryBadge}>{article.category}</span>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          <p className={styles.publishDate}>Published: {article.date} • Reference ID: Q-KB-{id}</p>
        </header>

        <div className={styles.articleContent}>
          <div className={styles.leadSummary}>
            {article.summary}
          </div>

          {article.steps.map((step, idx) => (
            <div key={idx} className={styles.stepSection}>
              <h2>{step.heading}</h2>
              <p>{step.text}</p>
              {step.bullets && (
                <ul className={styles.stepList}>
                  {step.bullets.map((b, bidx) => (
                    <li key={bidx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className={styles.helpNote}>
            <h3>Need further assistance with this configuration?</h3>
            <p>
              Our engineering team is ready to assist. Submit a technical ticket on the <Link href="/support/contact">Engineering Support Desk</Link>.
            </p>
          </div>
        </div>

        <div className={styles.feedbackBox}>
          <span className={styles.feedbackText}>Was this article helpful?</span>
          <div className={styles.feedbackButtons}>
            <button type="button" className={styles.feedbackBtn}>Yes</button>
            <button type="button" className={styles.feedbackBtn}>No</button>
          </div>
        </div>
      </article>
    </div>
  );
}
