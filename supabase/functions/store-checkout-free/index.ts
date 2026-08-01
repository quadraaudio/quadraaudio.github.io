import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

const FULFILLMENT_SECRET =
  Deno.env.get("STORE_FULFILLMENT_SECRET") ||
  "HLrlrMSlvdRTcvFsr4ty6J5rY4GThWksQbZhzJxp8CM";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function googleUser(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.sub || !data.email) return null;
  return {
    id: String(data.sub),
    email: String(data.email),
    name: data.name || null,
  };
}

function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QDA-${stamp}-${rand}`;
}

async function resolveCoupon(
  supabase: SupabaseClient,
  codeRaw: string
): Promise<{ code: string; percent: number; amount: number } | null> {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return null;
  const { data } = await supabase
    .from("coupons")
    .select("code, discount_percent, discount_amount, active, expires_at")
    .ilike("code", code)
    .eq("active", true)
    .maybeSingle();
  if (!data) return null;
  if (data.expires_at && Date.parse(String(data.expires_at)) < Date.now()) {
    return null;
  }
  return {
    code: String(data.code).toUpperCase(),
    percent: Number(data.discount_percent || 0),
    amount: Number(data.discount_amount || 0),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const body = await req.json();
    const user = await googleUser(body.googleAccessToken || "");
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) {
      return Response.json({ error: "Bag is empty" }, { status: 400, headers: CORS });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
        Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const lines = [];
    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("slug,name,price,currency,availability_status")
        .eq("slug", item.slug)
        .maybeSingle();
      if (!product || product.availability_status !== "available") {
        return Response.json(
          { error: `Product unavailable: ${item.slug}` },
          { status: 400, headers: CORS }
        );
      }
      const quantity = Math.max(1, Number(item.quantity) || 1);
      lines.push({
        slug: product.slug,
        name: product.name,
        quantity,
        unitPrice: Number(product.price),
        currency: product.currency || "USD",
      });
    }

    const gross = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    const coupon = await resolveCoupon(supabase, body.couponCode || "");
    let total = gross;
    if (coupon) {
      total = Math.max(0, gross * (1 - coupon.percent / 100) - coupon.amount);
    }
    total = Number(total.toFixed(2));

    if (total > 0) {
      return Response.json(
        {
          error:
            "NOT_FREE — apply an active 100% coupon from the store catalog (e.g. FREE100 / VIP100).",
          total,
        },
        { status: 400, headers: CORS }
      );
    }

    if (!coupon) {
      return Response.json(
        { error: "A valid promo code is required for $0 checkout." },
        { status: 400, headers: CORS }
      );
    }

    const orderNumber = makeOrderNumber();
    const { data, error } = await supabase.rpc("fulfill_store_order_auth0", {
      p_secret: FULFILLMENT_SECRET,
      p_auth0_sub: user.id,
      p_order_number: orderNumber,
      p_email: user.email,
      p_name: user.name || "",
      p_total: total,
      p_currency: lines[0]?.currency || "USD",
      p_paypal_order_id: "",
      p_coupon_code: coupon.code,
      p_status: "completed",
      p_items: lines,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500, headers: CORS });
    }

    return Response.json(
      { ok: true, persisted: true, orderNumber: data?.orderNumber || orderNumber },
      { headers: CORS }
    );
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "failed" },
      { status: 500, headers: CORS }
    );
  }
});
