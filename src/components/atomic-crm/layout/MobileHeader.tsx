/**
 * A per-page sticky sub-bar that docks just beneath the global mobile top
 * bar (see MobileLayout). Detail pages use it for a back button + actions.
 * It bleeds to the screen edges (-mx-5 cancels the main's px-5).
 */
const MobileHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sticky top-14 z-30 -mx-5 mb-3 flex h-12 items-center gap-2 bg-panel px-5">
      {children}
    </div>
  );
};

export default MobileHeader;
