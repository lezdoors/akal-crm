import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { PackageOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Order } from "../types";
import { formatMoney } from "../orders/orderUtils";

/**
 * The action queue: paid orders with no tracking number yet.
 * Each row links straight to the fulfillment form.
 */
export const OrdersToShip = () => {
  const translate = useTranslate();
  const { data: orders, isPending } = useGetList<Order>("orders", {
    pagination: { page: 1, perPage: 50 },
    sort: { field: "created_at", order: "ASC" },
    filter: { status: "paid", "tracking_number@is": "null" },
  });

  if (isPending || !orders?.length) return null;

  return (
    <Card className="border-amber-300/60 dark:border-amber-700/60">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <PackageOpen className="h-4 w-4" />
          {translate("resources.orders.dashboard.to_ship", {
            smart_count: orders.length,
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col divide-y">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between py-2 text-sm no-underline hover:bg-muted/50 px-1 rounded"
            >
              <span className="font-mono">{order.order_number}</span>
              <span className="text-muted-foreground truncate mx-2 flex-1">
                {order.customer_name}
              </span>
              <span className="text-xs text-muted-foreground mr-3">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
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
