import { type ReactNode } from "react";

/**
 * Page body on mobile. The global MobileLayout owns the scroll container,
 * the top-bar offset and the bottom-nav padding — this is just a centered
 * max-width wrapper so content stays comfortable on large phones/tablets.
 */
export const MobileContent = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-screen-md">{children}</div>
);
