import { useEffect, useRef, useState } from "react";
import { Form, required, useLogin, useNotify, useTranslate } from "ra-core";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/admin/text-input";
import { Notification } from "@/components/admin/notification";
import { useConfigurationContext } from "@/components/atomic-crm/root/ConfigurationContext.tsx";
import { SSOAuthButton } from "./SSOAuthButton";

/**
 * Login page displayed when authentication is enabled and the user is not authenticated.
 *
 * Automatically shown when an unauthenticated user tries to access a protected route.
 * Handles login via authProvider.login() and displays error notifications on failure.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/loginpage LoginPage documentation}
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/security Security documentation}
 */
export const LoginPage = (props: { redirectTo?: string }) => {
  const {
    darkModeLogo,
    title,
    googleWorkplaceDomain,
    disableEmailPasswordAuthentication,
  } = useConfigurationContext();
  const { redirectTo } = props;
  const [loading, setLoading] = useState(false);
  const hasDisplayedRecoveryNotification = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const login = useLogin();
  const notify = useNotify();
  const translate = useTranslate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldNotify = searchParams.get("passwordRecoveryEmailSent") === "1";

    if (!shouldNotify || hasDisplayedRecoveryNotification.current) {
      return;
    }

    hasDisplayedRecoveryNotification.current = true;
    notify("crm.auth.recovery_email_sent", {
      type: "success",
      messageArgs: {
        _: "If you're a registered user, you should receive a password recovery email shortly.",
      },
    });

    searchParams.delete("passwordRecoveryEmailSent");
    const nextSearch = searchParams.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate, notify]);

  const handleSubmit: SubmitHandler<FieldValues> = (values) => {
    setLoading(true);
    login(values, redirectTo)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
              ? "ra.auth.sign_in_error"
              : error.message,
          {
            type: "error",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                    ? error.message
                    : undefined,
            },
          },
        );
      });
  };

  return (
    // The only unauthenticated surface: one focus block on the ground, per
    // DESIGN.md. The form sits on a raised tile inside it so the inputs are
    // read on a light surface rather than against the dark block.
    <div className="min-h-screen flex items-center justify-center bg-ground px-4 py-10">
      <div className="panel-strong page-enter w-full max-w-[440px] px-8 py-10 sm:px-10">
        <div className="flex flex-col items-center text-center">
          <img className="h-8" src={darkModeLogo} alt="" />
          <h1 className="display mt-5 text-[26px] leading-none text-ink-inverse">
            {title}
          </h1>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted-inverse">
            Espace équipe
          </p>
        </div>

        <div className="mt-8 rounded-[var(--radius-tile)] bg-panel-raised px-6 py-7 space-y-6">
          <h2 className="overline text-center">
            {translate("ra.auth.sign_in")}
          </h2>
          {disableEmailPasswordAuthentication ? null : (
            <Form className="space-y-6" onSubmit={handleSubmit}>
              <TextInput
                label="ra.auth.email"
                source="email"
                type="email"
                validate={required()}
              />
              <TextInput
                label="ra.auth.password"
                source="password"
                type="password"
                validate={required()}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {translate("ra.auth.sign_in")}
              </Button>
            </Form>
          )}
          {googleWorkplaceDomain ? (
            <SSOAuthButton className="w-full" domain={googleWorkplaceDomain}>
              {translate("crm.auth.sign_in_google_workspace", {
                _: "Sign in with Google Workplace",
              })}
            </SSOAuthButton>
          ) : null}
          {disableEmailPasswordAuthentication ? null : (
            <Link
              to={"/forgot-password"}
              className="block text-center font-mono text-[12px] text-accent-ink no-underline hover:underline"
            >
              {translate("ra-supabase.auth.forgot_password", {
                _: "Forgot password?",
              })}
            </Link>
          )}
        </div>
      </div>
      <Notification />
    </div>
  );
};
