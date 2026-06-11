import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Order } from "../types";
import {
  formatMoney,
  ORDER_STATUS_BADGE_CLASSES,
  revenueByCurrency,
} from "../orders/orderUtils";

/**
 * Revenue overview for the storefront `orders` table.
 * Order volume is luxury-low, so totals are computed client-side over the
 * full order list. Revenue is reported per ISO currency, never summed across.
 */
export const OrdersRevenue = () => {
  const translate = useTranslate();
  const { data: orders, isPending } = useGetList<Order>("orders", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "created_at", order: "DESC" },
  });

  if (isPending || !orders) return null;

  const totals = revenueByCurrency(orders);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const ordersThisMonth = orders.filter(
    (order) => new Date(order.created_at) >= monthStart,
  );
  const recent = orders.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          {translate("resources.orders.dashboard.title")}
        </CardTitle>
        <Link to="/orders" className="text-sm text-muted-foreground underline">
          {translate("resources.orders.dashboard.all_orders")}
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">{translate("resources.orders.dashboard.revenue")}</div>
            <div className="text-lg font-semibold tabular-nums">
              {Object.keys(totals).length
                ? Object.entries(totals)
                    .map(([code, total]) => formatMoney(total, code))
                    .join(" · ")
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{translate("resources.orders.dashboard.this_month")}</div>
            <div className="text-lg font-semibold tabular-nums">
              {ordersThisMonth.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{translate("resources.orders.dashboard.total_orders")}</div>
            <div className="text-lg font-semibold tabular-nums">
              {orders.length}
            </div>
          </div>
        </div>

        {recent.length > 0 && (
          <div className="flex flex-col divide-y">
            {recent.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}/show`}
                className="flex items-center justify-between py-2 text-sm no-underline hover:bg-muted/50 px-1 rounded"
              >
                <span className="font-mono">{order.order_number}</span>
                <span className="text-muted-foreground truncate mx-2 flex-1">
                  {order.customer_name}
                </span>
                <Badge
                  variant="outline"
                  className={ORDER_STATUS_BADGE_CLASSES[order.status]}
                >
                  {order.status}
                </Badge>
                <span className="tabular-nums ml-3 w-24 text-right">
                  {formatMoney(order.total, order.currency)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
