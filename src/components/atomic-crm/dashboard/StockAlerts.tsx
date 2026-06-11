import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCatalogue } from "../catalogue/ProductsPage";

/** Inventory pulse: one-of-one pieces, so sold/reserved counts ARE the alerts. */
export const StockAlerts = () => {
  const translate = useTranslate();
  const { data: products } = useCatalogue();
  if (!products?.length) return null;

  const counts = {
    available: products.filter((p) => p.status === "available").length,
    reserved: products.filter((p) => p.status === "reserved").length,
    sold: products.filter((p) => p.status === "sold").length,
  };

  const rows = [
    {
      key: "available",
      accent: "#1f4d3a",
      label: translate("crm.products.status.available", { _: "Available" }),
    },
    {
      key: "reserved",
      accent: "var(--tobacco)",
      label: translate("crm.products.status.reserved", { _: "Reserved" }),
    },
    {
      key: "sold",
      accent: "var(--ink)",
      label: translate("crm.products.status.sold", { _: "Sold" }),
    },
  ] as const;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Boxes className="h-4 w-4" />
          {translate("crm.nav.inventory")}
        </CardTitle>
        <Link
          to="/inventory"
          className="text-[11px] text-muted-foreground no-underline hover:text-foreground"
        >
          {translate("crm.dashboard.all", { _: "All" })}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: row.accent }}
              />
              <span className="text-muted-foreground flex-1">{row.label}</span>
              <span className="tabular-nums">{counts[row.key]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
