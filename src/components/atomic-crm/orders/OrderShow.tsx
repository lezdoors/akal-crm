import { useState } from "react";
import { useRecordContext, useTranslate } from "ra-core";
import { Check, Copy } from "lucide-react";
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

/** Customer email with a one-click mailto + copy-to-clipboard, for fast reach-out. */
const CustomerEmail = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <a
        className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
        href={`mailto:${email}`}
      >
        {email}
      </a>
      <button
        type="button"
        aria-label="Copy email"
        className="text-muted-foreground hover:text-foreground"
        onClick={async () => {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? (
          <Check className="size-3.5 text-moss" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
};

/**
 * The storefront stores the canonical processor id in `revolut_order_id`
 * (the column predates the Revolut→Stripe migration and is now the generic
 * idempotency key). Stripe ids carry a typed prefix — label by shape so both
 * historic Revolut orders and new Stripe orders read correctly.
 */
function processorLabel(id: string): string {
  return /^(cs_|pi_|ch_|in_|seti_|py_)/.test(id) ? "Stripe" : "Revolut";
}

const ProcessorIds = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  const ids = [
    record.revolut_order_id && {
      label: processorLabel(record.revolut_order_id),
      value: record.revolut_order_id,
    },
    record.stripe_session_id && {
      label: "Stripe",
      value: record.stripe_session_id,
    },
    record.etsy_order_id && { label: "Etsy", value: record.etsy_order_id },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry));
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
    <div className="flex flex-col gap-8 mt-4">
      <div className="flex items-baseline gap-4 flex-wrap">
        <h2 className="display text-[26px] leading-none">
          {record.order_number}
        </h2>
        <OrderStatusBadge />
        <OrderChannelBadge />
        <span className="text-xs text-muted-foreground ml-auto">
          <DateField source="created_at" showTime />
        </span>
      </div>

      {/* Work order left, client & shipping context right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{translate("resources.orders.show.items")}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderItemsTable />
            </CardContent>
          </Card>

          {record.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{translate("resources.orders.show.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                  {record.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {translate("resources.orders.show.customer")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[13px] leading-6">
                <div>{record.customer_name}</div>
                {record.customer_email && (
                  <CustomerEmail email={record.customer_email} />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {translate("resources.orders.show.shipping")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <AddressBlock />
              <div className="text-[13px]">
                <span className="text-muted-foreground">
                  {translate("resources.orders.show.tracking")}:{" "}
                </span>
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
          <ProcessorIds />
        </div>
      </div>
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
