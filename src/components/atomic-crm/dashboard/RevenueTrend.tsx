import { ResponsiveBar } from "@nivo/bar";
import { format, startOfMonth, subMonths } from "date-fns";
import { useTranslate } from "ra-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDashboardOrders } from "./commerceData";

const CURRENCY_COLORS: Record<string, string> = {
  USD: "#1c1a17",
  EUR: "#8b5a2b",
  GBP: "#8d867c",
};

const MONTHS_SHOWN = 6;

/** Monthly revenue (major units) for the last 6 months, one bar per currency. */
export const RevenueTrend = () => {
  const translate = useTranslate();
  const { data: orders } = useDashboardOrders();

  if (!orders?.length) return null;

  const months = Array.from({ length: MONTHS_SHOWN }, (_, index) =>
    startOfMonth(subMonths(new Date(), MONTHS_SHOWN - 1 - index)),
  );
  const currencies = Array.from(
    new Set(orders.map((order) => order.currency || "USD")),
  ).sort();

  const data = months.map((month) => {
    const next = startOfMonth(subMonths(month, -1));
    const row: Record<string, number | string> = {
      month: format(month, "MMM"),
    };
    for (const currency of currencies) row[currency] = 0;
    for (const order of orders) {
      const created = new Date(order.created_at);
      if (created >= month && created < next) {
        const code = order.currency || "USD";
        row[code] = (row[code] as number) + order.total / 100;
      }
    }
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translate("resources.orders.dashboard.trend_title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveBar
            data={data}
            indexBy="month"
            keys={currencies}
            groupMode="grouped"
            colors={(bar) => CURRENCY_COLORS[bar.id as string] ?? "#1c1a17"}
            margin={{ top: 8, right: 16, bottom: 28, left: 48 }}
            padding={0.45}
            innerPadding={2}
            enableLabel={false}
            borderRadius={0}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
              tickValues: 4,
            }}
            axisBottom={{ tickSize: 0, tickPadding: 10 }}
            gridYValues={4}
            theme={{
              text: {
                fontFamily: "Inter Variable, sans-serif",
                fontSize: 11,
                fill: "var(--ink-muted)",
              },
              grid: { line: { stroke: "var(--hairline)", strokeWidth: 1 } },
              tooltip: {
                container: {
                  background: "var(--card)",
                  color: "var(--foreground)",
                  fontSize: 12,
                  borderRadius: 0,
                  border: "1px solid var(--hairline)",
                  boxShadow: "none",
                },
              },
            }}
          />
        </div>
        {currencies.length > 1 && (
          <div className="flex gap-4 mt-2">
            {currencies.map((code) => (
              <span
                key={code}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <span
                  className="inline-block h-2 w-2"
                  style={{ background: CURRENCY_COLORS[code] ?? "#1c1a17" }}
                />
                {code}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
