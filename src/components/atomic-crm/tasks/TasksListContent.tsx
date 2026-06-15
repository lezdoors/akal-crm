import { TasksListByDueDate } from "./TasksListByDueDate";
import { useTranslate } from "ra-core";

export const TasksListContent = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4">
      <TasksListByDueDate
        emptyPlaceholder={
          <div className="border-t pt-4">
            <p className="overline">
              {translate("resources.tasks.name", { smart_count: 2, _: "Tasks" })}
            </p>
            <p className="display mt-3 text-[19px] leading-snug text-ink-soft">
              {translate("resources.tasks.empty_list_hint")}
            </p>
          </div>
        }
      />
    </div>
  );
};
