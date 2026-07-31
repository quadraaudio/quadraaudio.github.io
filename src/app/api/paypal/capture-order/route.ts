import { NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { capturePayPalOrder, paypalConfigured } from "@/lib/paypal";
import { persistCompletedOrder, priceCart } from "@/lib/checkout";

export async function POST(request: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }
  if (!paypalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    orderId?: string;
    orderID?: string;
    items?: Array<{ slug: string; quantity: number }>;
    couponCode?: string;
  };

  const paypalOrderId = body.orderId || body.orderID;
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
  }

  const priced = await priceCart({
    items: (body.items || []).map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
    })),
    couponCode: body.couponCode,
  });
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: 400 });
  }
  if (priced.order.total <= 0) {
    return NextResponse.json(
      { error: "ZERO_TOTAL", message: "Use free checkout for $0 orders." },
      { status: 400 }
    );
  }

  let capture: Awaited<ReturnType<typeof capturePayPalOrder>>;
  try {
    capture = await capturePayPalOrder(paypalOrderId);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal capture failed" },
      { status: 502 }
    );
  }

  if (capture.status !== "COMPLETED") {
    return NextResponse.json(
      { error: `Unexpected PayPal status: ${capture.status}` },
      { status: 502 }
    );
  }

  const email =
    user.email ||
    capture.payer?.email_address ||
    "customer@quadraaudio.com";

  const persisted = await persistCompletedOrder({
    supabase,
    userId: user.id,
    email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    priced: priced.order,
    paypalOrderId: capture.id,
    status: "completed",
  });

  if (!persisted.ok) {
    return NextResponse.json(
      {
        code: "paid_but_unfulfilled",
        error: persisted.error,
        paypalOrderId: capture.id,
        orderNumber: persisted.orderNumber || null,
        message:
          "Payment completed, but we could not issue licenses automatically. Your bag was kept. Contact support with your PayPal order id.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    orderNumber: persisted.orderNumber,
    paypalStatus: capture.status,
    paypalOrderId: capture.id,
  });
}
