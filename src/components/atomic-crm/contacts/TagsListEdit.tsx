import { Edit, Plus, X } from "lucide-react";
import {
  useGetMany,
  useRecordContext,
  useTranslate,
  useUpdate,
  type Identifier,
} from "ra-core";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TagCreateModal } from "../tags/TagCreateModal";
import { TagEditModal } from "../tags/TagEditModal";
import { useTags } from "../tags/useTags";
import type { Contact, Tag } from "../types";
import { registerTagColor } from "../tags/colors";

/**
 * An editable tag in the register: a 6px dot in the user's color + the name
 * as an overline word, with a quiet unlink. Click the word to edit the tag.
 * No pill, no fill.
 */
const TagWordEdit = ({
  tag,
  onUnlink,
}: {
  tag: Tag;
  onUnlink: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span className="overline inline-flex items-center gap-1.5 whitespace-nowrap">
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: registerTagColor(tag.color) }}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer transition-colors hover:text-foreground"
        >
          {tag.name}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUnlink();
          }}
          className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      </span>
      <TagEditModal tag={tag} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const TagsListEdit = () => {
  const record = useRecordContext<Contact>();
  const [open, setOpen] = useState(false);
  const translate = useTranslate();

  const { data: allTags, isPending: isPendingAllTags } = useTags({
    perPage: 10,
  });
  const { data: tags, isPending: isPendingRecordTags } = useGetMany<Tag>(
    "tags",
    { ids: record?.tags },
    { enabled: record && record.tags && record.tags.length > 0 },
  );
  const [update] = useUpdate<Contact>();

  const unselectedTags =
    allTags &&
    record &&
    allTags.filter((tag) => !record.tags?.includes(tag.id));

  const handleTagAdd = (id: number) => {
    if (!record) {
      throw new Error("No contact record found");
    }
    const tags = [...(record.tags ?? []), id];
    update("contacts", {
      id: record.id,
      data: { tags },
      previousData: record,
    });
  };

  const handleTagDelete = async (id: Identifier) => {
    if (!record) {
      throw new Error("No contact record found");
    }
    const tags = record.tags.filter((tagId) => tagId !== id);
    await update("contacts", {
      id: record.id,
      data: { tags },
      previousData: record,
    });
  };

  const openTagCreateDialog = () => {
    setOpen(true);
  };

  const handleTagCreateClose = () => {
    setOpen(false);
  };

  const handleTagCreated = useCallback(
    async (tag: Tag) => {
      if (!record) {
        throw new Error("No contact record found");
      }

      await update(
        "contacts",
        {
          id: record.id,
          data: { tags: [...record.tags, tag.id] },
          previousData: record,
        },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    },
    [update, record],
  );

  if (isPendingRecordTags || isPendingAllTags) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {tags?.map((tag) => (
        <TagWordEdit
          key={tag.id}
          tag={tag}
          onUnlink={() => handleTagDelete(tag.id)}
        />
      ))}

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 md:h-6 cursor-pointer"
            >
              <Plus className="w-4 h-4 md:w-3 md:h-3 mr-1" />
              {translate("resources.tags.action.add")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {unselectedTags?.map((tag) => (
              <DropdownMenuItem
                key={tag.id}
                onClick={() => handleTagAdd(tag.id)}
              >
                <span className="overline inline-flex items-center gap-1.5">
                  <span
                    className="inline-block size-1.5 rounded-full"
                    style={{ backgroundColor: registerTagColor(tag.color) }}
                  />
                  {tag.name}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={openTagCreateDialog}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start p-0 cursor-pointer text-base md:text-sm"
              >
                <Edit className="w-4 h-4 md:w-3 md:h-3 mr-2" />
                {translate("resources.tags.action.create")}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TagCreateModal
        open={open}
        onClose={handleTagCreateClose}
        onSuccess={handleTagCreated}
      />
    </div>
  );
};
