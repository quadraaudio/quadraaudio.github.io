import { NextResponse } from "next/server";
import { auth, googleAuthConfigured } from "@/auth";
import {
  buildPayPalUnits,
  priceCart,
} from "@/lib/checkout";
import { createPayPalOrder, paypalConfigured } from "@/lib/paypal";

export async function POST(request: Request) {
  if (!googleAuthConfigured) {
    return NextResponse.json(
      { error: "Google sign-in is not configured" },
      { status: 503 }
    );
  }
  if (!paypalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
  }
  if (!process.env.STORE_FULFILLMENT_SECRET) {
    return NextResponse.json(
      {
        error:
          "Checkout fulfillment is unavailable. STORE_FULFILLMENT_SECRET is required.",
      },
      { status: 503 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    items?: Array<{ slug: string; quantity: number }>;
    couponCode?: string;
  };

  const priced = await priceCart({
    items: body.items || [],
    couponCode: body.couponCode,
  });
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: 400 });
  }

  if (priced.order.total <= 0) {
    return NextResponse.json(
      {
        error: "ZERO_TOTAL",
        message: "This order is free. Use Claim license instead of PayPal.",
      },
      { status: 400 }
    );
  }

  try {
    const order = await createPayPalOrder({
      amount: priced.order.total.toFixed(2),
      currency: priced.order.currency,
      customId: session.user.id,
      items: buildPayPalUnits(priced.order),
    });

    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: priced.order.total,
      currency: priced.order.currency,
      coupon: priced.order.coupon?.code || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal create failed" },
      { status: 502 }
    );
  }
}
