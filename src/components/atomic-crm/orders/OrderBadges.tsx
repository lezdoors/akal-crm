import { useRecordContext, useTranslate } from "ra-core";

import type { Order, OrderStatus } from "../types";
import { ORDER_STATUS_PILL_CLASSES } from "./orderUtils";

/**
 * BLOC's status voice: a filled pill in the accent that carries the meaning.
 * All five accents are light enough to take the dark ink, never white.
 */
export const OrderStatusWord = ({ status }: { status: OrderStatus }) => {
  const translate = useTranslate();
  return (
    <span
      className={`pill ${ORDER_STATUS_PILL_CLASSES[status] ?? "bg-[#cfcfcf]"}`}
    >
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
