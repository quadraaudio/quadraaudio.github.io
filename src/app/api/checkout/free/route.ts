import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";
import { persistCompletedOrder, priceCart } from "@/lib/checkout";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  if (!auth0Configured || !auth0) {
    return NextResponse.json({ error: "Auth0 is not configured" }, { status: 503 });
  }
  if (!getSupabaseAdmin()) {
    return NextResponse.json(
      {
        error:
          "Checkout fulfillment is unavailable. SUPABASE_SERVICE_ROLE_KEY is required.",
      },
      { status: 503 }
    );
  }

  const session = await auth0.getSession();
  if (!session?.user) {
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
    auth0Sub: session.user.sub,
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
