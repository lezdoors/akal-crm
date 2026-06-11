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
 * Linear anatomy: borderless sidebar on the warm canvas, content floating
 * as a rounded white card (SidebarInset), slim utility bar inside the card.
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
      <SidebarInset className="border md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:shadow-[0_1px_4px_rgba(29,27,25,0.06)] overflow-hidden flex flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="flex-1 flex items-center" id="breadcrumb" />
          <button
            type="button"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
            className="hidden md:flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <span>{translate("ra.action.search", { _: "Search" })}</span>
            <kbd className="font-mono text-[10px] rounded border px-1 bg-muted">
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
              className="flex flex-1 flex-col px-6 pb-10 overflow-y-auto"
              id="main-content"
            >
              {children}
            </div>
          </Suspense>
        </ErrorBoundary>
      </SidebarInset>
      <CommandPalette />
      <Notification />
    </SidebarProvider>
  );
};
