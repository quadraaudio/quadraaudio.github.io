import type { SupabaseClient } from "@supabase/supabase-js";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/data/products.seed";
import {
  applyCouponToSubtotal,
  resolveCoupon,
  type ResolvedCoupon,
} from "@/lib/coupons";

export type CartLineInput = { slug: string; quantity: number };

export type PricedLine = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  product: Product;
};

export type PricedOrder = {
  lines: PricedLine[];
  currency: string;
  gross: number;
  total: number;
  coupon: ResolvedCoupon | null;
};

export function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QDA-${stamp}-${rand}`;
}

export async function priceCart(params: {
  items: CartLineInput[];
  couponCode?: string | null;
}): Promise<{ ok: true; order: PricedOrder } | { ok: false; error: string }> {
  if (!params.items?.length) {
    return { ok: false, error: "Bag is empty" };
  }

  const lines: PricedLine[] = [];
  for (const line of params.items) {
    const product = await getProductBySlug(line.slug);
    if (!product || product.availabilityStatus !== "available") {
      return { ok: false, error: `Product unavailable: ${line.slug}` };
    }
    const quantity = Math.max(1, Number(line.quantity) || 1);
    lines.push({
      slug: product.slug,
      name: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
      currency: product.currency,
      product,
    });
  }

  const gross = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const coupon = await resolveCoupon(params.couponCode);
  const total = Number(applyCouponToSubtotal(gross, coupon).toFixed(2));
  const currency = lines[0]?.currency || "USD";

  return {
    ok: true,
    order: { lines, currency, gross, total, coupon },
  };
}

export type PersistOrderInput = {
  supabase: SupabaseClient;
  userId: string;
  email: string;
  name?: string | null;
  priced: PricedOrder;
  paypalOrderId?: string | null;
  status?: string;
};

export type PersistOrderResult =
  | { ok: true; orderNumber: string; orderId: string }
  | {
      ok: false;
      code: "persist_failed";
      error: string;
      orderNumber?: string;
    };

export async function persistCompletedOrder(
  input: PersistOrderInput
): Promise<PersistOrderResult> {
  const orderNumber = makeOrderNumber();
  const itemsPayload = input.priced.lines.map((line) => ({
    slug: line.slug,
    name: line.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    currency: line.currency,
  }));

  try {
    const { data, error } = await input.supabase.rpc("fulfill_store_order", {
      p_order_number: orderNumber,
      p_email: input.email,
      p_name: input.name || "",
      p_total: input.priced.total,
      p_currency: input.priced.currency,
      p_paypal_order_id: input.paypalOrderId || "",
      p_coupon_code: input.priced.coupon?.code || "",
      p_status: input.status || "completed",
      p_items: itemsPayload,
    });

    if (error) {
      return {
        ok: false,
        code: "persist_failed",
        error: error.message,
        orderNumber,
      };
    }

    const payload = data as { ok?: boolean; orderId?: string; orderNumber?: string } | null;
    if (!payload?.ok || !payload.orderId) {
      return {
        ok: false,
        code: "persist_failed",
        error: "Fulfillment RPC returned an unexpected response",
        orderNumber,
      };
    }

    return {
      ok: true,
      orderNumber: payload.orderNumber || orderNumber,
      orderId: payload.orderId,
    };
  } catch (error) {
    return {
      ok: false,
      code: "persist_failed",
      error: error instanceof Error ? error.message : "Persist failed",
      orderNumber,
    };
  }
}

/** Build PayPal unit amounts that sum exactly to total. */
export function buildPayPalUnits(priced: PricedOrder) {
  if (priced.gross <= 0) return [];
  const ratio = priced.total / priced.gross;
  return priced.lines.map((line, index) => {
    const isLast = index === priced.lines.length - 1;
    if (isLast) {
      const prior = priced.lines.slice(0, -1).reduce((sum, entry) => {
        return sum + Number((entry.unitPrice * ratio).toFixed(2)) * entry.quantity;
      }, 0);
      const remaining = Number((priced.total - prior).toFixed(2));
      const unit = Number((remaining / line.quantity).toFixed(2));
      return {
        name: line.name,
        sku: line.slug,
        quantity: String(line.quantity),
        unitAmount: unit.toFixed(2),
      };
    }
    return {
      name: line.name,
      sku: line.slug,
      quantity: String(line.quantity),
      unitAmount: (line.unitPrice * ratio).toFixed(2),
    };
  });
}
