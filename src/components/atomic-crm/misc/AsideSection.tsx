import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AsideSectionProps = {
  title: string;
  children?: ReactNode;
  noGap?: boolean;
};

export function AsideSection({ title, children, noGap }: AsideSectionProps) {
  return (
    <div className="mb-6 border-t pt-3 text-[13px]">
      <h3 className="overline mb-2">{title}</h3>
      <div className={cn("flex flex-col", { "gap-1": !noGap })}>{children}</div>
    </div>
  );
}
