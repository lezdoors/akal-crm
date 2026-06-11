import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { useRecordContext } from "ra-core";

import type { Order } from "../types";
import { ORDER_STATUS_CHOICES } from "./orderUtils";

const OrderEditTitle = () => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  return (
    <h2 className="text-lg font-semibold mb-2">
      Fulfillment — {record.order_number}
    </h2>
  );
};

/**
 * Fulfillment-only edit: status, tracking, internal notes.
 * Order contents/amounts are immutable — they were written by the
 * storefront webhook (or manual entry) and must not drift.
 */
export function OrderEdit() {
  return (
    <Edit redirect="show" mutationMode="pessimistic">
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
            label="Tracking number"
            helperText="Setting this sends the shipping email to the customer (once)."
          />
          <TextInput
            source="notes"
            label="Internal notes"
            multiline
            helperText={false}
          />
        </div>
      </SimpleForm>
    </Edit>
  );
}

export default OrderEdit;
