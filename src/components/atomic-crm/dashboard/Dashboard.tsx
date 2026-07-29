import { useLocaleState, useTranslate } from "ra-core";
import { Link } from "react-router";

import { ChannelOverview } from "./ChannelOverview";
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
    <div className="border-t pt-4">
      <p className="overline">
        {translate("crm.dashboard.empty_title", {
          _: "Awaiting the first order",
        })}
      </p>
      <p className="display mt-3 max-w-md text-[19px] leading-snug text-ink-soft">
        {translate("crm.dashboard.empty_body", { _: "" })}
      </p>
      <Link
        to="/orders/create"
        className="mt-4 inline-block text-[13px] no-underline text-tobacco transition-opacity hover:opacity-80"
      >
        {translate("crm.dashboard.empty_action", {
          _: "Enter an order manually",
        })}
        {" →"}
      </Link>
    </div>
  );
};

/**
 * Aujourd'hui — the register's action page. The date in the maison's voice,
 * then: what must ship, what just happened, who is new, what remains.
 */
export const Dashboard = () => {
  const { data: orders, isPending } = useDashboardOrders();
  const translate = useTranslate();
  const [locale] = useLocaleState();

  if (isPending) {
    return null;
  }

  const today = new Date().toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-US",
    { weekday: "long", day: "numeric", month: "long" },
  );

  return (
    <div className="flex flex-col gap-5 mt-2">
      <div>
        <p className="overline">
          {translate("crm.nav.today", { _: "Today" })}
        </p>
        <h1 className="display mt-1 text-[28px] leading-none capitalize">
          {today}
        </h1>
      </div>
      <ChannelOverview />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-5">
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
