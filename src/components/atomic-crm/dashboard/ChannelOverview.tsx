import { useTranslate } from "ra-core";
import { Link } from "react-router";

import type { Order } from "../types";
import { formatMoney, revenueByCurrency } from "../orders/orderUtils";
import { needsShipping, ordersInMonth, useDashboardOrders } from "./commerceData";

const CHANNELS = ["direct", "etsy", "facebook"] as const;

const channelOf = (order: Order): string => order.sales_channel || "direct";

const revenueLine = (orders: Order[]): string => {
  if (!orders.length) return "—";
  return Object.entries(revenueByCurrency(orders))
    .map(([code, total]) => formatMoney(total, code))
    .join(" · ");
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
  const body = (
    <>
      <span className="overline">{label}</span>
      <span className="display text-[32px] leading-none tabular-nums mt-2">
        {monthOrders.length}
      </span>
      <span className="text-[13px] tabular-nums mt-1.5 text-ink-soft">
        {revenueLine(monthOrders)}
      </span>
      <span className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
        {translate("resources.orders.dashboard.all_time", {
          smart_count: allOrders.length,
        })}
      </span>
      {toShip > 0 && (
        <span className="overline mt-2 flex items-center gap-1.5 !text-tobacco">
          <span className="inline-block size-1.5 rounded-full bg-tobacco" />
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
export const ChannelOverview = () => {
  const translate = useTranslate();
  const { data: orders, isPending } = useDashboardOrders();

  if (isPending) return null;
  const all = orders ?? [];
  const month = ordersInMonth(all);

  const columns = CHANNELS.map((channel) => ({
    channel,
    label: translate(`resources.orders.channel.${channel}`, { _: channel }),
    monthOrders: month.filter((order) => channelOf(order) === channel),
    allOrders: all.filter((order) => channelOf(order) === channel),
    toShip: all.filter(
      (order) => channelOf(order) === channel && needsShipping(order),
    ).length,
  }));

  return (
    <div className="border-t pt-4">
      <p className="overline">
        {translate("crm.dashboard.overview", { _: "Overview" })}
        {" — "}
        {translate("resources.orders.dashboard.this_month", {
          _: "This month",
        })}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
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
        <div className="border-l border-hairline pl-8 hidden sm:block">
          <ChannelColumn
            label={translate("crm.dashboard.total", { _: "Total" })}
            monthOrders={month}
            allOrders={all}
            toShip={all.filter(needsShipping).length}
          />
        </div>
      </div>
    </div>
  );
};
