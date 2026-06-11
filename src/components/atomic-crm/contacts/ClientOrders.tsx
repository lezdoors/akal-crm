import { useGetList, useRecordContext, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

import {
  formatMoney,
  ORDER_STATUS_BADGE_CLASSES,
  revenueByCurrency,
} from "../orders/orderUtils";
import type { Contact, Order } from "../types";

const contactEmail = (contact: Contact): string | undefined =>
  (contact.email_jsonb as { email?: string }[] | undefined)?.[0]?.email;

/**
 * Luxury client profile module: order history + lifetime value,
 * matched on the contact's primary email (orders carry no contact FK).
 */
export const ClientOrders = () => {
  const contact = useRecordContext<Contact>();
  const translate = useTranslate();
  const email = contact ? contactEmail(contact) : undefined;
  const { data: orders } = useGetList<Order>(
    "orders",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "created_at", order: "DESC" },
      filter: email ? { "customer_email@ilike": email } : {},
    },
    { enabled: !!email },
  );

  if (!email || !orders?.length) return null;

  const lifetime = revenueByCurrency(orders);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium">
          {translate("resources.orders.name", { smart_count: 2 })}
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {translate("crm.clients.lifetime", { _: "Lifetime" })}{" "}
          {Object.entries(lifetime)
            .map(([code, total]) => formatMoney(total, code))
            .join(" · ")}
        </span>
      </div>
      <div className="flex flex-col -mx-1">
        {orders.map((order) => (
          <Link
            key={String(order.id)}
            to={`/orders/${order.id}/show`}
            className="flex items-center gap-2 rounded-md px-1 py-1.5 text-sm no-underline hover:bg-muted/70"
          >
            <span className="font-mono text-xs">{order.order_number}</span>
            <Badge
              variant="outline"
              className={ORDER_STATUS_BADGE_CLASSES[order.status]}
            >
              {translate(`resources.orders.status.${order.status}`, {
                _: order.status,
              })}
            </Badge>
            <span className="text-xs text-muted-foreground flex-1 text-right">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
            <span className="tabular-nums w-20 text-right">
              {formatMoney(order.total, order.currency)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
