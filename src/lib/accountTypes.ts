/** Account licenses / orders types shared by UI and checkout helpers. */

export type AccountOrderItem = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency?: string;
};

export type AccountOrder = {
  order_number: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  items?: AccountOrderItem[];
  coupon_code?: string | null;
  paypal_order_id?: string | null;
};

export type AccountActivation = {
  hardware_id: string;
  activated_at: string;
};

export type AccountLicense = {
  id: string;
  product_slug: string;
  status: string;
  issued_at: string;
  expires_at?: string | null;
  order_number?: string | null;
  seats_used: number;
  seats_max: number;
  activations: AccountActivation[];
};

export type AccountPayload = {
  orders: AccountOrder[];
  licenses: AccountLicense[];
  error?: string;
};

/** Legacy catalog slugs → display name when seed/catalog miss. */
export const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  hydra: "MATRIX",
  "quadra-matrix": "MATRIX",
  matrix: "MATRIX",
};

export function formatAccountDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatAccountDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function shortHardwareId(hwid: string) {
  const clean = hwid.trim();
  if (clean.length <= 14) return clean;
  return `${clean.slice(0, 8)}…${clean.slice(-4)}`;
}

export function orderGross(order: AccountOrder) {
  const items = order.items || [];
  return items.reduce(
    (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 1),
    0
  );
}

export function orderDiscount(order: AccountOrder) {
  const gross = orderGross(order);
  const paid = Number(order.total_amount) || 0;
  return Math.max(0, Number((gross - paid).toFixed(2)));
}

export function licenseTermLabel(expiresAt: string | null | undefined) {
  if (!expiresAt || expiresAt === "PERPETUAL") return "Perpetual";
  const d = new Date(expiresAt);
  if (Number.isNaN(d.getTime())) return String(expiresAt);
  return `Until ${formatAccountDate(expiresAt)}`;
}
