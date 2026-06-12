import { useListContext, useTranslate } from "ra-core";
import { Link } from "react-router";
import { CreateButton } from "@/components/admin/create-button";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import { TopToolbar } from "../layout/TopToolbar";
import type { Order } from "../types";
import { OrderStatusWord } from "./OrderBadges";
import {
  formatMoney,
  ORDER_CHANNEL_CHOICES,
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
 * The register's order rows: the row IS the work order. Photo plate first,
 * hairline separators, one calm line per order.
 */
const OrderRows = () => {
  const { data: orders, isPending } = useListContext<Order>();
  const productFor = useOrderProducts(orders);

  if (isPending || !orders) return null;

  return (
    <div className="flex flex-col divide-y divide-hairline border-t">
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
            className="group grid grid-cols-[auto_minmax(0,2.2fr)_minmax(0,1.6fr)_auto_minmax(0,1fr)_auto_auto] items-center gap-5 px-1 py-3 no-underline transition-colors hover:bg-secondary/40"
          >
            {image ? (
              <img src={image} alt="" className="plate h-16 w-16" />
            ) : (
              <div className="plate h-16 w-16" />
            )}
            <div className="min-w-0">
              <div className="text-[13px] font-medium truncate">
                {first?.title || order.order_number}
                {extraCount > 0 && (
                  <span className="text-muted-foreground font-normal">
                    {"  +"}
                    {extraCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {detailParts.length
                  ? detailParts.join(" · ")
                  : order.order_number}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] truncate">
                {order.customer_name || "—"}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {order.customer_email}
              </div>
            </div>
            <OrderStatusWord status={order.status} />
            <div className="text-xs text-muted-foreground font-mono truncate">
              {order.tracking_number || "—"}
            </div>
            <div className="text-[13px] tabular-nums text-right w-20">
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

const OrdersEmpty = () => {
  const translate = useTranslate();
  return (
    <div className="border-t pt-4 mt-2">
      <p className="overline">
        {translate("crm.dashboard.empty_title", {
          _: "Awaiting the first order",
        })}
      </p>
      <p className="display mt-3 max-w-md text-[19px] leading-snug text-ink-soft">
        {translate("crm.dashboard.empty_body", { _: "" })}
      </p>
      <Link
        to="/orders/create"
        className="mt-4 inline-block text-[13px] no-underline text-tobacco transition-opacity hover:opacity-80"
      >
        {translate("crm.dashboard.empty_action", {
          _: "Enter an order manually",
        })}
        {" →"}
      </Link>
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
      empty={<OrdersEmpty />}
    >
      <OrderRows />
    </List>
  );
}

export default OrderList;
