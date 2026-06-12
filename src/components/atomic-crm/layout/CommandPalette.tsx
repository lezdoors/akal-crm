import { House, Package, Plus, ShoppingBag, Users } from "lucide-react";
import { useGetList, useRedirect, useTranslate } from "ra-core";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import type { Contact, Order } from "../types";
import { formatMoney } from "../orders/orderUtils";

/**
 * Global command palette (Cmd+K / Ctrl+K) in the register voice: navigation,
 * quick actions, and live search across orders and contacts.
 */
export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const redirect = useRedirect();
  const translate = useTranslate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const hasQuery = query.trim().length >= 2;
  const { data: orders } = useGetList<Order>(
    "orders",
    {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "created_at", order: "DESC" },
      filter: {
        "@or": {
          "order_number@ilike": query,
          "customer_name@ilike": query,
          "customer_email@ilike": query,
        },
      },
    },
    { enabled: open && hasQuery },
  );
  const { data: contacts } = useGetList<Contact>(
    "contacts",
    {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "last_seen", order: "DESC" },
      filter: { q: query },
    },
    { enabled: open && hasQuery },
  );

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    redirect(path);
  };

  // Deals/companies stay registered for a future wholesale pipeline but are
  // deliberately absent from every navigation surface.
  const nav = [
    { path: "/", icon: House, label: translate("ra.page.dashboard") },
    {
      path: "/orders",
      icon: ShoppingBag,
      label: translate("resources.orders.name", { smart_count: 2 }),
    },
    {
      path: "/contacts",
      icon: Users,
      label: translate("resources.contacts.name", { smart_count: 2 }),
    },
    {
      path: "/products",
      icon: Package,
      label: translate("crm.nav.products", { _: "Products" }),
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={!hasQuery}>
      <CommandInput
        placeholder={translate("crm.command.placeholder", {
          _: "Search orders, customers, or jump to…",
        })}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {translate("ra.navigation.no_results", { _: "No results found." })}
        </CommandEmpty>

        {hasQuery && orders?.length ? (
          <CommandGroup
            heading={translate("resources.orders.name", { smart_count: 2 })}
          >
            {orders.map((order) => (
              <CommandItem
                key={String(order.id)}
                value={`${order.order_number} ${order.customer_name} ${order.customer_email}`}
                onSelect={() => go(`/orders/${order.id}/show`)}
              >
                <ShoppingBag className="size-4" />
                <span className="font-mono text-xs">{order.order_number}</span>
                <span className="text-muted-foreground truncate flex-1">
                  {order.customer_name}
                </span>
                <span className="tabular-nums text-xs">
                  {formatMoney(order.total, order.currency)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {hasQuery && contacts?.length ? (
          <CommandGroup
            heading={translate("resources.contacts.name", { smart_count: 2 })}
          >
            {contacts.map((contact) => (
              <CommandItem
                key={String(contact.id)}
                value={`${contact.first_name} ${contact.last_name} ${contact.id}`}
                onSelect={() => go(`/contacts/${contact.id}/show`)}
              >
                <Users className="size-4" />
                <span className="truncate">
                  {contact.first_name} {contact.last_name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {hasQuery && (orders?.length || contacts?.length) ? (
          <CommandSeparator />
        ) : null}

        <CommandGroup
          heading={translate("crm.command.navigation", { _: "Go to" })}
        >
          {nav.map((entry) => (
            <CommandItem
              key={entry.path}
              value={`nav ${entry.label}`}
              onSelect={() => go(entry.path)}
            >
              <entry.icon className="size-4" />
              {entry.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup
          heading={translate("crm.command.actions", { _: "Actions" })}
        >
          <CommandItem
            value="action new order nouvelle commande"
            onSelect={() => go("/orders/create")}
          >
            <Plus className="size-4" />
            {translate("resources.orders.action.new")}
          </CommandItem>
          <CommandItem
            value="action new contact nouveau client"
            onSelect={() => go("/contacts/create")}
          >
            <Plus className="size-4" />
            {translate("crm.command.new_contact", { _: "New contact" })}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
