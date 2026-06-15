import { TasksListContent } from "./TasksListContent";
import { useTranslate } from "ra-core";

export const MobileTasksList = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-5 mt-2">
      <h1 className="display text-[26px] leading-none">
        {translate("resources.tasks.name", { smart_count: 2 })}
      </h1>
      <TasksListContent />
    </div>
  );
};
