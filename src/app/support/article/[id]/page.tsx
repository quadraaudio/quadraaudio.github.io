import Link from "next/link";
import ThemeSwitcher from "../../../hydra/ThemeSwitcher";
import styles from "./page.module.scss";

// Next.js App Router dynamic route component
export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  // Convert slug to a readable title for the mock display
  // e.g., "configuring-ndi" -> "Configuring Ndi"
  const generateTitle = (slug: string) => {
    if (!slug) return "Support Article";
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const resolvedParams = await params;
  const articleTitle = generateTitle(resolvedParams.id);

  return (
    <div className={styles.articlePage}>
      {/* Force pure white background globally for support articles */}
      <ThemeSwitcher forceTheme="light" />

      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumb}>
        <Link href="/support">Support</Link>
        <span>&gt;</span>
        <span>{articleTitle}</span>
      </div>

      <article className={styles.articleContainer}>
        <header className={styles.articleHeader}>
          <h1>{articleTitle}</h1>
          <p className={styles.publishDate}>Published: October 14, 2026</p>
        </header>

        <div className={styles.articleContent}>
          <p>
            Learn how to manage this specific feature of your Quadra product. 
            Before you begin, make sure your device is running the latest software version and is connected to the internet.
          </p>

          <h2>Step 1: Check your system requirements</h2>
          <p>
            Ensure your Mac meets the minimum requirements. You will need a Mac with Apple Silicon (M1 or later) or an Intel-based Mac running macOS Monterey or later.
          </p>
          <ul>
            <li>Open the Apple menu  in the corner of your screen.</li>
            <li>Choose About This Mac.</li>
            <li>Verify your processor and memory capabilities.</li>
          </ul>

          <div className={styles.instructionImage}>
            [Instructional Image Placeholder]
          </div>

          <h2>Step 2: Configure the settings</h2>
          <p>
            Once you have verified your hardware, open the Quadra app. Navigate to the Preferences pane (Cmd + ,) and select the Routing tab. 
            From here, you can enable advanced features and allocate your I/O streams accordingly.
          </p>
          <ol>
            <li>Click the "Enable Advanced Matrix" checkbox.</li>
            <li>Select your primary audio interface from the dropdown menu.</li>
            <li>Click Apply to restart the audio engine.</li>
          </ol>

          <p>
            If you experience any latency or dropouts after configuration, please return to the Support portal and search for "Troubleshooting Dropouts" for buffer optimization steps.
          </p>
        </div>

        {/* Feedback Section */}
        <div className={styles.feedbackBox}>
          <div className={styles.feedbackText}>Was this helpful?</div>
          <div className={styles.feedbackButtons}>
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
      </article>
    </div>
  );
}
