import { useRecordContext } from "ra-core";

import type { Order } from "../types";
import { formatMoney, orderItemsSubtotal } from "./orderUtils";

/** Renders the order's `items` JSONB array. Production rows may omit `image`. */
export const OrderItemsTable = () => {
  const record = useRecordContext<Order>();
  if (!record?.items?.length) {
    return <p className="text-sm text-muted-foreground">No items.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 pr-2 font-medium">Item</th>
          <th className="py-2 pr-2 font-medium text-right">Unit</th>
          <th className="py-2 pr-2 font-medium text-right">Qty</th>
          <th className="py-2 font-medium text-right">Line</th>
        </tr>
      </thead>
      <tbody>
        {record.items.map((item, index) => (
          <tr key={index} className="border-b last:border-b-0">
            <td className="py-2 pr-2">
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted" />
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
            Subtotal
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
            Shipping
          </td>
          <td className="py-2 text-right tabular-nums">
            {formatMoney(record.shipping_cost ?? 0, record.currency)}
          </td>
        </tr>
        <tr className="font-medium">
          <td colSpan={3} className="py-2 pr-2 text-right">
            Total
          </td>
          <td className="py-2 text-right tabular-nums">
            {formatMoney(record.total, record.currency)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
