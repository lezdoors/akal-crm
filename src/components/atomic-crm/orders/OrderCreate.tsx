import { required, useGetList, useTranslate } from "ra-core";
import { useMemo } from "react";
import { ArrayInput } from "@/components/admin/array-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Create } from "@/components/admin/create";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { SimpleForm } from "@/components/admin/simple-form";
import { SimpleFormIterator } from "@/components/admin/simple-form-iterator";
import { TextInput } from "@/components/admin/text-input";

import type { Order } from "../types";
import {
  formatMoney,
  generateOrderNumber,
  ORDER_CHANNEL_CHOICES,
  ORDER_CURRENCY_CHOICES,
} from "./orderUtils";

interface ProductRow {
  id: string;
  title: string;
  /** USD minor units. */
  price: number;
  images?: string[];
  status?: string;
}

interface OrderDraftItem {
  product_id?: string;
  /** Free-text fallback when the piece isn't in the catalogue. */
  title?: string;
  /** Major units; only used when no product is selected. */
  price?: number;
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
 * Items are picked from the live products catalogue so the order carries a
 * real product_id (and therefore a photo); free-text remains as fallback.
 */
export function OrderCreate() {
  const translate = useTranslate();
  // One-of-one pieces: only what's still available can be sold. The
  // database trigger marks picked pieces sold on save.
  const { data: products } = useGetList<ProductRow>("products", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "title", order: "ASC" },
    filter: { status: "available" },
  });

  const transform = useMemo(() => {
    const byId = new Map((products ?? []).map((p) => [p.id, p]));
    return (data: OrderDraft) => {
      let hasCataloguePrice = false;
      const items = (data.draft_items ?? []).map((item) => {
        const product = item.product_id ? byId.get(item.product_id) : undefined;
        if (product) hasCataloguePrice = true;
        return {
          product_id: item.product_id ?? "",
          title: product?.title ?? item.title ?? "",
          price: product ? product.price : Math.round((item.price ?? 0) * 100),
          quantity: item.quantity ?? 1,
        };
      });
      // Catalogue prices are USD minor units — a mismatched currency column
      // would misstate the amounts, so catalogue picks pin the currency.
      const currency = hasCataloguePrice ? "USD" : data.currency;
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const { draft_items: _draftItems, ...rest } = data;
      return {
        ...rest,
        currency,
        order_number: generateOrderNumber(),
        items,
        subtotal,
        shipping_cost: 0,
        total: subtotal,
        status: "paid",
      };
    };
  }, [products]);

  // Catalogue prices are stored in USD minor units.
  const productChoices = (products ?? []).map((product) => ({
    id: product.id,
    name: `${product.title} — ${formatMoney(product.price, "USD")}`,
  }));

  return (
    <Create transform={transform as any} redirect="show">
      <SimpleForm
        defaultValues={{
          sales_channel: "etsy",
          currency: "USD",
          draft_items: [{ quantity: 1 }],
        }}
      >
        <h2 className="display text-[26px] leading-none mb-4">
          {translate("resources.orders.create.title")}
        </h2>
        <div className="space-y-4 w-full max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectInput
              source="sales_channel"
              label="resources.orders.fields.sales_channel"
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
              label="resources.orders.fields.etsy_order_id"
              helperText={false}
            />
          </div>

          <ArrayInput
            source="draft_items"
            label="resources.orders.create.items"
          >
            <SimpleFormIterator inline>
              <AutocompleteInput
                source="product_id"
                label="resources.orders.create.product"
                choices={productChoices}
                helperText={false}
              />
              <TextInput
                source="title"
                label="resources.orders.create.item_title"
                helperText={false}
              />
              <NumberInput
                source="price"
                label="resources.orders.create.unit_price"
                step={0.01}
                helperText={false}
              />
              <NumberInput
                source="quantity"
                label="resources.orders.create.quantity"
                step={1}
                helperText={false}
              />
            </SimpleFormIterator>
          </ArrayInput>
          <p className="text-xs text-muted-foreground -mt-2">
            {translate("resources.orders.create.product_helper")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              source="shipping_address.line1"
              label="resources.orders.create.address_line1"
              helperText={false}
            />
            <TextInput
              source="shipping_address.line2"
              label="resources.orders.create.address_line2"
              helperText={false}
            />
            <TextInput
              source="shipping_address.city"
              label="resources.orders.create.city"
              helperText={false}
            />
            <TextInput
              source="shipping_address.state"
              label="resources.orders.create.state"
              helperText={false}
            />
            <TextInput
              source="shipping_address.postal_code"
              label="resources.orders.create.postal_code"
              helperText={false}
            />
            <TextInput
              source="shipping_address.country"
              label="resources.orders.create.country"
              helperText={false}
            />
          </div>

          <TextInput
            source="notes"
            label="resources.orders.fields.notes"
            multiline
            helperText={false}
          />
        </div>
      </SimpleForm>
    </Create>
  );
}

export default OrderCreate;
