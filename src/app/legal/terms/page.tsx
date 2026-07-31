import styles from "../legal.module.scss";

export const metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Legal</p>
        <h1 className="display display-md">Terms of Use &amp; EULA</h1>
        <div className={styles.prose}>
          <p>
            By purchasing or using Quadra software, you agree to a limited,
            non-exclusive, non-transferable license for personal or professional
            use on machines you own or control.
          </p>
          <p>
            Licenses are tied to your Quadra account. You may not reverse
            engineer, redistribute, or rent Quadra software except as allowed by
            applicable law.
          </p>
          <p>
            Software is provided as-is within the limits of consumer protection
            laws. See the refunds page for purchase policies.
          </p>
          <p>This is a placeholder EULA for the rebuild launch.</p>
        </div>
      </div>
    </main>
  );
}
