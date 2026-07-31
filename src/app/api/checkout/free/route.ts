import { NextResponse } from "next/server";
import { auth, googleAuthConfigured } from "@/auth";
import { persistCompletedOrder, priceCart } from "@/lib/checkout";

export async function POST(request: Request) {
  if (!googleAuthConfigured) {
    return NextResponse.json(
      { error: "Google sign-in is not configured" },
      { status: 503 }
    );
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
  if (priced.order.total > 0) {
    return NextResponse.json(
      {
        error: "NOT_FREE",
        message: "This order still has a balance. Use PayPal checkout.",
        total: priced.order.total,
      },
      { status: 400 }
    );
  }

  const email = session.user.email || "customer@quadraaudio.com";
  const persisted = await persistCompletedOrder({
    auth0Sub: session.user.id,
    email,
    name: session.user.name,
    priced: priced.order,
    paypalOrderId: null,
    status: "completed",
  });

  if (!persisted.ok) {
    return NextResponse.json(
      { error: persisted.error, code: persisted.code },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    orderNumber: persisted.orderNumber,
  });
}
