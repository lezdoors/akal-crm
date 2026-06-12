import { useGetMany } from "ra-core";

import type { Order, OrderItem } from "../types";

export interface ProductLookupRow {
  id: string;
  title?: string;
  images?: string[];
  materials?: string[];
  category?: string;
  variant_attribute?: { type?: string; value?: string };
}

/**
 * Production order rows don't carry product details — the webhook writes
 * product_id (+ slug) only. These hooks resolve photo / leather / colour
 * from the products table so the team sees exactly which piece to pack.
 * Missing/unknown ids (manual orders, legacy tests) resolve to undefined.
 */
export const useOrderProducts = (
  orders: Order[] | Order | undefined,
): ((item: OrderItem) => ProductLookupRow | undefined) => {
  const list = Array.isArray(orders) ? orders : orders ? [orders] : [];
  // products.id is a UUID; manual orders may carry free text in product_id.
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const ids = Array.from(
    new Set(
      list
        .flatMap((order) => order.items ?? [])
        .map((item) => item.product_id)
        .filter((id) => id && UUID_RE.test(id)),
    ),
  );
  const { data: products } = useGetMany<ProductLookupRow>(
    "products",
    { ids },
    { enabled: ids.length > 0 },
  );
  const byId = new Map((products ?? []).map((product) => [product.id, product]));
  return (item: OrderItem) => byId.get(item.product_id);
};

export const useOrderProductImages = (
  orders: Order[] | Order | undefined,
): ((item: OrderItem) => string | undefined) => {
  const productFor = useOrderProducts(orders);
  return (item: OrderItem) => item.image ?? productFor(item)?.images?.[0];
};
