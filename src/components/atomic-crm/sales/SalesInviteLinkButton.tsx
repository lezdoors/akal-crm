import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDataProvider, useNotify, useRecordContext, useTranslate } from "ra-core";
import { Link2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { CrmDataProvider } from "../providers/types";
import type { Sale } from "../types";

/**
 * Admin action: generate a deliver-by-hand join link for a teammate, shown
 * in a dialog with copy — so onboarding never depends on email/spam.
 */
export const SalesInviteLinkButton = () => {
  const record = useRecordContext<Sale>();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => dataProvider.salesInviteLink(record!.id),
    onSuccess: async (url: string) => {
      setLink(url);
      setOpen(true);
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        /* dialog still shows the link to copy manually */
      }
    },
    onError: (e: Error) => notify(e.message, { type: "error" }),
  });

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
  };

  if (!record) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          setCopied(false);
          mutate();
        }}
      >
        <Link2 className="size-4" />
        {translate("resources.sales.invite.action", { _: "Invite link" })}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="display text-[20px]">
              {translate("resources.sales.invite.title", {
                _: "Join link for {name}",
                name: `${record.first_name} ${record.last_name}`,
              })}
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              {translate("resources.sales.invite.body", {
                _: "Send this link directly (WhatsApp, SMS, email). It lets them set a password and sign in — no invitation email required. It expires after 24 hours.",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={link} className="text-[12px] font-mono" />
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? (
                <Check className="size-4 text-moss" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
