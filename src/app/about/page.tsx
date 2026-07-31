import styles from "./simple.module.scss";

export const metadata = {
  title: "About",
  description: "Quadra builds professional audio software.",
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">About</p>
        <h1 className="display display-lg">A software house for pro audio.</h1>
        <p className="lede">
          Quadra is a developer of professional audio software — in the tradition
          of companies that equip studios with tools that stay installed for years.
        </p>
        <div className={styles.prose}>
          <p>
            We design processors and utilities for engineers, producers, and
            facilities who need dependable sound, clear licensing, and software
            that respects the session.
          </p>
          <p>
            This site is a clean foundation: cinematic marketing, a working store
            with Auth0 and PayPal, and placeholder catalog SKUs you can replace
            with your final product line.
          </p>
        </div>
      </div>
    </main>
  );
}
