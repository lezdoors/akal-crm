import {
  Boxes,
  Images,
  Layers,
  PenLine,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sun,
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

interface NavEntry {
  to: string;
  icon: LucideIcon;
  label: string;
  isResource?: boolean;
}

const MAIN_NAV: NavEntry[] = [
  { to: "/", icon: Sun, label: "crm.nav.today" },
  {
    to: "/orders",
    icon: ShoppingBag,
    label: "resources.orders.name",
    isResource: true,
  },
  {
    to: "/carts",
    icon: ShoppingCart,
    label: "crm.nav.carts",
  },
  {
    to: "/contacts",
    icon: Users,
    label: "crm.nav.clients",
  },
];

const COLLECTION_NAV: NavEntry[] = [
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
        className="h-7 text-[13px] rounded-sm data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-foreground text-ink-soft"
      >
        <Link to={entry.to} onClick={() => openMobile && setOpenMobile(false)}>
          <entry.icon
            className={`!size-[15px] ${isActive ? "text-tobacco" : "opacity-50"}`}
          />
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
  <SidebarGroupLabel className="overline h-auto pb-1.5 pt-1">
    {children}
  </SidebarGroupLabel>
);

/**
 * Le Registre's rail: the maison wordmark in small caps, typographic nav on
 * the same paper as the content — no inset card, no boxes. The active page
 * is marked by ink weight and a tobacco icon, not a pill.
 */
export function MaisonSidebar() {
  const translate = useTranslate();
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="offcanvas" className="border-0 bg-background">
      <SidebarHeader className="px-4 pt-6 pb-4">
        <div className="flex items-start justify-between gap-2">
          <Link to="/" className="no-underline min-w-0">
            <span className="display block text-[17px] leading-tight tracking-[0.02em] text-foreground">
              Maison Tanneurs
            </span>
            <span className="overline mt-1 block">
              {translate("crm.nav.register", { _: "Le Registre" })}
            </span>
          </Link>
          <div className="flex items-center gap-0.5 pt-0.5">
            <button
              type="button"
              aria-label="Search"
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true }),
                )
              }
              className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="size-[15px]" />
            </button>
            <button
              type="button"
              aria-label={translate("resources.orders.action.new")}
              onClick={() => navigate("/orders/create")}
              className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <PenLine className="size-[15px]" />
            </button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1">
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
          <GroupLabel>
            {translate("crm.nav.catalogue", { _: "Collection" })}
          </GroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {COLLECTION_NAV.map((entry) => (
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
      <SidebarFooter className="px-1 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-7 text-[13px] rounded-sm text-muted-foreground"
            >
              <Link to="/settings">
                <Settings className="!size-[15px] opacity-50" />
                <span>{translate("crm.settings.title", { _: "Settings" })}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
