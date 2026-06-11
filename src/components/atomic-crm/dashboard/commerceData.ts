import { useGetList } from "ra-core";

import type { Order } from "../types";

/**
 * Single shared orders query for every dashboard widget — identical
 * parameters mean one react-query cache entry and one network call.
 */
export const useDashboardOrders = () =>
  useGetList<Order>("orders", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "created_at", order: "DESC" },
  });

export const monthStart = (offset = 0): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, 1);
};

export const ordersInMonth = (orders: Order[], offset = 0): Order[] => {
  const start = monthStart(offset);
  const end = monthStart(offset + 1);
  return orders.filter((order) => {
    const created = new Date(order.created_at);
    return created >= start && created < end;
  });
};

export const needsShipping = (order: Order): boolean =>
  order.status === "paid" && !order.tracking_number;
