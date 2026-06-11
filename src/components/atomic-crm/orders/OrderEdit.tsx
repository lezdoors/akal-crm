import {
  useDataProvider,
  useNotify,
  useRecordContext,
  useRedirect,
  useTranslate,
} from "ra-core";
import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import type { CrmDataProvider } from "../providers/types";
import type { Order } from "../types";
import { ORDER_STATUS_CHOICES } from "./orderUtils";

const OrderEditTitle = () => {
  const record = useRecordContext<Order>();
  const translate = useTranslate();
  if (!record) return null;
  return (
    <h2 className="font-serif text-2xl font-medium mb-3">
      {translate("resources.orders.edit.title", {
        order_number: record.order_number,
      })}
    </h2>
  );
};

/**
 * Fulfillment-only edit: status, tracking, internal notes.
 * Order contents/amounts are immutable — they were written by the
 * storefront webhook (or manual entry) and must not drift.
 *
 * Shipping email: after every save where a tracking number is present, the
 * shipping-email edge function is invoked. The function's database claim
 * makes this exactly-once; entering a NEW tracking number re-arms the claim
 * (shipping_email_sent_at reset below) so corrected numbers re-send.
 */
export function OrderEdit() {
  const dataProvider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();

  const transform = (data: Order, options?: { previousData?: Order }) => {
    const previous = options?.previousData?.tracking_number ?? "";
    const next = data.tracking_number ?? "";
    if (next && next !== previous) {
      return { ...data, shipping_email_sent_at: null };
    }
    return data;
  };

  const onSuccess = async (data: unknown) => {
    const updated = data as Order;
    notify("ra.notification.updated", {
      messageArgs: { smart_count: 1 },
      undoable: false,
    });
    if (updated.tracking_number) {
      try {
        const result = await dataProvider.sendShippingEmail(updated.id);
        if (result.sent) {
          notify(translate("resources.orders.edit.email_sent"), {
            type: "success",
          });
        } else {
          notify(translate("resources.orders.edit.email_already_sent"), {
            type: "info",
          });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unexpected error";
        notify(
          translate("resources.orders.edit.email_failed", { message }),
          { type: "error" },
        );
      }
    }
    redirect("show", "orders", updated.id);
  };

  return (
    <Edit
      mutationMode="pessimistic"
      transform={transform as any}
      mutationOptions={{ onSuccess }}
    >
      <SimpleForm>
        <OrderEditTitle />
        <div className="space-y-4 w-full max-w-md">
          <SelectInput
            source="status"
            choices={ORDER_STATUS_CHOICES}
            helperText={false}
          />
          <TextInput
            source="tracking_number"
            label="resources.orders.fields.tracking_number"
            helperText={translate("resources.orders.edit.tracking_helper")}
          />
          <TextInput
            source="notes"
            label="resources.orders.fields.notes"
            multiline
            helperText={false}
          />
        </div>
      </SimpleForm>
    </Edit>
  );
}

export default OrderEdit;
