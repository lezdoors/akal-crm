import { useRecordContext, useTranslate } from "ra-core";

import type { Order } from "../types";
import { formatMoney, orderItemsSubtotal } from "./orderUtils";
import { useOrderProductImages } from "./useOrderProductImages";

/** Renders the order's `items` JSONB array. Production rows may omit `image`. */
export const OrderItemsTable = () => {
  const record = useRecordContext<Order>();
  const translate = useTranslate();
  const imageFor = useOrderProductImages(record);
  if (!record?.items?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {translate("resources.orders.show.no_items")}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
    <table className="w-full min-w-[28rem] text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 pr-2 font-medium">
            {translate("resources.orders.create.item_title")}
          </th>
          <th className="py-2 pr-2 font-medium text-right">
            {translate("resources.orders.create.unit_price")}
          </th>
          <th className="py-2 pr-2 font-medium text-right">
            {translate("resources.orders.create.quantity")}
          </th>
          <th className="py-2 font-medium text-right">
            {translate("resources.orders.show.total")}
          </th>
        </tr>
      </thead>
      <tbody>
        {record.items.map((item, index) => (
          <tr key={index} className="border-b last:border-b-0">
            <td className="py-2 pr-2">
              <div className="flex items-center gap-3">
                {imageFor(item) ? (
                  <a
                    href={imageFor(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0"
                  >
                    <img
                      src={imageFor(item)}
                      alt={item.title}
                      className="plate h-16 w-16"
                    />
                  </a>
                ) : (
                  <div className="plate h-16 w-16" />
                )}
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {item.slug && (
                    <span className="text-xs text-muted-foreground">
                      {item.slug}
                    </span>
                  )}
                </div>
              </div>
            </td>
            <td className="py-2 pr-2 text-right tabular-nums">
              {formatMoney(item.price, record.currency)}
            </td>
            <td className="py-2 pr-2 text-right tabular-nums">
              {item.quantity}
            </td>
            <td className="py-2 text-right tabular-nums">
              {formatMoney(item.price * item.quantity, record.currency)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3} className="py-2 pr-2 text-right text-muted-foreground">
            {translate("resources.orders.show.subtotal")}
          </td>
          <td className="py-2 text-right tabular-nums">
            {formatMoney(
              record.subtotal ?? orderItemsSubtotal(record.items),
              record.currency,
            )}
          </td>
        </tr>
        <tr>
          <td colSpan={3} className="py-2 pr-2 text-right text-muted-foreground">
            {translate("resources.orders.show.shipping_cost")}
          </td>
          <td className="py-2 text-right tabular-nums">
            {formatMoney(record.shipping_cost ?? 0, record.currency)}
          </td>
        </tr>
        <tr className="font-medium">
          <td colSpan={3} className="py-2 pr-2 text-right">
            {translate("resources.orders.show.total")}
          </td>
          <td className="py-2 text-right tabular-nums">
            {formatMoney(record.total, record.currency)}
          </td>
        </tr>
      </tfoot>
    </table>
    </div>
  );
};
