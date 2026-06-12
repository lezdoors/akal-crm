import { useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCatalogue } from "../catalogue/ProductsPage";

/**
 * The collection's pulse: one-of-one pieces, so the three counts ARE the
 * inventory. Editorial figures — the numbers speak in the maison's serif.
 */
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
      dot: "bg-moss",
      label: translate("crm.products.status.available", { _: "Available" }),
    },
    {
      key: "reserved",
      dot: "bg-tobacco",
      label: translate("crm.products.status.reserved", { _: "Reserved" }),
    },
    {
      key: "sold",
      dot: "bg-ink",
      label: translate("crm.products.status.sold", { _: "Sold" }),
    },
  ] as const;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{translate("crm.nav.inventory")}</CardTitle>
        <Link
          to="/inventory"
          className="overline no-underline hover:text-foreground"
        >
          {translate("crm.dashboard.all", { _: "All" })}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-8">
          {rows.map((row) => (
            <div key={row.key} className="flex flex-col gap-1">
              <span className="display text-[26px] leading-none tabular-nums">
                {counts[row.key]}
              </span>
              <span className="overline flex items-center gap-1.5">
                <span
                  className={`inline-block size-1.5 rounded-full ${row.dot}`}
                />
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
