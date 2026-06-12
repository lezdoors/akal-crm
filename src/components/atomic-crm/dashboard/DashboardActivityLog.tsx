import { useTranslate } from "ra-core";

import { ActivityLog } from "../activity/ActivityLog";

export function DashboardActivityLog() {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <h2 className="overline">
        {translate("crm.dashboard.latest_activity", {
          _: "Latest Activity",
        })}
      </h2>
      <ActivityLog pageSize={10} />
    </div>
  );
}
