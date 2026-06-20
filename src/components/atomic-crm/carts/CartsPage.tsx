import { useDataProvider, useTranslate } from "ra-core";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import type { AbandonedCart, OrderItem } from "../types";
import type { CrmDataProvider } from "../providers/types";
import { formatMoney } from "../orders/orderUtils";

/** Compact age — "just now", "5h", "2d". Carts are a same-week concern. */
function formatAge(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function cartTitle(items: OrderItem[] | undefined): string {
  if (!items?.length) return "—";
  const [first, ...rest] = items;
  const base = first.title || first.slug || "Item";
  return rest.length ? `${base} +${rest.length}` : base;
}

/** The cart's lifecycle state, said as a dot + word — never a pill. */
function cartStatus(cart: AbandonedCart): { dot: string; label: string } {
  if (cart.status === "converted") return { dot: "bg-moss", label: "Recovered" };
  if (cart.unsubscribed) return { dot: "bg-ink-muted", label: "Opted out" };
  if (cart.second_email_sent_at) return { dot: "bg-tobacco", label: "Chased ×2" };
  if (cart.first_email_sent_at) return { dot: "bg-tobacco", label: "Chased ×1" };
  return { dot: "bg-moss", label: "New" };
}

const Row = ({ cart }: { cart: AbandonedCart }) => {
  const status = cartStatus(cart);
  const image = cart.items?.[0]?.image;
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-4 px-1 py-2.5">
      {image ? (
        <img src={image} alt="" loading="lazy" className="plate h-10 w-10" />
      ) : (
        <div className="plate h-10 w-10" />
      )}
      <div className="min-w-0">
        <div className="text-[13px] truncate">{cartTitle(cart.items)}</div>
        <div className="text-xs text-muted-foreground truncate mt-0.5">
          {cart.customer_name ? `${cart.customer_name} · ` : ""}
          {cart.email}
        </div>
      </div>
      <span className="hidden sm:block text-xs text-muted-foreground tabular-nums w-12 text-right">
        {formatAge(cart.created_at)}
      </span>
      <span className="text-[13px] tabular-nums w-20 text-right">
        {formatMoney(cart.amount_minor, cart.currency)}
      </span>
      <span className="overline flex items-center justify-end gap-1.5 whitespace-nowrap w-24">
        <span className={`inline-block size-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </div>
  );
};

const Section = ({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1 border-t pt-4">
    <div className="flex items-baseline gap-2">
      <h2 className="overline">{title}</h2>
      <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
    </div>
    <div className="flex flex-col divide-y divide-hairline">{children}</div>
  </div>
);

/** Per-ISO-code potential value — never sum across currencies. */
function valueByCurrency(carts: AbandonedCart[]): string {
  const totals: Record<string, number> = {};
  for (const cart of carts) {
    const code = cart.currency || "USD";
    totals[code] = (totals[code] ?? 0) + (cart.amount_minor ?? 0);
  }
  return (
    Object.entries(totals)
      .map(([code, minor]) => formatMoney(minor, code))
      .join(" · ") || "—"
  );
}

/**
 * Carts in progress — a read-only window onto the storefront's
 * `abandoned_checkouts` table. Shoppers who entered an email and started
 * checkout but haven't paid; the storefront chases them with recovery emails
 * (5h / 24h) and flips the row to "converted" the moment they pay. This page
 * is observation only — the CRM never writes here.
 */
export const CartsPage = () => {
  const translate = useTranslate();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["abandoned-carts"],
    queryFn: () => dataProvider.getAbandonedCarts(),
    refetchOnWindowFocus: true,
  });

  const inProgress = data?.inProgress ?? [];
  const recovered = data?.recovered ?? [];

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-3xl">
      <div>
        <p className="overline">{translate("crm.nav.carts", { _: "Carts" })}</p>
        <h1 className="display mt-1 text-[28px] leading-none">
          {translate("crm.carts.title", { _: "Carts in progress" })}
        </h1>
        <p className="text-xs text-muted-foreground mt-3">
          {translate("crm.carts.note", {
            _: "Shoppers who started checkout but haven't paid. The storefront emails them automatically — this is a read-only view.",
          })}
        </p>
      </div>

      {isLoading && (
        <p className="text-xs text-muted-foreground border-t pt-4">
          {translate("ra.page.loading", { _: "Loading" })}…
        </p>
      )}

      {isError && (
        <p className="text-xs text-muted-foreground border-t pt-4">
          {translate("crm.carts.error", {
            _: "Couldn't load carts. The recovery service may not be deployed yet.",
          })}
        </p>
      )}

      {data && (
        <>
          <Section
            title={translate("crm.carts.in_progress", { _: "In progress" })}
            count={inProgress.length}
          >
            {inProgress.length ? (
              <>
                {inProgress.map((cart) => (
                  <Row key={cart.id} cart={cart} />
                ))}
                <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
                  <span>
                    {translate("crm.carts.in_play", { _: "In play" })}
                  </span>
                  <span className="tabular-nums">
                    {valueByCurrency(inProgress)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground py-2">
                {translate("crm.carts.empty_in_progress", {
                  _: "No carts in progress.",
                })}
              </p>
            )}
          </Section>

          <Section
            title={translate("crm.carts.recovered", {
              _: "Recovered by email",
            })}
            count={recovered.length}
          >
            {recovered.length ? (
              recovered.map((cart) => <Row key={cart.id} cart={cart} />)
            ) : (
              <p className="text-xs text-muted-foreground py-2">
                {translate("crm.carts.empty_recovered", {
                  _: "No recovery-attributed sales yet.",
                })}
              </p>
            )}
          </Section>
        </>
      )}
    </div>
  );
};
