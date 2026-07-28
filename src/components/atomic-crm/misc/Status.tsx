import { cn } from "@/lib/utils";

import { useConfigurationContext } from "../root/ConfigurationContext";

export const Status = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const { noteStatuses } = useConfigurationContext();
  if (!status || !noteStatuses) return null;
  const statusObject = noteStatuses.find((s: any) => s.value === status);

  if (!statusObject) return null;
  return (
    <div className={cn("group relative inline-block mr-2", className)}>
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: statusObject.color }}
      />
      {/* `hidden` rather than `opacity-0`: an absolutely-positioned nowrap
          tooltip still counts toward document width, and on the last column
          of the client list it pushed a phone viewport 7px wide. */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-background bg-ink rounded hidden group-hover:block pointer-events-none whitespace-nowrap z-10">
        {statusObject.label}
      </div>
    </div>
  );
};
