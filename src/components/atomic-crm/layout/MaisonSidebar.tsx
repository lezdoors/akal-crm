import {
  Building2,
  Handshake,
  House,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslate } from "ra-core";
import { Link, useLocation, matchPath } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useConfigurationContext } from "../root/ConfigurationContext";

interface NavEntry {
  to: string;
  icon: LucideIcon;
  /** i18n key; resources get smart_count 2. */
  label: string;
  isResource?: boolean;
}

const MAIN_NAV: NavEntry[] = [
  { to: "/", icon: House, label: "ra.page.dashboard" },
  {
    to: "/orders",
    icon: ShoppingBag,
    label: "resources.orders.name",
    isResource: true,
  },
];

const CRM_NAV: NavEntry[] = [
  {
    to: "/contacts",
    icon: Users,
    label: "resources.contacts.name",
    isResource: true,
  },
  {
    to: "/companies",
    icon: Building2,
    label: "resources.companies.name",
    isResource: true,
  },
  {
    to: "/deals",
    icon: Handshake,
    label: "resources.deals.name",
    isResource: true,
  },
];

const NavItem = ({ entry }: { entry: NavEntry }) => {
  const translate = useTranslate();
  const location = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();
  const isActive =
    entry.to === "/"
      ? !!matchPath("/", location.pathname)
      : !!matchPath(`${entry.to}/*`, location.pathname);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          to={entry.to}
          onClick={() => openMobile && setOpenMobile(false)}
        >
          <entry.icon className="!size-4" />
          <span>
            {translate(
              entry.label,
              entry.isResource ? { smart_count: 2 } : undefined,
            )}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/**
 * Maison Tanneurs sidebar: Linear-style structure, maison skin.
 * Explicit nav (orders first) instead of auto-generated resource list.
 */
export function MaisonSidebar() {
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <img
                  className="h-5 w-auto [.dark_&]:hidden"
                  src={lightModeLogo}
                  alt={title}
                />
                <img
                  className="h-5 w-auto hidden [.dark_&]:block"
                  src={darkModeLogo}
                  alt={title}
                />
                <span className="font-display text-[15px] font-medium tracking-[0.04em] group-data-[collapsible=icon]:hidden">
                  {title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((entry) => (
                <NavItem key={entry.to} entry={entry} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em]">
            CRM
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CRM_NAV.map((entry) => (
                <NavItem key={entry.to} entry={entry} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 pb-1 text-[9px] uppercase tracking-[0.24em] text-muted-foreground group-data-[collapsible=icon]:hidden">
          Atelier · Marrakech
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
