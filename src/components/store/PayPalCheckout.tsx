"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { callEdgeFunction } from "@/lib/edgeApi";
import styles from "./PayPalCheckout.module.scss";

type Props = {
  couponCode?: string;
  disabled?: boolean;
};

export function PayPalCheckout({ couponCode, disabled }: Props) {
  const { user } = useAuth();
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
          disabled={capturing || !user?.accessToken}
          onCancel={() => {
            setCapturing(false);
            setError("PayPal checkout was cancelled. Your bag is unchanged.");
          }}
          createOrder={async () => {
            if (!user?.accessToken) throw new Error("Sign in with Google first");
            setError(null);
            const data = await callEdgeFunction<{ id?: string; error?: string }>(
              "store-paypal-create",
              {
                googleAccessToken: user.accessToken,
                items: items.map((i) => ({
                  slug: i.slug,
                  quantity: i.quantity,
                })),
                couponCode: couponCode || undefined,
              },
              user.accessToken
            );
            if (!data.id) throw new Error(data.error || "Could not create PayPal order");
            return data.id;
          }}
          onApprove={async (data) => {
            if (!user?.accessToken) throw new Error("Sign in with Google first");
            setCapturing(true);
            setError(null);
            try {
              const json = await callEdgeFunction<{
                persisted?: boolean;
                code?: string;
                orderNumber?: string;
                error?: string;
              }>(
                "store-paypal-capture",
                {
                  googleAccessToken: user.accessToken,
                  orderId: data.orderID,
                  items: items.map((i) => ({
                    slug: i.slug,
                    quantity: i.quantity,
                  })),
                  couponCode: couponCode || undefined,
                },
                user.accessToken
              );
              if (json.code === "paid_but_unfulfilled" || !json.persisted) {
                router.push(
                  `/store/success/?status=pending_fulfillment&paypal=${encodeURIComponent(
                    data.orderID
                  )}&order=${encodeURIComponent(json.orderNumber || "")}`
                );
                return;
              }
              clear();
              router.push(
                `/store/success/?status=ok&order=${encodeURIComponent(json.orderNumber || "")}`
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
