import { useRecordContext } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import { TopToolbar } from "../layout/TopToolbar";
import type { Order } from "../types";
import { OrderChannelBadge, OrderStatusBadge } from "./OrderBadges";
import {
  formatMoney,
  ORDER_CHANNEL_CHOICES,
  ORDER_STATUS_CHOICES,
} from "./orderUtils";

const OrderListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.orders.action.new" />
  </TopToolbar>
);

const filters = [
  <TextInput
    key="email"
    source="customer_email@ilike"
    label="resources.orders.fields.customer_email"
    alwaysOn
  />,
  <SelectInput
    key="status"
    source="status"
    choices={ORDER_STATUS_CHOICES}
    alwaysOn
  />,
  <SelectInput
    key="channel"
    source="sales_channel"
    label="resources.orders.fields.sales_channel"
    choices={ORDER_CHANNEL_CHOICES}
  />,
];

const TotalField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  return (
    <span className="tabular-nums">
      {formatMoney(record.total, record.currency)}
    </span>
  );
};

const CustomerField = (_props: { label?: string | boolean }) => {
  const record = useRecordContext<Order>();
  if (!record) return null;
  return (
    <div className="flex flex-col">
      <span>{record.customer_name}</span>
      <span className="text-xs text-muted-foreground">
        {record.customer_email}
      </span>
    </div>
  );
};

export function OrderList() {
  return (
    <List
      filters={filters}
      actions={<OrderListActions />}
      sort={{ field: "created_at", order: "DESC" }}
      perPage={25}
    >
      <DataTable rowClick="show">
        <DataTable.Col source="order_number" label="resources.orders.fields.order_number" />
        <DataTable.Col label="resources.orders.fields.customer">
          <CustomerField />
        </DataTable.Col>
        <DataTable.Col label="resources.orders.fields.sales_channel">
          <OrderChannelBadge />
        </DataTable.Col>
        <DataTable.Col label="resources.orders.fields.total">
          <TotalField />
        </DataTable.Col>
        <DataTable.Col label="resources.orders.fields.status">
          <OrderStatusBadge />
        </DataTable.Col>
        <DataTable.Col source="created_at" label="resources.orders.fields.created_at">
          <DateField source="created_at" />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}

export default OrderList;
