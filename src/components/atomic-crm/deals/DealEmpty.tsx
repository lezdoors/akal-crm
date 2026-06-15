import { useGetList, useTranslate } from "ra-core";
import { matchPath, useLocation, Link } from "react-router";
import type { ReactNode } from "react";
import { Handshake } from "lucide-react";
import { CreateButton } from "@/components/admin/create-button";
import { Progress } from "@/components/ui/progress";

import useAppBarHeight from "../misc/useAppBarHeight";
import type { Contact } from "../types";
import { DealCreate } from "./DealCreate";

export const DealEmpty = ({ children }: { children?: ReactNode }) => {
  const translate = useTranslate();
  const location = useLocation();
  const matchCreate = matchPath("/deals/create", location.pathname);
  const appbarHeight = useAppBarHeight();

  // get Contact data
  const { data: contacts, isPending: contactsLoading } = useGetList<Contact>(
    "contacts",
    {
      pagination: { page: 1, perPage: 1 },
    },
  );

  if (contactsLoading) return <Progress value={50} />;

  return (
    <div
      className="flex flex-col justify-center items-center gap-6"
      style={{
        height: `calc(100dvh - ${appbarHeight}px)`,
      }}
    >
      <Handshake className="size-9 text-ink-muted mb-1" strokeWidth={1.25} />
      {contacts && contacts.length > 0 ? (
        <>
          <div className="flex flex-col items-center gap-0">
            <h3 className="display text-[22px] leading-none mb-2">
              {translate("resources.deals.empty.title")}
            </h3>
            <p className="text-[13px] text-center text-muted-foreground mb-4">
              {translate("resources.deals.empty.description")}
            </p>
          </div>
          <div className="flex space-x-8">
            <CreateButton label="resources.deals.action.create" />
          </div>
          <DealCreate open={!!matchCreate} />
          {children}
        </>
      ) : (
        <div className="flex flex-col items-center gap-0">
          <h3 className="display text-[22px] leading-none mb-2">
            {translate("resources.deals.empty.title")}
          </h3>
          <p className="text-[13px] text-center text-muted-foreground mb-4">
            {translate("resources.contacts.empty.description")}
            <br />
            <Link to="/contacts/create" className="hover:underline">
              {translate("resources.contacts.action.add_first")}
            </Link>{" "}
            {translate("resources.deals.empty.before_create")}
          </p>
        </div>
      )}
    </div>
  );
};
