import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  useDataProvider,
  useGetIdentity,
  useNotify,
  useRedirect,
  useTranslate,
} from "ra-core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { CrmDataProvider } from "../providers/types";
import type { Sale } from "../types";

/**
 * Admin-only, hidden on your own account. The edge function enforces the
 * same rules server-side (plus never deleting the last administrator) and
 * reassigns the user's records to the requesting admin before removal.
 */
export const SalesDeleteButton = ({ record }: { record?: Sale }) => {
  const { identity } = useGetIdentity();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!record) throw new Error("Record not found");
      return dataProvider.salesDelete(record.id);
    },
    onSuccess: () => {
      setOpen(false);
      redirect("/sales");
      notify("resources.sales.delete.success", {
        messageArgs: { _: "User deleted" },
      });
    },
    onError: (error: Error) => {
      setOpen(false);
      notify(error.message, { type: "error" });
    },
  });

  // The /sales pages are already admin-gated; the edge function re-checks
  // admin rights server-side. Client-side we only prevent self-delete.
  if (!record || identity?.id === record.id) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          {translate("resources.sales.delete.action", { _: "Delete user" })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[15px]">
            {translate("resources.sales.delete.title", {
              _: "Delete this user?",
            })}
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            {translate("resources.sales.delete.body", {
              name: `${record.first_name} ${record.last_name}`,
              _: `${record.first_name} ${record.last_name} will lose access immediately. Their clients, notes and tasks are reassigned to you.`,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {translate("ra.action.cancel", { _: "Cancel" })}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {translate("resources.sales.delete.confirm", { _: "Delete" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
