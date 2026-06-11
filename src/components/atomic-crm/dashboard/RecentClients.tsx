import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Contact } from "../types";

/** Newest customers — auto-created from orders by the database trigger. */
export const RecentClients = () => {
  const translate = useTranslate();
  const { data: contacts } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 6 },
    sort: { field: "first_seen", order: "DESC" },
  });

  if (!contacts?.length) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          {translate("crm.dashboard.recent_clients", { _: "New clients" })}
        </CardTitle>
        <Link
          to="/contacts"
          className="text-[11px] text-muted-foreground no-underline hover:text-foreground"
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
              className="flex items-center gap-2.5 rounded-md px-1 py-1.5 no-underline hover:bg-muted/70"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                {(contact.first_name?.[0] ?? "") + (contact.last_name?.[0] ?? "")}
              </span>
              <span className="text-sm truncate flex-1">
                {contact.first_name} {contact.last_name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {contact.first_seen
                  ? new Date(contact.first_seen).toLocaleDateString()
                  : ""}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
