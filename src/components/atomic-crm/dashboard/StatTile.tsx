import type { ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** Top-rule accent color (CSS color value). */
  accent?: string;
}

/**
 * Editorial KPI tile: eyebrow label, Cormorant numeral, hairline frame
 * with a 2px colored top rule — the maison's answer to SaaS stat cards.
 */
export const StatTile = ({ label, value, sub, accent }: StatTileProps) => (
  <div
    className="border bg-card px-5 pb-4 pt-3 flex flex-col gap-1"
    style={{ borderTop: `2px solid ${accent ?? "var(--ink)"}` }}
  >
    <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </div>
    <div className="font-serif text-[34px] font-medium leading-[1.08] tracking-[0.02em] tabular-nums">
      {value}
    </div>
    {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
  </div>
);
