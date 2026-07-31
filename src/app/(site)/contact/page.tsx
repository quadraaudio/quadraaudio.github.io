import styles from "./simple.module.scss";

export const metadata = {
  title: "Contact",
  description: "Contact Quadra Audio.",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Contact</p>
        <h1 className="display display-lg">Talk to Quadra.</h1>
        <p className="lede">
          For support, sales, and press — reach us at the addresses below
          (placeholders until your final mailboxes are live).
        </p>
        <div className={styles.prose}>
          <p>
            <strong>Support:</strong> support@quadraaudio.com
          </p>
          <p>
            <strong>Sales:</strong> sales@quadraaudio.com
          </p>
          <p>
            <strong>Press:</strong> press@quadraaudio.com
          </p>
        </div>
      </div>
    </main>
  );
}
