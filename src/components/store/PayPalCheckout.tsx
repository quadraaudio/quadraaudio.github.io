"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import styles from "./PayPalCheckout.module.scss";

type Props = {
  clientId: string;
  currency?: string;
  couponCode?: string;
};

export function PayPalCheckout({ clientId, currency = "USD", couponCode }: Props) {
  const { items, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (!clientId) {
    return (
      <p className={styles.notice}>
        PayPal is not configured. Add `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and
        `PAYPAL_CLIENT_SECRET` to enable checkout.
      </p>
    );
  }

  if (!items.length) {
    return <p className={styles.notice}>Your bag is empty.</p>;
  }

  return (
    <div className={styles.wrap}>
      {error ? <p className={styles.error}>{error}</p> : null}
      <PayPalScriptProvider
        options={{
          clientId,
          currency,
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", shape: "pill", color: "black" }}
          createOrder={async () => {
            setError(null);
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: items.map((item) => ({
                  slug: item.slug,
                  quantity: item.quantity,
                })),
                couponCode,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Unable to create PayPal order");
              throw new Error(data.error || "create order failed");
            }
            return data.id as string;
          }}
          onApprove={async (data) => {
            setError(null);
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderID: data.orderID,
                items: items.map((item) => ({
                  slug: item.slug,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  currency: item.currency,
                })),
                couponCode,
              }),
            });
            const payload = await res.json();
            if (!res.ok) {
              setError(payload.error || "Payment capture failed");
              return;
            }
            clear();
            router.push(
              `/store/success?order=${encodeURIComponent(payload.orderNumber || "")}`
            );
          }}
          onError={() => setError("PayPal reported an error. Try again.")}
        />
      </PayPalScriptProvider>
    </div>
  );
}
