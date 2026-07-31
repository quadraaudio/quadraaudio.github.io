"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import styles from "./PayPalCheckout.module.scss";

type Props = {
  couponCode?: string;
  disabled?: boolean;
};

export function PayPalCheckout({ couponCode, disabled }: Props) {
  const { items, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <p className={styles.notice}>
        PayPal is not configured. Set <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>.
      </p>
    );
  }

  if (disabled) {
    return (
      <p className={styles.notice}>
        This order totals $0 — use Claim license instead of PayPal.
      </p>
    );
  }

  return (
    <div className={styles.wrap}>
      {capturing ? (
        <p className={styles.notice} role="status">
          Confirming payment and issuing licenses…
        </p>
      ) : null}
      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", color: "black", shape: "rect", label: "pay" }}
          disabled={capturing}
          onCancel={() => {
            setCapturing(false);
            setError("PayPal checkout was cancelled. Your bag is unchanged.");
          }}
          createOrder={async () => {
            setError(null);
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: items.map((i) => ({
                  slug: i.slug,
                  quantity: i.quantity,
                })),
                couponCode: couponCode || undefined,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              if (data?.code === "ZERO_TOTAL" || data?.error === "ZERO_TOTAL") {
                throw new Error("Order is free — use Claim license.");
              }
              throw new Error(data?.error || "Could not create PayPal order");
            }
            return data.id as string;
          }}
          onApprove={async (data) => {
            setCapturing(true);
            setError(null);
            try {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderID,
                  items: items.map((i) => ({
                    slug: i.slug,
                    quantity: i.quantity,
                  })),
                  couponCode: couponCode || undefined,
                }),
              });
              const json = await res.json();
              if (!res.ok) {
                if (json?.code === "paid_but_unfulfilled") {
                  router.push(
                    `/store/success?status=pending_fulfillment&paypal=${encodeURIComponent(
                      data.orderID,
                    )}&order=${encodeURIComponent(json.orderNumber || "")}`,
                  );
                  return;
                }
                throw new Error(json?.error || "Capture failed");
              }
              if (!json.persisted) {
                router.push(
                  `/store/success?status=pending_fulfillment&paypal=${encodeURIComponent(
                    data.orderID,
                  )}&order=${encodeURIComponent(json.orderNumber || "")}`,
                );
                return;
              }
              clear();
              router.push(
                `/store/success?status=ok&order=${encodeURIComponent(json.orderNumber || "")}`,
              );
            } catch (err) {
              setError(err instanceof Error ? err.message : "Payment failed");
              setCapturing(false);
            }
          }}
          onError={() => {
            setCapturing(false);
            setError("PayPal reported an error. Try again or contact support.");
          }}
        />
      </PayPalScriptProvider>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
