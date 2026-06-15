import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatMoney } from "../orders/orderUtils";
import { useOrderProductImages } from "../orders/useOrderProductImages";
import { needsShipping, useDashboardOrders } from "./commerceData";

/**
 * The action queue — what must leave the atelier. Paid orders with no
 * tracking number; each row links straight to the fulfillment form.
 * Larger plates than elsewhere: this is the page's reason to exist.
 */
export const OrdersToShip = () => {
  const translate = useTranslate();
  const { data: allOrders, isPending } = useDashboardOrders();
  const orders = (allOrders ?? []).filter(needsShipping).reverse();
  const imageFor = useOrderProductImages(orders);

  if (isPending || !orders.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="inline-block size-1.5 rounded-full bg-tobacco" />
          {translate("resources.orders.dashboard.to_ship", {
            smart_count: orders.length,
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col divide-y divide-hairline">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between py-3 text-[13px] no-underline transition-colors hover:bg-secondary px-1"
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
                  className="plate h-14 w-14 mr-3 shrink-0"
                />
              ) : (
                <div className="plate h-14 w-14 mr-3 shrink-0" />
              )}
              <span className="font-mono text-xs">{order.order_number}</span>
              <span className="text-muted-foreground truncate mx-3 flex-1">
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
