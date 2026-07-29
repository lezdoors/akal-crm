import { Layers, ShoppingBag, Sun, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslate } from "ra-core";
import { Link, matchPath, useLocation } from "react-router";

import { cn } from "@/lib/utils";

interface Tab {
  to: string;
  icon: LucideIcon;
  label: string;
  match: (pathname: string) => boolean;
}

const TABS: Tab[] = [
  {
    to: "/",
    icon: Sun,
    label: "crm.nav.today",
    match: (p) => !!matchPath("/", p),
  },
  {
    to: "/orders",
    icon: ShoppingBag,
    label: "resources.orders.name",
    match: (p) => !!matchPath("/orders/*", p),
  },
  {
    to: "/contacts",
    icon: Users,
    label: "crm.nav.clients",
    match: (p) => !!matchPath("/contacts/*", p),
  },
  {
    to: "/products",
    icon: Layers,
    label: "crm.nav.catalogue",
    match: (p) =>
      !!matchPath("/products/*", p) || !!matchPath("/inventory/*", p),
  },
];

/**
 * The bottom rail — four destinations at thumb's reach. The active one is
 * marked by a tobacco icon and ink label. The bar is a panel laid on the
 * ground, so it separates from the content by fill rather than by a rule.
 */
export const MobileNavigation = () => {
  const location = useLocation();
  const translate = useTranslate();

  const isPwa = window.matchMedia("(display-mode: standalone)").matches;
  const isWebiOS = /iPad|iPod|iPhone/.test(window.navigator.userAgent);

  return (
    <nav
      aria-label={translate("crm.navigation.label", { _: "Navigation" })}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-panel"
      style={{ paddingBottom: isPwa && isWebiOS ? 12 : undefined }}
    >
      {TABS.map((tab) => {
        const active = tab.match(location.pathname);
        const label =
          tab.label === "resources.orders.name"
            ? translate(tab.label, { smart_count: 2 })
            : translate(tab.label, {
                _: tab.to === "/products" ? "Collection" : undefined,
              });
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 no-underline"
          >
            <tab.icon
              className={cn(
                "size-[22px]",
                active ? "text-accent-ink" : "text-ink-muted",
              )}
              strokeWidth={active ? 1.75 : 1.5}
            />
            <span
              className={cn(
                "text-[10px] tracking-[0.08em]",
                active ? "text-foreground" : "text-ink-muted",
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
