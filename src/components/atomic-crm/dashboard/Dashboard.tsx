import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { DashboardActivityLog } from "./DashboardActivityLog";
import { OrdersToShip } from "./OrdersToShip";
import { RecentClients } from "./RecentClients";
import { RecentOrders } from "./RecentOrders";
import { StockAlerts } from "./StockAlerts";
import { useDashboardOrders } from "./commerceData";

/** Shown in the orders column until the first order exists. */
const AwaitingFirstOrder = () => {
  const translate = useTranslate();
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
        <p className="text-[13px] font-semibold">
          {translate("crm.dashboard.empty_title", {
            _: "Awaiting the first order",
          })}
        </p>
        <p className="max-w-sm text-[13px] text-muted-foreground">
          {translate("crm.dashboard.empty_body", { _: "" })}
        </p>
        <Link
          to="/orders/create"
          className="mt-2 text-[13px] no-underline text-tobacco hover:opacity-80"
        >
          {translate("crm.dashboard.empty_action", {
            _: "Enter an order manually",
          })}
        </Link>
      </CardContent>
    </Card>
  );
};

/**
 * A work queue, not analytics: orders to ship + recent orders left,
 * new clients / inventory pulse / activity right.
 */
export const Dashboard = () => {
  const { data: orders, isPending } = useDashboardOrders();

  if (isPending) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-5">
          {orders?.length ? (
            <>
              <OrdersToShip />
              <RecentOrders />
            </>
          ) : (
            <AwaitingFirstOrder />
          )}
        </div>
        <div className="lg:col-span-4 flex flex-col gap-5">
          <RecentClients />
          <StockAlerts />
          <DashboardActivityLog />
        </div>
      </div>
    </div>
  );
};
