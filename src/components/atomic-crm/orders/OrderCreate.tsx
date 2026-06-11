import { required } from "ra-core";
import { ArrayInput } from "@/components/admin/array-input";
import { Create } from "@/components/admin/create";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { SimpleForm } from "@/components/admin/simple-form";
import { SimpleFormIterator } from "@/components/admin/simple-form-iterator";
import { TextInput } from "@/components/admin/text-input";

import type { Order } from "../types";
import {
  generateOrderNumber,
  ORDER_CHANNEL_CHOICES,
  ORDER_CURRENCY_CHOICES,
} from "./orderUtils";

interface OrderDraftItem {
  title: string;
  /** Entered in major units (e.g. dollars); converted to minor units on save. */
  price: number;
  quantity: number;
}

interface OrderDraft {
  customer_name: string;
  customer_email: string;
  sales_channel: string;
  etsy_order_id?: string;
  currency: string;
  draft_items: OrderDraftItem[];
  shipping_address?: Order["shipping_address"];
  notes?: string;
}

/**
 * Manual order entry for sales made off-site (Etsy, in-person).
 * Online orders are inserted by the storefront's Revolut webhook — never here.
 */
const transform = (data: OrderDraft) => {
  const items = (data.draft_items ?? []).map((item) => ({
    product_id: "",
    title: item.title,
    price: Math.round((item.price ?? 0) * 100),
    quantity: item.quantity ?? 1,
  }));
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const { draft_items: _draftItems, ...rest } = data;
  return {
    ...rest,
    order_number: generateOrderNumber(),
    items,
    subtotal,
    shipping_cost: 0,
    total: subtotal,
    status: "paid",
  };
};

export function OrderCreate() {
  return (
    <Create transform={transform as any} redirect="show">
      <SimpleForm
        defaultValues={{
          sales_channel: "etsy",
          currency: "USD",
          draft_items: [{ title: "", price: 0, quantity: 1 }],
        }}
      >
        <h2 className="text-lg font-semibold mb-2">Manual order</h2>
        <div className="space-y-4 w-full max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              source="customer_name"
              validate={required()}
              helperText={false}
            />
            <TextInput
              source="customer_email"
              validate={required()}
              helperText={false}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <SelectInput
              source="sales_channel"
              label="Channel"
              choices={ORDER_CHANNEL_CHOICES}
              validate={required()}
              helperText={false}
            />
            <SelectInput
              source="currency"
              choices={ORDER_CURRENCY_CHOICES}
              validate={required()}
              helperText={false}
            />
            <TextInput
              source="etsy_order_id"
              label="Etsy order id"
              helperText={false}
            />
          </div>

          <ArrayInput source="draft_items" label="Items">
            <SimpleFormIterator inline>
              <TextInput
                source="title"
                validate={required()}
                helperText={false}
              />
              <NumberInput
                source="price"
                label="Unit price"
                step={0.01}
                validate={required()}
                helperText={false}
              />
              <NumberInput source="quantity" step={1} helperText={false} />
            </SimpleFormIterator>
          </ArrayInput>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              source="shipping_address.line1"
              label="Address line 1"
              helperText={false}
            />
            <TextInput
              source="shipping_address.line2"
              label="Address line 2"
              helperText={false}
            />
            <TextInput
              source="shipping_address.city"
              label="City"
              helperText={false}
            />
            <TextInput
              source="shipping_address.state"
              label="State"
              helperText={false}
            />
            <TextInput
              source="shipping_address.postal_code"
              label="Postal code"
              helperText={false}
            />
            <TextInput
              source="shipping_address.country"
              label="Country"
              helperText={false}
            />
          </div>

          <TextInput
            source="notes"
            label="Internal notes"
            multiline
            helperText={false}
          />
        </div>
      </SimpleForm>
    </Create>
  );
}

export default OrderCreate;
