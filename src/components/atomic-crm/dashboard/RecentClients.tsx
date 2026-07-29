import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Contact } from "../types";
import { useFormatDate } from "../orders/orderUtils";

/** Newest entries in the client book — auto-created from orders. */
export const RecentClients = () => {
  const translate = useTranslate();
  const formatDate = useFormatDate();
  const { data: contacts } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 6 },
    sort: { field: "first_seen", order: "DESC" },
  });

  if (!contacts?.length) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {translate("crm.dashboard.recent_clients", { _: "New clients" })}
        </CardTitle>
        <Link
          to="/contacts"
          className="overline no-underline hover:text-foreground"
        >
          {translate("crm.dashboard.all", { _: "All" })}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col -mx-1">
          {contacts.map((contact) => (
            <Link
              key={String(contact.id)}
              to={`/contacts/${contact.id}/show`}
              className="flex items-baseline gap-2.5 px-1 py-2 no-underline transition-colors hover:bg-secondary"
            >
              <span className="text-[13px] truncate flex-1">
                {contact.first_name} {contact.last_name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {contact.first_seen ? formatDate(contact.first_seen) : ""}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
