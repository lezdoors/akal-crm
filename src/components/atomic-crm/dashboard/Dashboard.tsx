import { useGetList } from "ra-core";

import type { Contact, ContactNote } from "../types";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { OrdersToShip } from "./OrdersToShip";
import { RecentClients } from "./RecentClients";
import { RecentOrders } from "./RecentOrders";
import { StockAlerts } from "./StockAlerts";
import { Welcome } from "./Welcome";

/**
 * A work queue, not analytics: orders to ship + recent orders left,
 * new clients / inventory pulse / activity right.
 */
export const Dashboard = () => {
  const {
    data: dataContact,
    total: totalContact,
    isPending: isPendingContact,
  } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalContactNotes, isPending: isPendingContactNotes } =
    useGetList<ContactNote>("contact_notes", {
      pagination: { page: 1, perPage: 1 },
    });

  const isPending = isPendingContact || isPendingContactNotes;

  if (isPending) {
    return null;
  }

  if (!totalContact) {
    return <DashboardStepper step={1} />;
  }

  if (!totalContactNotes) {
    return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
  }

  return (
    <div className="flex flex-col gap-5 mt-2">
      {import.meta.env.VITE_IS_DEMO === "true" ? <Welcome /> : null}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <OrdersToShip />
          <RecentOrders />
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
