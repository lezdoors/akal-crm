import { useTranslate } from "ra-core";

import { ActivityLog } from "../activity/ActivityLog";

export function DashboardActivityLog() {
  const translate = useTranslate();
  return (
    <div className="panel flex flex-col gap-4 p-5">
      <h2 className="overline">
        {translate("crm.dashboard.latest_activity", {
          _: "Latest Activity",
        })}
      </h2>
      <ActivityLog pageSize={10} />
    </div>
  );
}
