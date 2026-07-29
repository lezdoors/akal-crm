import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatDate, useFormatMoney } from "../orders/orderUtils";
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
  const money = useFormatMoney();
  const formatDate = useFormatDate();

  if (isPending || !orders.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="pill bg-rust">
            {translate("resources.orders.dashboard.to_ship", {
              smart_count: orders.length,
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-[var(--radius-tile)] px-3 py-3 font-mono text-[13px] no-underline transition-colors hover:bg-panel-raised"
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
              {/* Five side-by-side columns overflowed a 375px viewport by
                  42px. On a phone the order number folds under the customer
                  name and the date drops; from `sm` up the row spreads back
                  out into columns. */}
              <span className="hidden font-mono text-xs sm:inline">
                {order.order_number}
              </span>
              <span className="min-w-0 flex-1 sm:mx-3">
                <span className="block truncate text-muted-foreground">
                  {order.customer_name}
                </span>
                <span className="mt-0.5 block font-mono text-xs text-muted-foreground sm:hidden">
                  {order.order_number}
                </span>
              </span>
              <span className="hidden text-xs text-muted-foreground sm:mr-3 sm:inline">
                {formatDate(order.created_at)}
              </span>
              <span className="ml-3 shrink-0 text-right tabular-nums">
                {money(order.total, order.currency)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
