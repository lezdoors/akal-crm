import { useQuery } from "@tanstack/react-query";

import { ATTACHMENTS_BUCKET } from "../providers/commons/attachments";
import { getSupabaseClient } from "../providers/supabase/supabase";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * Resolves an attachment to a displayable URL. The attachments bucket is
 * private: stored `src` values (legacy public URLs or expired signed URLs)
 * can't be trusted, so anything with a storage `path` is re-signed at render
 * time. Fresh uploads (blob:/data: src, no path yet) pass through untouched.
 */
export const useAttachmentUrl = (
  src: string | undefined,
  path: string | undefined,
): string | undefined => {
  const needsSigning =
    !!path && !src?.startsWith("blob:") && !src?.startsWith("data:");

  const { data } = useQuery({
    queryKey: ["attachment-signed-url", path],
    enabled: needsSigning,
    staleTime: (SIGNED_URL_TTL_SECONDS - 300) * 1000,
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .storage.from(ATTACHMENTS_BUCKET)
        .createSignedUrl(path!, SIGNED_URL_TTL_SECONDS);
      if (error) throw error;
      return data.signedUrl;
    },
  });

  return needsSigning ? (data ?? undefined) : src;
};
