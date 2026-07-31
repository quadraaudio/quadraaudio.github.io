const DEFAULT_API_BASE = "https://api-m.sandbox.paypal.com";

function paypalConfig() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const apiBase = process.env.PAYPAL_API_BASE || DEFAULT_API_BASE;
  return { clientId, clientSecret, apiBase };
}

export function paypalConfigured() {
  const { clientId, clientSecret } = paypalConfig();
  return Boolean(clientId && clientSecret);
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, apiBase } = paypalConfig();
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${text}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export type PayPalPurchaseItem = {
  name: string;
  sku: string;
  unitAmount: string;
  quantity: string;
};

export async function createPayPalOrder(params: {
  amount: string;
  currency: string;
  items: PayPalPurchaseItem[];
  customId?: string;
}) {
  const { apiBase } = paypalConfig();
  const token = await getAccessToken();

  const itemTotal = params.items
    .reduce((sum, item) => sum + Number(item.unitAmount) * Number(item.quantity), 0)
    .toFixed(2);

  const res = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: params.customId,
          amount: {
            currency_code: params.currency,
            value: params.amount,
            breakdown: {
              item_total: {
                currency_code: params.currency,
                value: itemTotal,
              },
            },
          },
          items: params.items.map((item) => ({
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unit_amount: {
              currency_code: params.currency,
              value: item.unitAmount,
            },
          })),
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal create order error: ${text}`);
  }

  return res.json() as Promise<{ id: string; status: string }>;
}

export async function capturePayPalOrder(orderId: string) {
  const { apiBase } = paypalConfig();
  const token = await getAccessToken();

  const res = await fetch(`${apiBase}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture error: ${text}`);
  }

  return res.json() as Promise<{
    id: string;
    status: string;
    purchase_units?: Array<{
      payments?: { captures?: Array<{ id: string; status: string }> };
    }>;
    payer?: { email_address?: string };
  }>;
}
