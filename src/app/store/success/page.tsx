import Link from "next/link";
import styles from "./success.module.scss";

export const metadata = {
  title: "Order confirmed",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Success</p>
        <h1 className="display display-lg">You&apos;re all set.</h1>
        <p className="lede">
          {order
            ? `Order ${order} is confirmed. Your licenses are available in your account.`
            : "Your order is confirmed. Your licenses are available in your account."}
        </p>
        <div className={styles.actions}>
          <Link href="/account" className="btn btn-primary">
            Go to account
          </Link>
          <Link href="/store" className="btn btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
