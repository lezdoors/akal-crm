import { useRecordContext } from "ra-core";
import { Badge } from "@/components/ui/badge";

import type { Order } from "../types";
import { ORDER_STATUS_BADGE_CLASSES } from "./orderUtils";

export const OrderStatusBadge = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Order>();
  if (!record?.status) return null;
  return (
    <Badge variant="outline" className={ORDER_STATUS_BADGE_CLASSES[record.status]}>
      {record.status}
    </Badge>
  );
};

export const OrderChannelBadge = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Order>();
  if (!record?.sales_channel) return null;
  return <Badge variant="secondary">{record.sales_channel}</Badge>;
};
