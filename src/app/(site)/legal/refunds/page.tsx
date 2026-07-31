import styles from "../legal.module.scss";

export const metadata = {
  title: "Refunds",
};

export default function RefundsPage() {
  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Legal</p>
        <h1 className="display display-md">Refund Policy</h1>
        <div className={styles.prose}>
          <p>
            Digital software purchases are generally final once a license has been
            issued. If you experience a technical issue that prevents use,
            contact support@quadraaudio.com within 14 days of purchase.
          </p>
          <p>
            Approved refunds are processed through the original PayPal payment
            method.
          </p>
          <p>This is a placeholder refund policy for the rebuild launch.</p>
        </div>
      </div>
    </main>
  );
}
