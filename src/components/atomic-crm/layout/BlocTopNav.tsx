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

import { cn } from "@/lib/utils";

interface NavEntry {
  to: string;
  icon: LucideIcon;
  label: string;
}

/**
 * reown.com puts navigation in a row of floating pill chips on the ground,
 * not in a rail. Copying that removes the CRM's biggest layout problem at the
 * same time: a full-height sidebar with four links leaves an enormous empty
 * column on every page, and the content then only gets ~1000px to work with.
 */
const NAV: NavEntry[] = [
  { to: "/", icon: Sun, label: "crm.nav.today" },
  { to: "/orders", icon: ShoppingBag, label: "resources.orders.name" },
  { to: "/carts", icon: ShoppingCart, label: "crm.nav.carts" },
  { to: "/contacts", icon: Users, label: "crm.nav.clients" },
  { to: "/products", icon: Layers, label: "crm.nav.products" },
  { to: "/inventory", icon: Boxes, label: "crm.nav.inventory" },
  { to: "/media", icon: Images, label: "crm.nav.media" },
];

const NavChip = ({ entry }: { entry: NavEntry }) => {
  const translate = useTranslate();
  const location = useLocation();
  const isActive =
    entry.to === "/"
      ? !!matchPath("/", location.pathname)
      : !!matchPath(`${entry.to}/*`, location.pathname);
  const Icon = entry.icon;
  return (
    <Link
      to={entry.to}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] px-4 font-mono text-[13px] no-underline transition-colors",
        isActive
          ? "bg-tobacco text-on-primary"
          : "bg-panel text-ink hover:bg-panel-raised",
      )}
    >
      <Icon className="size-[15px] shrink-0 opacity-70" aria-hidden />
      <span className="whitespace-nowrap">
        {translate(entry.label, { smart_count: 2, _: entry.label })}
      </span>
    </Link>
  );
};

/** A round icon-only chip. 40px keeps it above the 44px-with-padding target. */
const IconChip = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-panel text-ink transition-colors hover:bg-panel-raised"
  >
    {children}
  </button>
);

export const BlocTopNav = ({ trailing }: { trailing?: React.ReactNode }) => {
  const translate = useTranslate();
  const navigate = useNavigate();
  return (
    <nav
      className="flex flex-wrap items-center gap-2 px-4 py-3"
      aria-label={translate("ra.navigation.main", { _: "Main" })}
    >
      {/* Brand chip — reown's black `. / reown` cluster, one chip here. */}
      <Link
        to="/"
        // The house chip inverts after hours — panel-strong on the dark ground
        // is a black shape on black, so the fill flips to ink instead.
        className="inline-flex h-10 items-center rounded-[var(--radius-control)] bg-panel-strong px-5 font-mono text-[13px] tracking-[-0.02em] text-ink-inverse no-underline dark:bg-ink dark:text-ground"
      >
        Maison Tanneurs
      </Link>

      <div className="mx-1 flex flex-wrap items-center gap-2">
        {NAV.map((entry) => (
          <NavChip key={entry.to} entry={entry} />
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <IconChip
          label={translate("ra.action.search", { _: "Search" })}
          onClick={() =>
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true }),
            )
          }
        >
          <Search className="size-[15px]" aria-hidden />
        </IconChip>
        <IconChip
          label={translate("crm.action.new_note", { _: "New note" })}
          onClick={() => navigate("/contacts/create")}
        >
          <PenLine className="size-[15px]" aria-hidden />
        </IconChip>
        <IconChip
          label={translate("crm.nav.settings", { _: "Settings" })}
          onClick={() => navigate("/settings")}
        >
          <Settings className="size-[15px]" aria-hidden />
        </IconChip>
        {trailing}
      </div>
    </nav>
  );
};
