import { useRecordContext, useTranslate } from "ra-core";
import { Show } from "@/components/admin/show";
import { DateField } from "@/components/admin/date-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Order } from "../types";
import { OrderChannelBadge, OrderStatusBadge } from "./OrderBadges";
import { OrderItemsTable } from "./OrderItemsTable";

const AddressBlock = () => {
  const record = useRecordContext<Order>();
  const translate = useTranslate();
  const address = record?.shipping_address;
  if (!address || Object.values(address).every((value) => !value)) {
    return (
      <p className="text-sm text-muted-foreground">
        {translate("resources.orders.show.no_address")}
      </p>
    );
  }
  return (
    <div className="text-sm leading-6">
      {address.line1 && <div>{address.line1}</div>}
      {address.line2 && <div>{address.line2}</div>}
      <div>
        {[address.city, address.state, address.postal_code]
          .filter(Boolean)
          .join(", ")}
      </div>
      {address.country && <div>{address.country}</div>}
    </div>
  );
};

const ProcessorIds = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  const ids = [
    { label: "Revolut", value: record.revolut_order_id },
    { label: "Etsy", value: record.etsy_order_id },
    { label: "Stripe", value: record.stripe_session_id },
  ].filter((entry) => entry.value);
  if (!ids.length) return null;
  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      {ids.map((entry) => (
        <span key={entry.label} className="font-mono">
          {entry.label}: {entry.value}
        </span>
      ))}
    </div>
  );
};

const OrderShowContent = () => {
  const record = useRecordContext<Order>();
  const translate = useTranslate();
  if (!record) return null;
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl font-medium">{record.order_number}</h2>
        <OrderStatusBadge />
        <OrderChannelBadge />
        <span className="text-sm text-muted-foreground ml-auto">
          <DateField source="created_at" showTime />
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{translate("resources.orders.show.customer")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-6">
              <div>{record.customer_name}</div>
              <a
                className="text-muted-foreground underline"
                href={`mailto:${record.customer_email}`}
              >
                {record.customer_email}
              </a>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{translate("resources.orders.show.shipping")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <AddressBlock />
            <div className="text-sm">
              <span className="text-muted-foreground">{translate("resources.orders.show.tracking")}: </span>
              {record.tracking_number || "—"}
            </div>
            {record.shipping_email_sent_at && (
              <div className="text-xs text-muted-foreground">
                {translate("resources.orders.show.email_sent_at")}{" "}
                <DateField source="shipping_email_sent_at" showTime />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{translate("resources.orders.show.items")}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderItemsTable />
        </CardContent>
      </Card>

      {record.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{translate("resources.orders.show.notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
          </CardContent>
        </Card>
      )}

      <ProcessorIds />
    </div>
  );
};

export function OrderShow() {
  return (
    <Show>
      <OrderShowContent />
    </Show>
  );
}

export default OrderShow;
