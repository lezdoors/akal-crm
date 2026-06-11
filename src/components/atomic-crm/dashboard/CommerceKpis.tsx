import { useGetList, useTranslate } from "ra-core";

import type { Contact } from "../types";
import { formatMoney, revenueByCurrency } from "../orders/orderUtils";
import { needsShipping, ordersInMonth, useDashboardOrders } from "./commerceData";
import { StatTile } from "./StatTile";

const formatTotals = (totals: Record<string, number>): string =>
  Object.keys(totals).length
    ? Object.entries(totals)
        .map(([code, total]) => formatMoney(total, code))
        .join(" · ")
    : "—";

export const CommerceKpis = () => {
  const translate = useTranslate();
  const { data: orders } = useDashboardOrders();
  const { total: totalContacts } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  if (!orders) return null;

  const thisMonth = ordersInMonth(orders, 0);
  const lastMonth = ordersInMonth(orders, -1);
  const toShip = orders.filter(needsShipping);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile
        label={translate("resources.orders.dashboard.revenue_month")}
        value={formatTotals(revenueByCurrency(thisMonth))}
        sub={translate("resources.orders.dashboard.last_month", {
          value: formatTotals(revenueByCurrency(lastMonth)),
        })}
        accent="var(--ink)"
      />
      <StatTile
        label={translate("resources.orders.dashboard.orders_month")}
        value={thisMonth.length}
        sub={translate("resources.orders.dashboard.all_time", {
          smart_count: orders.length,
        })}
        accent="var(--ink-muted)"
      />
      <StatTile
        label={translate("resources.orders.dashboard.to_ship_label")}
        value={toShip.length}
        sub={
          toShip.length
            ? translate("resources.orders.dashboard.awaiting_tracking")
            : translate("resources.orders.dashboard.all_shipped")
        }
        accent="var(--tobacco)"
      />
      <StatTile
        label={translate("resources.orders.dashboard.customers")}
        value={totalContacts ?? 0}
        sub={translate("resources.orders.dashboard.customers_sub")}
        accent="#1f4d3a"
      />
    </div>
  );
};
