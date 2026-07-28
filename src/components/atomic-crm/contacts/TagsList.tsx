import { useRecordContext } from "ra-core";
import { ReferenceArrayField } from "@/components/admin/reference-array-field";
import { SingleFieldList } from "@/components/admin/single-field-list";
import { cn } from "@/lib/utils";
import { registerTagColor } from "../tags/colors";

/**
 * A tag in the register: the user's color survives only as a 6px dot; the
 * name is a quiet overline word. No pill, no fill.
 */
const TagWord = (props: { className?: string }) => {
  const record = useRecordContext<{ name: string; color: string }>();
  if (!record) return null;
  return (
    <span
      className={cn(
        "overline inline-flex items-center gap-1.5 whitespace-nowrap",
        props.className,
      )}
    >
      <span
        className="inline-block size-1.5 rounded-full"
        style={{ backgroundColor: registerTagColor(record.color) }}
      />
      {record.name}
    </span>
  );
};

export const TagsList = () => (
  <ReferenceArrayField
    className="inline-block"
    resource="contacts"
    source="tags"
    reference="tags"
  >
    <SingleFieldList className="gap-x-3 gap-y-1">
      <TagWord />
    </SingleFieldList>
  </ReferenceArrayField>
);
