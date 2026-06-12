import type { ErrorInfo, ReactNode } from "react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/admin/user-menu";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { Notification } from "@/components/admin/notification";
import { RefreshButton } from "@/components/admin/refresh-button";
import { LocalesMenuButton } from "@/components/admin/locales-menu-button";
import { Error } from "@/components/admin/error";
import { Loading } from "@/components/admin/loading";
import { CanAccess, useTranslate } from "ra-core";
import { useLocation } from "react-router";

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
 * Le Registre: one continuous paper surface. The sidebar is a quiet rail,
 * the content sits directly on the paper (no floating card), separated only
 * by whitespace. Each page is placed on the desk with a single entrance.
 */
export const MaisonLayout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();
  const translate = useTranslate();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | undefined>(undefined);
  const location = useLocation();
  // First path segment: navigating within a resource (list → detail) should
  // not replay the entrance — only moving to another register page does.
  const section = location.pathname.split("/")[1] ?? "";
  const handleError = (_: unknown, info: ErrorInfo) => {
    setErrorInfo(info);
  };
  return (
    <SidebarProvider>
      <MaisonSidebar />
      <SidebarInset className="bg-background flex flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 px-8">
          <SidebarTrigger className="text-muted-foreground md:hidden" />
          <div className="flex-1 flex items-center" id="breadcrumb" />
          <button
            type="button"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
            className="hidden md:flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>{translate("ra.action.search", { _: "Search" })}</span>
            <kbd className="font-mono text-[10px] border px-1 text-muted-foreground">
              ⌘K
            </kbd>
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
            <div
              key={section}
              className="page-enter flex flex-1 flex-col px-8 pb-16 overflow-y-auto"
              id="main-content"
            >
              <div className="w-full max-w-[1200px] mx-auto flex flex-1 flex-col">
                {children}
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      </SidebarInset>
      <CommandPalette />
      <Notification />
    </SidebarProvider>
  );
};
