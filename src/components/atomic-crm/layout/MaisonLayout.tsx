import type { ErrorInfo, ReactNode } from "react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/admin/user-menu";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { Notification } from "@/components/admin/notification";
import { RefreshButton } from "@/components/admin/refresh-button";
import { LocalesMenuButton } from "@/components/admin/locales-menu-button";
import { Error } from "@/components/admin/error";
import { Loading } from "@/components/admin/loading";
import { CanAccess, useTranslate } from "ra-core";

import { useConfigurationLoader } from "../root/useConfigurationLoader";
import {
  ChangelogMenuItem,
  ImportFromJsonMenuItem,
  ProfileMenu,
  SettingsMenu,
  UsersMenu,
} from "./Header";
import { CommandPalette } from "./CommandPalette";
import { MaisonSidebar } from "./MaisonSidebar";

/**
 * Linear-style application shell: collapsible maison sidebar, slim top bar
 * with breadcrumb slot + locale/theme/refresh/user controls.
 */
export const MaisonLayout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();
  const translate = useTranslate();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | undefined>(undefined);
  const handleError = (_: unknown, info: ErrorInfo) => {
    setErrorInfo(info);
  };
  return (
    <SidebarProvider>
      <MaisonSidebar />
      <main
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "sm:transition-[width] sm:duration-200 sm:ease-linear",
          "flex h-svh flex-col",
        )}
        id="main-content"
      >
        <header className="flex h-16 md:h-12 shrink-0 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="scale-125 sm:scale-100" />
          <div className="flex-1 flex items-center" id="breadcrumb" />
          <button
            type="button"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
            className="hidden md:flex items-center gap-2 border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{translate("ra.action.search", { _: "Search" })}</span>
            <kbd className="font-mono text-[10px] border px-1 bg-muted">⌘K</kbd>
          </button>
          <LocalesMenuButton />
          <ThemeModeToggle />
          <RefreshButton />
          <UserMenu>
            <ProfileMenu />
            <CanAccess resource="sales" action="list">
              <UsersMenu />
            </CanAccess>
            <CanAccess resource="configuration" action="edit">
              <SettingsMenu />
            </CanAccess>
            <ImportFromJsonMenuItem />
            <ChangelogMenuItem />
          </UserMenu>
        </header>
        <ErrorBoundary
          onError={handleError}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <Error
              error={error}
              errorInfo={errorInfo}
              resetErrorBoundary={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={<Loading />}>
            <div className="flex flex-1 flex-col px-5 pb-8 overflow-y-auto">
              {children}
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <CommandPalette />
      <Notification />
    </SidebarProvider>
  );
};
