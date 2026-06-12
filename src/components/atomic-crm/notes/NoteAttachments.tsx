import { Paperclip } from "lucide-react";

import type { AttachmentNote, ContactNote, DealNote } from "../types";
import { useAttachmentUrl } from "./useAttachmentUrl";

const ImageAttachment = ({ attachment }: { attachment: AttachmentNote }) => {
  const url = useAttachmentUrl(attachment.src, attachment.path);
  if (!url) return null;
  return (
    <div>
      <a
        href={url}
        title={attachment.title}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={url}
          alt={attachment.title}
          className="w-[200px] h-[100px] object-cover cursor-pointer object-left border border-border"
        />
      </a>
    </div>
  );
};

const FileAttachment = ({ attachment }: { attachment: AttachmentNote }) => {
  const url = useAttachmentUrl(attachment.src, attachment.path);
  if (!url) return null;
  return (
    <div className="flex items-center gap-2">
      <Paperclip className="w-4 h-4" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:no-underline"
        onClick={(e) => e.stopPropagation()}
      >
        {attachment.title}
      </a>
    </div>
  );
};

/**
 * Displays persisted note attachments in note show/list views.
 *
 * The attachments bucket is private — URLs are signed per render via
 * useAttachmentUrl rather than read from the stored src.
 */
export const NoteAttachments = ({ note }: { note: ContactNote | DealNote }) => {
  if (!note.attachments || note.attachments.length === 0) {
    return null;
  }

  const imageAttachments = note.attachments.filter(
    (attachment: AttachmentNote) => isImageMimeType(attachment.type),
  );
  const otherAttachments = note.attachments.filter(
    (attachment: AttachmentNote) => !isImageMimeType(attachment.type),
  );

  return (
    <div className="mt-2 flex flex-col gap-2">
      {imageAttachments.length > 0 && (
        <div className="grid grid-cols-4 gap-8">
          {imageAttachments.map((attachment: AttachmentNote, index: number) => (
            <ImageAttachment key={index} attachment={attachment} />
          ))}
        </div>
      )}
      {otherAttachments.length > 0 &&
        otherAttachments.map((attachment: AttachmentNote, index: number) => (
          <FileAttachment key={index} attachment={attachment} />
        ))}
    </div>
  );
};

/**
 * Checks whether a mime type corresponds to an image.
 *
 * @param mimeType - The attachment mime type.
 * @returns `true` when the mime type starts with `image/`.
 */
const isImageMimeType = (mimeType?: string): boolean => {
  if (!mimeType) {
    return false;
  }
  return mimeType.startsWith("image/");
};
