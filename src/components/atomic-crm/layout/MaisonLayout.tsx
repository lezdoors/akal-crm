import type { ErrorInfo, ReactNode } from "react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserMenu } from "@/components/admin/user-menu";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { Notification } from "@/components/admin/notification";
import { RefreshButton } from "@/components/admin/refresh-button";
import { LocalesMenuButton } from "@/components/admin/locales-menu-button";
import { Error } from "@/components/admin/error";
import { Loading } from "@/components/admin/loading";
import { CanAccess } from "ra-core";
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
import { BlocTopNav } from "./BlocTopNav";

/**
 * BLOC: chips and panels on the grey ground, reown-style. Navigation is a row
 * of pill chips across the top rather than a rail — the rail left a tall empty
 * column on every page and stole ~260px from the content.
 */
export const MaisonLayout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | undefined>(undefined);
  const location = useLocation();
  // First path segment: navigating within a resource (list → detail) should
  // not replay the entrance — only moving to another register page does.
  const section = location.pathname.split("/")[1] ?? "";
  const handleError = (_: unknown, info: ErrorInfo) => {
    setErrorInfo(info);
  };
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <BlocTopNav
        trailing={
          <>
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
          </>
        }
      />
      {/* Breadcrumb only reserves space on pages that set one. */}
      <div className="flex items-center gap-2 px-5 empty:hidden" id="breadcrumb" />
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
            className="page-enter flex flex-1 flex-col px-4 pb-8"
            id="main-content"
          >
            {children}
          </div>
        </Suspense>
      </ErrorBoundary>
      <CommandPalette />
      <Notification />
    </div>
  );
};
