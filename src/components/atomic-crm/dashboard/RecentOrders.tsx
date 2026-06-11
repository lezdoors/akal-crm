import { RecordContextProvider, useTranslate } from "ra-core";
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatMoney, ORDER_STATUS_BADGE_CLASSES } from "../orders/orderUtils";
import { OrderChannelBadge } from "../orders/OrderBadges";
import { useDashboardOrders } from "./commerceData";

export const RecentOrders = () => {
  const translate = useTranslate();
  const { data: orders } = useDashboardOrders();

  if (!orders?.length) return null;
  const recent = orders.slice(0, 8);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          {translate("resources.orders.dashboard.recent_title")}
        </CardTitle>
        <Link
          to="/orders"
          className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4"
        >
          {translate("resources.orders.dashboard.all_orders")}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col divide-y">
          {recent.map((order) => (
            <RecordContextProvider key={order.id} value={order}>
              <Link
                to={`/orders/${order.id}/show`}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 py-2.5 text-sm no-underline hover:bg-muted/60 px-1"
              >
                <span className="font-mono text-xs">{order.order_number}</span>
                <span className="text-muted-foreground truncate">
                  {order.customer_name || "—"}
                </span>
                <OrderChannelBadge />
                <Badge
                  variant="outline"
                  className={ORDER_STATUS_BADGE_CLASSES[order.status]}
                >
                  {translate(`resources.orders.status.${order.status}`, {
                    _: order.status,
                  })}
                </Badge>
                <span className="tabular-nums w-24 text-right">
                  {formatMoney(order.total, order.currency)}
                </span>
              </Link>
            </RecordContextProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
