import { PenLine } from "lucide-react";
import { CanAccess, useTranslate } from "ra-core";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router";

import { Error } from "@/components/admin/error";
import { Notification } from "@/components/admin/notification";
import { LocalesMenuButton } from "@/components/admin/locales-menu-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { Loading } from "@/components/admin/loading";

import { useConfigurationLoader } from "../root/useConfigurationLoader";
import { CommandPalette } from "./CommandPalette";
import {
  ChangelogMenuItem,
  ProfileMenu,
  SettingsMenu,
  UsersMenu,
} from "./Header";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Le Registre on a phone: one paper surface, a slim top bar carrying the
 * wordmark and the compose action, and the bottom rail for navigation.
 * Pages render their own serif title beneath — the frame stays quiet.
 */
export const MobileLayout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();
  const translate = useTranslate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-hairline bg-background px-5">
        <Link to="/" className="no-underline min-w-0">
          <span className="display block truncate text-[17px] leading-none tracking-[0.02em] text-foreground">
            Maison Tanneurs
          </span>
        </Link>
        <div className="flex items-center gap-0.5">
          <Link
            to="/orders/create"
            aria-label={translate("resources.orders.action.new")}
            className="flex size-9 items-center justify-center text-muted-foreground no-underline"
          >
            <PenLine className="size-[18px]" />
          </Link>
          <LocalesMenuButton />
          <ThemeModeToggle />
          <UserMenu>
            <ProfileMenu />
            <CanAccess resource="sales" action="list">
              <UsersMenu />
            </CanAccess>
            <CanAccess resource="configuration" action="edit">
              <SettingsMenu />
            </CanAccess>
            <ChangelogMenuItem />
          </UserMenu>
        </div>
      </header>

      <ErrorBoundary FallbackComponent={Error}>
        <Suspense fallback={<Loading />}>
          <main id="main-content" className="px-5 pt-14 pb-28 min-h-screen">
            {children}
          </main>
        </Suspense>
      </ErrorBoundary>

      <MobileNavigation />
      <CommandPalette />
      <Notification mobileOffset={{ bottom: "84px" }} />
    </div>
  );
};
