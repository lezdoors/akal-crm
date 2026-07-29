import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatMoney } from "../orders/orderUtils";
import { OrderChannelWord, OrderStatusWord } from "../orders/OrderBadges";
import { useDashboardOrders } from "./commerceData";
import { useOrderProductImages } from "../orders/useOrderProductImages";

export const RecentOrders = () => {
  const translate = useTranslate();
  const { data: orders } = useDashboardOrders();

  const recent = (orders ?? []).slice(0, 8);
  const imageFor = useOrderProductImages(recent);
  const money = useFormatMoney();

  if (!recent.length) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {translate("resources.orders.dashboard.recent_title")}
        </CardTitle>
        <Link
          to="/orders"
          className="overline no-underline hover:text-foreground"
        >
          {translate("resources.orders.dashboard.all_orders")}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {recent.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}/show`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-tile)] py-2.5 font-mono text-[13px] no-underline transition-colors hover:bg-panel-raised px-3 sm:grid-cols-[auto_auto_1fr_auto_auto_auto] sm:gap-4"
            >
              {imageFor(
                order.items?.[0] ?? {
                  product_id: "",
                  title: "",
                  price: 0,
                  quantity: 0,
                },
              ) ? (
                <img
                  src={imageFor(order.items[0])}
                  alt=""
                  className="plate h-11 w-11 shrink-0"
                />
              ) : (
                <div className="plate h-11 w-11 shrink-0" />
              )}
              {/* Phone: order number and channel fold away, status sits under
                  the amount. Six rigid columns pushed the row past 375px. */}
              <span className="hidden font-mono text-xs sm:inline">
                {order.order_number}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-muted-foreground">
                  {order.customer_name || "—"}
                </span>
                <span className="mt-0.5 block truncate font-mono text-xs text-muted-foreground sm:hidden">
                  {order.order_number}
                </span>
              </span>
              <span className="hidden sm:block">
                <OrderChannelWord channel={order.sales_channel ?? ""} />
              </span>
              <span className="hidden sm:block">
                <OrderStatusWord status={order.status} />
              </span>
              <span className="flex flex-col items-end gap-1 tabular-nums sm:block sm:w-24 sm:text-right">
                {money(order.total, order.currency)}
                <span className="sm:hidden">
                  <OrderStatusWord status={order.status} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
