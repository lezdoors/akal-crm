import type { Order, OrderItem, OrderStatus } from "../types";

const CURRENCY_INTL_LOCALE: Record<string, string> = {
  USD: "en-US",
  EUR: "fr-FR",
  GBP: "en-GB",
};

/** Order amounts are stored as integer minor units (cents) with an ISO currency column. */
export function formatMoney(
  minorUnits: number | null | undefined,
  currency?: string | null,
): string {
  // A missing amount must not masquerade as $0.00.
  if (minorUnits == null) return "—";
  const code = currency || "USD";
  return new Intl.NumberFormat(CURRENCY_INTL_LOCALE[code] ?? "en-US", {
    style: "currency",
    currency: code,
  }).format(minorUnits / 100);
}

/** Matches the production storefront's generateOrderNumber() — "MT-NNNNNN". */
export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0");
  return `MT-${num}`;
}

export const ORDER_STATUS_CHOICES: { id: OrderStatus; name: string }[] = [
  { id: "pending", name: "resources.orders.status.pending" },
  { id: "paid", name: "resources.orders.status.paid" },
  { id: "shipped", name: "resources.orders.status.shipped" },
  { id: "delivered", name: "resources.orders.status.delivered" },
];

export const ORDER_CHANNEL_CHOICES = [
  { id: "direct", name: "resources.orders.channel.direct" },
  { id: "etsy", name: "resources.orders.channel.etsy" },
];

export const ORDER_CURRENCY_CHOICES = [
  { id: "USD", name: "USD" },
  { id: "EUR", name: "EUR" },
  { id: "GBP", name: "GBP" },
];

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "border-amber-600/50 text-amber-800 dark:text-amber-300 dark:border-amber-600/50",
  paid: "border-tobacco/50 text-tobacco dark:text-amber-200/90 dark:border-tobacco/60",
  shipped: "border-ink/30 text-ink-soft dark:text-stone-300 dark:border-stone-400/40",
  delivered: "border-emerald-800/30 text-emerald-900 dark:text-emerald-300 dark:border-emerald-700/50",
};

export function orderItemsSubtotal(items: OrderItem[] | undefined): number {
  if (!items) return 0;
  return items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0,
  );
}

/** Per-ISO-code totals — never sum across currencies. */
export function revenueByCurrency(orders: Order[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const order of orders) {
    const code = order.currency || "USD";
    totals[code] = (totals[code] ?? 0) + (order.total ?? 0);
  }
  return totals;
}
