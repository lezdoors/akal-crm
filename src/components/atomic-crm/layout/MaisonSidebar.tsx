import {
  Boxes,
  House,
  Images,
  Layers,
  PenLine,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslate } from "ra-core";
import { Link, useLocation, matchPath, useNavigate } from "react-router";
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
  {
    to: "/contacts",
    icon: Users,
    label: "crm.nav.clients",
  },
];

const CATALOGUE_NAV: NavEntry[] = [
  { to: "/products", icon: Layers, label: "crm.nav.products" },
  { to: "/inventory", icon: Boxes, label: "crm.nav.inventory" },
];

const STUDIO_NAV: NavEntry[] = [
  { to: "/media", icon: Images, label: "crm.nav.media" },
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
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="h-8 text-[13px] rounded-md"
      >
        <Link to={entry.to} onClick={() => openMobile && setOpenMobile(false)}>
          <entry.icon className="!size-4 opacity-70" />
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

const GroupLabel = ({ children }: { children: string }) => (
  <SidebarGroupLabel className="text-[11px] font-medium text-muted-foreground/80 normal-case tracking-normal">
    {children}
  </SidebarGroupLabel>
);

/**
 * Linear anatomy, maison identity: borderless sidebar on the warm canvas,
 * workspace-style header (monogram + name + search/compose), compact sans
 * nav with pill active states. Serif stays out of the chrome.
 */
export function MaisonSidebar() {
  const { lightModeLogo, darkModeLogo, title } = useConfigurationContext();
  const translate = useTranslate();
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="icon" variant="inset" className="border-0">
      <SidebarHeader>
        <div className="flex items-center gap-1.5 px-1 pt-1">
          <Link
            to="/"
            className="flex items-center gap-2 min-w-0 flex-1 no-underline rounded-md px-1 py-1 hover:bg-sidebar-accent"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white border">
              <img
                className="h-4 w-4 [.dark_&]:hidden"
                src={lightModeLogo}
                alt=""
              />
              <img
                className="h-4 w-4 hidden [.dark_&]:block"
                src={darkModeLogo}
                alt=""
              />
            </span>
            <span className="truncate text-[13px] font-semibold group-data-[collapsible=icon]:hidden">
              {title}
            </span>
          </Link>
          <button
            type="button"
            aria-label="Search"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground group-data-[collapsible=icon]:hidden"
          >
            <Search className="size-4" />
          </button>
          <button
            type="button"
            aria-label={translate("resources.orders.action.new")}
            onClick={() => navigate("/orders/create")}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground group-data-[collapsible=icon]:hidden"
          >
            <PenLine className="size-4" />
          </button>
        </div>
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
          <GroupLabel>{translate("crm.nav.catalogue", { _: "Catalogue" })}</GroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CATALOGUE_NAV.map((entry) => (
                <NavItem key={entry.to} entry={entry} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <GroupLabel>{translate("crm.nav.studio", { _: "Studio" })}</GroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {STUDIO_NAV.map((entry) => (
                <NavItem key={entry.to} entry={entry} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-8 text-[13px] rounded-md text-muted-foreground"
            >
              <Link to="/settings">
                <Settings className="!size-4 opacity-70" />
                <span>{translate("crm.settings.title", { _: "Settings" })}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
