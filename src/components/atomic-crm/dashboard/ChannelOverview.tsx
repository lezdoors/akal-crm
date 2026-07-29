import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

import type { Order } from "../types";
import { revenueByCurrency, useFormatMoney } from "../orders/orderUtils";
import { needsShipping, ordersInMonth, useDashboardOrders } from "./commerceData";

const CHANNELS = ["direct", "etsy", "facebook"] as const;

/** Static class names — Tailwind cannot see an interpolated column count. */
const COLUMNS_AT_SM: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

const channelOf = (order: Order): string => order.sales_channel || "direct";

/**
 * Never sum across currencies — but never set three currencies as one serif
 * line either: at 34px that wrapped to two lines on a laptop and three on a
 * phone. The largest holding carries the figure; the rest follow quietly
 * beneath it, so every column is exactly one line tall.
 */
const useRevenueLines = () => {
  const money = useFormatMoney();
  return (orders: Order[]): { lead: string; rest: string | null } => {
    if (!orders.length) return { lead: "—", rest: null };
    const totals = Object.entries(revenueByCurrency(orders)).sort(
      (a, b) => b[1] - a[1],
    );
    const [leadCode, leadTotal] = totals[0];
    return {
      lead: money(leadTotal, leadCode),
      rest: totals.length > 1
        ? totals
            .slice(1)
            .map(([code, total]) => money(total, code))
            .join(" · ")
        : null,
    };
  };
};

const ChannelColumn = ({
  label,
  monthOrders,
  allOrders,
  toShip,
  filter,
}: {
  label: string;
  monthOrders: Order[];
  allOrders: Order[];
  toShip: number;
  filter?: string;
}) => {
  const translate = useTranslate();
  const revenueLines = useRevenueLines();
  const { lead, rest } = revenueLines(monthOrders);
  const body = (
    <>
      <span className="overline !text-ink-muted-inverse">{label}</span>
      <span className="display text-[28px] sm:text-[34px] leading-none tabular-nums mt-2 text-ink-inverse whitespace-nowrap">
        {lead}
      </span>
      {rest && (
        <span className="font-mono text-[11px] text-ink-muted-inverse mt-1.5 tabular-nums">
          {rest}
        </span>
      )}
      {/* Each clause holds together; the line breaks between them, never
          inside "8 all-time". */}
      <span className="font-mono text-[11px] text-ink-muted-inverse mt-1.5 tabular-nums">
        <span className="whitespace-nowrap">
          {translate("resources.orders.dashboard.orders_count", {
            smart_count: monthOrders.length,
            _: "%{smart_count} order this month |||| %{smart_count} orders this month",
          })}
        </span>
        {" · "}
        <span className="whitespace-nowrap">
          {translate("resources.orders.dashboard.all_time", {
            smart_count: allOrders.length,
          })}
        </span>
      </span>
      {toShip > 0 && (
        <span className="pill bg-coral mt-3">
          {translate("resources.orders.dashboard.to_ship", {
            smart_count: toShip,
          })}
        </span>
      )}
    </>
  );
  if (!filter) {
    return <div className="flex flex-col items-start">{body}</div>;
  }
  return (
    <Link
      to={{
        pathname: "/orders",
        search: `filter=${encodeURIComponent(JSON.stringify({ sales_channel: filter }))}`,
      }}
      className="flex flex-col items-start no-underline transition-opacity hover:opacity-75"
    >
      {body}
    </Link>
  );
};

/**
 * The overview: what is going on, per channel — site, Etsy, Facebook.
 * One serif figure per channel (orders this month), revenue beneath it,
 * the to-ship count in tobacco when something must leave the atelier.
 * Each column opens the orders register filtered to that channel.
 */
export const ChannelOverview = ({ today }: { today?: string }) => {
  const translate = useTranslate();
  const { data: orders, isPending } = useDashboardOrders();

  if (isPending) return null;
  const all = orders ?? [];
  const month = ordersInMonth(all);

  // A channel that has never taken an order is not news — it held a quarter
  // of the phone screen to say "—". It returns by itself on its first order.
  // `direct` always shows: it is the house's own counter.
  const columns = CHANNELS.map((channel) => ({
    channel,
    label: translate(`resources.orders.channel.${channel}`, { _: channel }),
    monthOrders: month.filter((order) => channelOf(order) === channel),
    allOrders: all.filter((order) => channelOf(order) === channel),
    toShip: all.filter(
      (order) => channelOf(order) === channel && needsShipping(order),
    ).length,
  })).filter(
    (column) => column.channel === "direct" || column.allOrders.length > 0,
  );

  // With a single channel the Total column would repeat it figure for figure.
  const showTotal = columns.length > 1;

  // With one channel and no revenue yet this month the figures fill a fraction
  // of a full-width slab, so the block sizes itself to its content: it shares
  // the row with the ship queue when there is little to say, and takes the
  // whole width only when there are several channels to line up.
  const wide = columns.length + (showTotal ? 1 : 0) >= 3;

  return (
    <div
      className={cn(
        "panel-strong p-7",
        wide ? "" : "xl:max-w-[720px]",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="overline !text-ink-muted-inverse">
          {translate("crm.dashboard.overview", { _: "Overview" })}
          {" — "}
          {translate("resources.orders.dashboard.this_month", {
            _: "This month",
          })}
        </p>
        {today && (
          <p className="display text-[15px] capitalize text-ink-muted-inverse">
            {today}
          </p>
        )}
      </div>
      <div className={cn("mt-5 grid grid-cols-1 gap-x-10 gap-y-8", COLUMNS_AT_SM[columns.length + (showTotal ? 1 : 0)])}>
        {columns.map((column) => (
          <ChannelColumn
            key={column.channel}
            label={column.label}
            monthOrders={column.monthOrders}
            allOrders={column.allOrders}
            toShip={column.toShip}
            filter={column.channel}
          />
        ))}
        {/* Total: a quiet grid cell on a phone, set off on wider screens by
            the gap alone — separation is space, never a rule. It carries no
            to-ship line: the ship queue is the very next thing on the page,
            and saying the same number twice in 200px reads as two different
            facts. */}
        {showTotal && (
          <div className="sm:pl-8">
            <ChannelColumn
              label={translate("crm.dashboard.total", { _: "Total" })}
              monthOrders={month}
              allOrders={all}
              toShip={0}
            />
          </div>
        )}
      </div>
    </div>
  );
};
