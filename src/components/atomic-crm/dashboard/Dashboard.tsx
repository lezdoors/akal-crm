import { useGetList } from "ra-core";

import type { Contact, ContactNote } from "../types";
import { CommerceKpis } from "./CommerceKpis";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { OrdersToShip } from "./OrdersToShip";
import { RecentOrders } from "./RecentOrders";
import { RevenueTrend } from "./RevenueTrend";
import { TasksList } from "./TasksList";
import { Welcome } from "./Welcome";

/**
 * Commerce cockpit: KPI band on top, revenue trend + recent orders on the
 * left, action rail (to-ship queue, activity, tasks) on the right.
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
      <CommerceKpis />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <RevenueTrend />
          <RecentOrders />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-5">
          <OrdersToShip />
          <DashboardActivityLog />
          <TasksList />
        </div>
      </div>
    </div>
  );
};
