import { useCallback } from "react";
import { useLocaleState } from "ra-core";

import type { Order, OrderItem, OrderStatus } from "../types";

/**
 * Amounts are formatted in the INTERFACE locale, never in a locale derived
 * from the currency. A column of orders reads `680,00 €` / `540,00 £` /
 * `495,00 $` in French and `€680.00` / `£540.00` / `$495.00` in English —
 * one set of separators per screen. Formatting each currency in its own
 * home locale (the previous behaviour) mixed `680,00 €` with `$495.00` in
 * the same column and made the register look broken.
 */
export function formatMoney(
  minorUnits: number | null | undefined,
  currency?: string | null,
  locale = "en",
): string {
  // A missing amount must not masquerade as $0.00.
  if (minorUnits == null) return "—";
  const code = currency || "USD";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    // French disambiguates foreign currencies as "£GB" / "$US" under the
    // default `symbol`. The register wants the mark alone.
    currencyDisplay: "narrowSymbol",
  }).format(minorUnits / 100);
}

/** `formatMoney` bound to the interface locale. Prefer this in components. */
export function useFormatMoney() {
  const [locale = "en"] = useLocaleState();
  return useCallback(
    (minorUnits: number | null | undefined, currency?: string | null) =>
      formatMoney(minorUnits, currency, locale),
    [locale],
  );
}

/** Short numeric date in the interface locale — never the browser's. */
export function useFormatDate() {
  const [locale = "en"] = useLocaleState();
  return useCallback(
    (value: string | null | undefined) => {
      if (!value) return "—";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    },
    [locale],
  );
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
  { id: "facebook", name: "resources.orders.channel.facebook" },
];

export const ORDER_CURRENCY_CHOICES = [
  { id: "USD", name: "USD" },
  { id: "EUR", name: "EUR" },
  { id: "GBP", name: "GBP" },
];

/**
 * BLOC: status is a filled pill, not a dot. Each accent carries one meaning —
 * yellow waits, blue is in hand, ink is in transit, green is settled.
 */
export const ORDER_STATUS_PILL_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow",
  paid: "bg-blue",
  shipped: "bg-[#cfcfcf] dark:bg-[#3a3a3a] dark:text-ink",
  delivered: "bg-green",
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
