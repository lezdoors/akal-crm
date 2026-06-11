import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { PackageOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatMoney } from "../orders/orderUtils";
import { needsShipping, useDashboardOrders } from "./commerceData";

/**
 * The action queue: paid orders with no tracking number yet.
 * Each row links straight to the fulfillment form.
 */
export const OrdersToShip = () => {
  const translate = useTranslate();
  const { data: allOrders, isPending } = useDashboardOrders();
  const orders = (allOrders ?? []).filter(needsShipping).reverse();

  if (isPending || !orders.length) return null;

  return (
    <Card className="border-t-2 border-t-tobacco">
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
