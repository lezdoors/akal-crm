import { CreateButton } from "@/components/admin/create-button";
import { Building2 } from "lucide-react";
import { useTranslate } from "ra-core";

import useAppBarHeight from "../misc/useAppBarHeight";

export const CompanyEmpty = () => {
  const appbarHeight = useAppBarHeight();
  const translate = useTranslate();
  return (
    <div
      className="flex flex-col justify-center items-center gap-6"
      style={{
        height: `calc(100dvh - ${appbarHeight}px)`,
      }}
    >
      <Building2 className="size-9 text-ink-muted mb-1" strokeWidth={1.25} />
      <div className="flex flex-col gap-0 items-center">
        <h6 className="display text-[22px] leading-none mb-2">
          {translate("resources.companies.empty.title", {
            _: "No companies found",
          })}
        </h6>
        <p className="text-[13px] text-center text-muted-foreground mb-4">
          {translate("resources.companies.empty.description", {
            _: "It seems your company list is empty.",
          })}
        </p>
      </div>
      <div className="flex space-x-2">
        <CreateButton label="resources.companies.action.create" />
      </div>
    </div>
  );
};
