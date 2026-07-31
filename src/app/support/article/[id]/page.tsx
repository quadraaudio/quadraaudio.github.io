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
    title: "Configuring AES67 & NDI Network Audio in Hydra",
    category: "Setup & AoIP",
    date: "July 2026",
    summary: "Hydra subscribes to PTP-synced AES67 AoIP streams and NDI audio sources (up to 16 channels per source) directly into the Matrix Grid over standard Ethernet.",
    steps: [
      {
        heading: "1. Enable Network Audio in Hydra",
        text: "Launch Hydra, switch the sidebar to the Network tab, and check the AES67 and NDI Sources sections for discovered streams on your local network.",
        bullets: [
          "AES67 streams are discovered via SAP/SDP announcement and slave to PTPv2.",
          "NDI sources appear automatically once the NDI runtime is installed.",
          "Toggle Subscribe on a stream or source to add its channels to the grid."
        ]
      },
      {
        heading: "2. Assign Application or DAW Inputs",
        text: "In the Matrix Grid, click a cross-point to connect an application source (Logic Pro, Pro Tools, OBS Studio) to the incoming network channels, or mark a bridge to transmit outward.",
        bullets: [
          "Any bridge can be marked as an AES67 TX or NDI TX source for other machines to pick up.",
          "Check the sidebar's PTP status footer to confirm clock lock before mixing."
        ]
      }
    ]
  },
  "license-activation": {
    title: "Managing Quadra ID License Activations",
    category: "Licensing & Account",
    date: "July 2026",
    summary: "Each perpetual Hydra license is protected by Quadra Guard 2.0 and permits activation on 2 Mac computers under a single Quadra ID, verified offline via hardware-bound Ed25519 signatures.",
    steps: [
      {
        heading: "1. Online Activation via Quadra ID",
        text: "Open Hydra, select Hydra > License > Sign In, and log in with your Quadra ID credentials or Google OAuth account.",
        bullets: [
          "Your activation token is signed with Ed25519 and verified locally on your Mac.",
          "You can manage active devices from your Account Dashboard."
        ]
      },
      {
        heading: "2. Hardware-Bound Offline Activation",
        text: "Quadra Guard 2.0 hashes your Mac's hardware identifier (HWID) to bind the license to that specific device, so once activated it keeps working without an internet connection.",
        bullets: [
          "Find your Mac's Hardware ID under Hydra > License > Offline Activation.",
          "Each license covers up to 2 Macs — deactivate one to free a seat for another."
        ]
      }
    ]
  },
  "optimizing-buffer": {
    title: "Optimizing Buffer Size & Preventing Audio Dropouts",
    category: "Troubleshooting",
    date: "July 2026",
    summary: "Eliminate buffer xruns, audio dropouts, and CPU overload when routing high channel-count audio across DAWs, bridges, and physical hardware.",
    steps: [
      {
        heading: "1. Adjust Core Audio Buffer Size",
        text: "In Hydra Settings > Audio Engine, set the buffer size anywhere from 32 to 1024 samples — lower for real-time live performance, higher for heavy multichannel sessions.",
        bullets: [
          "Ensure ASRC (Automatic Sample Rate Conversion) is enabled for any physical hardware interface in the grid.",
          "Disable macOS App Nap for background DAW processes."
        ]
      }
    ]
  },
  "hardware-asrc-setup": {
    title: "Setting Up Physical Devices with ASRC",
    category: "Virtual Soundcard",
    date: "July 2026",
    summary: "Hydra's built-in Asynchronous Sample Rate Converters (ASRC) keep physical hardware interfaces running on independent clocks perfectly in sync — no drift, no xruns.",
    steps: [
      {
        heading: "1. Add a Device to the Grid",
        text: "In the sidebar's Devices tab, toggle a detected audio interface's switch to add its channels to the Matrix Grid.",
        bullets: [
          "ASRC drift correction is applied automatically — no manual clock configuration needed.",
          "Devices that go offline keep their patches; Hydra re-binds them automatically on reconnect."
        ]
      }
    ]
  },
  "control-room-monitor": {
    title: "Using the Control Room Monitor",
    category: "Monitor Control",
    date: "July 2026",
    summary: "The Control Room card gives you DIM, MONO, SWAP L/R, MUTE and a dedicated TALKBACK MIC, plus a floating always-on-top Studio HUD for at-a-glance monitor control.",
    steps: [
      {
        heading: "1. Open the Control Room Card",
        text: "The Control Room card sits at the bottom of the sidebar. Use DIM to attenuate master output, MONO to sum L/R for phase checks, SWAP L/R, or MUTE to silence the master bus.",
        bullets: [
          "TALKBACK MIC activates your configured mic and ducks background audio automatically.",
          "Use the gearshape icon to select your monitor output device and talkback mic."
        ]
      },
      {
        heading: "2. Floating Studio HUD",
        text: "Click the picture-in-picture icon in the Control Room card header to open a compact, always-on-top HUD — handy for keeping monitor controls visible over a full-screen DAW.",
      }
    ]
  }
};

export function generateStaticParams() {
  return [
    { id: "configuring-ndi" },
    { id: "license-activation" },
    { id: "optimizing-buffer" },
    { id: "hardware-asrc-setup" },
    { id: "control-room-monitor" },
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
    summary: "Detailed engineering guide for configuring Hydra's audio bridges, Matrix Grid, and network routing on macOS.",
    steps: [
      {
        heading: "1. Check System Compatibility",
        text: "Ensure your Mac is running macOS 26 (Tahoe) or later with Apple Silicon (M1/M2/M3/M4) or an Intel (x86_64) processor.",
        bullets: [
          "Verify the HydraAudio.driver HAL plug-in is installed under System Settings > Privacy & Security.",
          "Ensure your Quadra ID is signed in for license verification."
        ]
      },
      {
        heading: "2. Configure Audio Engine",
        text: "Open Hydra Settings > Audio Engine to select your preferred buffer size and review bridge channel counts."
      }
    ]
  };

  return (
    <div className={styles.articlePage}>
      <ThemeSwitcher forceTheme="light" />

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
