import styles from "../legal.module.scss";

export const metadata = {
  title: "Refunds",
  description: "Quadra Audio refund policy for digital software purchases.",
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
            issued to your Quadra account. By completing checkout you also accept
            our Terms of Use &amp; EULA.
          </p>
          <p>
            If a technical issue attributable to Quadra prevents you from using the
            software you purchased on a supported configuration, contact{" "}
            <a href="mailto:support@quadraaudio.com">support@quadraaudio.com</a>{" "}
            within 14 days of purchase. We may offer repair guidance, a replacement
            download, or a refund at our discretion.
          </p>
          <p>
            Approved refunds are processed through the original PayPal payment
            method. Mandatory consumer rights in your jurisdiction are not limited
            by this policy where those rights cannot be waived.
          </p>
        </div>
      </div>
    </main>
  );
}
