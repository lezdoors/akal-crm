import { useRecordContext, useTranslate } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";

import { TopToolbar } from "../layout/TopToolbar";
import { SalesInviteLinkButton } from "./SalesInviteLinkButton";

const SalesListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.sales.action.new" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

/** Flags in the register's voice: a 6px dot + an overline word, never a pill. */
const OptionsField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext();
  const translate = useTranslate();
  if (!record) return null;
  return (
    <div className="flex flex-row items-center gap-4">
      {record.administrator && (
        <span className="overline flex items-center gap-1.5 whitespace-nowrap">
          <span className="inline-block size-1.5 rounded-full bg-action" />
          {translate("resources.sales.fields.administrator")}
        </span>
      )}
      {record.disabled && (
        <span className="overline flex items-center gap-1.5 whitespace-nowrap">
          <span className="inline-block size-1.5 rounded-full bg-ink-muted" />
          {translate("resources.sales.fields.disabled")}
        </span>
      )}
    </div>
  );
};

export function SalesList() {
  return (
    <List
      filters={filters}
      actions={<SalesListActions />}
      sort={{ field: "first_name", order: "ASC" }}
    >
      <DataTable>
        <DataTable.Col source="first_name" />
        <DataTable.Col source="last_name" />
        <DataTable.Col source="email" />
        <DataTable.Col label={false}>
          <OptionsField />
        </DataTable.Col>
        <DataTable.Col label={false}>
          <SalesInviteLinkButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
