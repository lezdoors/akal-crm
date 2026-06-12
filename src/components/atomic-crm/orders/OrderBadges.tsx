import { useRecordContext, useTranslate } from "ra-core";

import type { Order, OrderStatus } from "../types";
import { ORDER_STATUS_DOT_CLASSES } from "./orderUtils";

/**
 * The register's status voice: a 6px dot and an overline word.
 * `● PAYÉE` — reads at a glance, never shouts.
 */
export const OrderStatusWord = ({ status }: { status: OrderStatus }) => {
  const translate = useTranslate();
  return (
    <span className="overline flex items-center gap-1.5 whitespace-nowrap">
      <span
        className={`inline-block size-1.5 rounded-full ${ORDER_STATUS_DOT_CLASSES[status] ?? "bg-ink-muted"}`}
      />
      {translate(`resources.orders.status.${status}`, { _: status })}
    </span>
  );
};

export const OrderStatusBadge = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Order>();
  if (!record?.status) return null;
  return <OrderStatusWord status={record.status} />;
};

/** Channel as a quiet overline word — SITE, ETSY. */
export const OrderChannelWord = ({ channel }: { channel: string }) => {
  const translate = useTranslate();
  return (
    <span className="overline whitespace-nowrap">
      {translate(`resources.orders.channel.${channel}`, { _: channel })}
    </span>
  );
};

export const OrderChannelBadge = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Order>();
  if (!record?.sales_channel) return null;
  return <OrderChannelWord channel={record.sales_channel} />;
};
