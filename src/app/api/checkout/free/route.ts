import { NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { persistCompletedOrder, priceCart } from "@/lib/checkout";

export async function POST(request: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
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

  const email = user.email || "customer@quadraaudio.com";
  const persisted = await persistCompletedOrder({
    supabase,
    userId: user.id,
    email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
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
