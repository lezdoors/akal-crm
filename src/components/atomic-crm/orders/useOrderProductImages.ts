import { useGetMany } from "ra-core";

import type { Order, OrderItem } from "../types";

interface ProductRow {
  id: string;
  images?: string[];
}

/**
 * Production order rows don't carry product images — the webhook writes
 * product_id (+ slug) only. This hook resolves each item's photo from the
 * products table so the team sees exactly which piece to pack.
 * Missing/unknown ids (manual orders, legacy tests) resolve to undefined.
 */
export const useOrderProductImages = (
  orders: Order[] | Order | undefined,
): ((item: OrderItem) => string | undefined) => {
  const list = Array.isArray(orders) ? orders : orders ? [orders] : [];
  const ids = Array.from(
    new Set(
      list
        .flatMap((order) => order.items ?? [])
        .map((item) => item.product_id)
        .filter((id) => id && id.length > 10),
    ),
  );
  const { data: products } = useGetMany<ProductRow>(
    "products",
    { ids },
    { enabled: ids.length > 0 },
  );
  const imageByProductId = new Map(
    (products ?? []).map((product) => [product.id, product.images?.[0]]),
  );
  return (item: OrderItem) =>
    item.image ?? imageByProductId.get(item.product_id);
};
