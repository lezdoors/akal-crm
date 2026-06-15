import { Notification } from "@/components/admin/notification";
import { useTranslate } from "ra-core";
import { useConfigurationContext } from "../root/ConfigurationContext";

export const ConfirmationRequired = () => {
  const translate = useTranslate();
  const { darkModeLogo: logo, title } = useConfigurationContext();

  return (
    <div className="h-screen p-8 bg-background">
      <div className="flex items-center gap-4">
        <img src={logo} alt={title} width={24} />
        <span className="overline">{title}</span>
      </div>
      <div className="h-full text-center">
        <div className="max-w-sm mx-auto h-full flex flex-col justify-center gap-4">
          <p className="overline mb-1">
            {translate("crm.auth.check_email", { _: "Check your email" })}
          </p>
          <h1 className="display text-[26px] leading-none mb-2">
            {translate("crm.auth.welcome_title", {
              _: "Welcome to Maison Tanneurs",
            })}
          </h1>
          <p className="text-[13px] text-ink-soft mb-4">
            {translate("crm.auth.confirmation_required", {
              _: "Please follow the link we just sent you by email to confirm your account.",
            })}
          </p>
        </div>
      </div>
      <Notification />
    </div>
  );
};

ConfirmationRequired.path = "/sign-up/confirm";
