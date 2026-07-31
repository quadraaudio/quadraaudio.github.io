import styles from "../legal.module.scss";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Legal</p>
        <h1 className="display display-md">Privacy Policy</h1>
        <div className={styles.prose}>
          <p>
            Quadra Audio (&quot;Quadra&quot;) collects account information required to
            provide software licenses, store checkout, and support. When you sign
            in with your Quadra account, we receive your name and email address.
          </p>
          <p>
            Payment details are processed by PayPal. Quadra does not store full
            payment card numbers on its servers.
          </p>
          <p>
            Order and license records are stored in our database to deliver
            purchases and manage entitlements. Contact support@quadraaudio.com
            for privacy requests.
          </p>
          <p>This is a placeholder policy for the rebuild launch.</p>
        </div>
      </div>
    </main>
  );
}
