import { useListContext, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { CreateButton } from "@/components/admin/create-button";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import { TopToolbar } from "../layout/TopToolbar";
import type { Order } from "../types";
import {
  formatMoney,
  ORDER_CHANNEL_CHOICES,
  ORDER_STATUS_BADGE_CLASSES,
  ORDER_STATUS_CHOICES,
} from "./orderUtils";
import { useOrderProducts } from "./useOrderProductImages";

const OrderListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.orders.action.new" />
  </TopToolbar>
);

const filters = [
  <TextInput
    key="email"
    source="customer_email@ilike"
    label="resources.orders.fields.customer_email"
    alwaysOn
  />,
  <SelectInput
    key="status"
    source="status"
    choices={ORDER_STATUS_CHOICES}
    alwaysOn
  />,
  <SelectInput
    key="channel"
    source="sales_channel"
    label="resources.orders.fields.sales_channel"
    choices={ORDER_CHANNEL_CHOICES}
  />,
];

/**
 * Linear-style order rows: photo-first, one calm line per order, no table
 * chrome. Leather + colour resolved from the products catalogue.
 */
const OrderRows = () => {
  const { data: orders, isPending } = useListContext<Order>();
  const translate = useTranslate();
  const productFor = useOrderProducts(orders);

  if (isPending || !orders) return null;

  return (
    <div className="flex flex-col -mx-2">
      {orders.map((order) => {
        const first = order.items?.[0];
        const product = first ? productFor(first) : undefined;
        const image = first ? (first.image ?? product?.images?.[0]) : undefined;
        const extraCount = (order.items?.length ?? 0) - 1;
        const detailParts = [
          product?.materials?.[0],
          product?.variant_attribute?.value,
        ].filter(Boolean);
        return (
          <Link
            key={String(order.id)}
            to={`/orders/${order.id}/show`}
            className="group grid grid-cols-[auto_minmax(0,2.2fr)_minmax(0,1.6fr)_auto_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-md px-2 py-2.5 no-underline hover:bg-muted/70"
          >
            {image ? (
              <img
                src={image}
                alt=""
                className="h-14 w-14 rounded-md border object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-md border bg-muted" />
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {first?.title || order.order_number}
                {extraCount > 0 && (
                  <span className="text-muted-foreground font-normal">
                    {"  +"}
                    {extraCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {detailParts.length
                  ? detailParts.join(" · ")
                  : order.order_number}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-sm truncate">
                {order.customer_name || "—"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {order.customer_email}
              </div>
            </div>
            <Badge
              variant="outline"
              className={ORDER_STATUS_BADGE_CLASSES[order.status]}
            >
              {translate(`resources.orders.status.${order.status}`, {
                _: order.status,
              })}
            </Badge>
            <div className="text-xs text-muted-foreground font-mono truncate">
              {order.tracking_number || "—"}
            </div>
            <div className="text-sm tabular-nums text-right w-20">
              {formatMoney(order.total, order.currency)}
            </div>
            <div className="text-xs text-muted-foreground w-16 text-right">
              {new Date(order.created_at).toLocaleDateString()}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export function OrderList() {
  return (
    <List
      filters={filters}
      actions={<OrderListActions />}
      sort={{ field: "created_at", order: "DESC" }}
      perPage={25}
    >
      <OrderRows />
    </List>
  );
}

export default OrderList;
