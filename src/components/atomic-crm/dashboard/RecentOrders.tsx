import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatMoney } from "../orders/orderUtils";
import { OrderChannelWord, OrderStatusWord } from "../orders/OrderBadges";
import { useDashboardOrders } from "./commerceData";
import { useOrderProductImages } from "../orders/useOrderProductImages";

export const RecentOrders = () => {
  const translate = useTranslate();
  const { data: orders } = useDashboardOrders();

  const recent = (orders ?? []).slice(0, 8);
  const imageFor = useOrderProductImages(recent);

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
        <div className="flex flex-col divide-y divide-hairline">
          {recent.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}/show`}
              className="grid grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-4 py-2.5 text-[13px] no-underline transition-colors hover:bg-secondary/40 px-1"
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
              <span className="font-mono text-xs">{order.order_number}</span>
              <span className="text-muted-foreground truncate">
                {order.customer_name || "—"}
              </span>
              <OrderChannelWord channel={order.sales_channel ?? ""} />
              <OrderStatusWord status={order.status} />
              <span className="tabular-nums w-24 text-right">
                {formatMoney(order.total, order.currency)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
