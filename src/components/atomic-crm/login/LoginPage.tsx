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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Full-bleed entrance: rotating hide in golden particles, plays once
          and settles on the embossed brand reveal. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="./login-leather.mp4"
        poster="./login-poster.webp"
        autoPlay
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />

      <div className="relative z-20 flex flex-col items-center w-full px-4 login-enter">
        <img className="h-9 mb-4" src={darkModeLogo} alt={title} />
        <div className="display text-[34px] tracking-[0.04em] text-white text-center leading-none">
          {title}
        </div>
        <div className="mt-3 mb-8 flex items-center gap-3 text-white/60">
          <span className="h-px w-10 bg-white/30" />
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase">
            Atelier · Marrakech
          </span>
          <span className="h-px w-10 bg-white/30" />
        </div>

        <div className="w-full max-w-[380px] bg-card border px-8 py-8 space-y-6">
          <div className="text-center">
            <h1 className="overline text-white/70">
              {translate("ra.auth.sign_in")}
            </h1>
          </div>
            {disableEmailPasswordAuthentication ? null : (
              <Form className="space-y-8" onSubmit={handleSubmit}>
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
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    {translate("ra.auth.sign_in")}
                  </Button>
                </div>
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
                className="block text-sm text-center hover:underline"
              >
                {translate("ra-supabase.auth.forgot_password", {
                  _: "Forgot password?",
                })}
              </Link>
            )}
        </div>

        <p className="mt-6 font-mono text-[9px] tracking-[0.24em] uppercase text-white/40">
          Espace équipe — Maison Tanneurs
        </p>
      </div>
      <Notification />
    </div>
  );
};
