import { useTranslate } from "ra-core";
import { Link } from "react-router";

import type { CatalogueProduct } from "./ProductsPage";
import { useCatalogue } from "./ProductsPage";

import { formatMoney } from "../orders/orderUtils";

const Section = ({
  title,
  products,
  dot,
}: {
  title: string;
  products: CatalogueProduct[];
  dot: string;
}) => {
  if (!products.length) return null;
  return (
    <div className="flex flex-col gap-2 border-t pt-4">
      <div className="flex items-baseline gap-2">
        <h3 className="overline flex items-center gap-1.5">
          <span className={`inline-block size-1.5 rounded-full ${dot}`} />
          {title}
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {products.length}
        </span>
      </div>
      <div className="flex flex-col -mx-1 divide-y divide-hairline">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 px-1 py-2 no-underline transition-colors hover:bg-secondary"
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt=""
                loading="lazy"
                className="plate h-10 w-10"
              />
            ) : (
              <div className="plate h-10 w-10" />
            )}
            <span className="text-[13px] truncate">{product.title}</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {product.category}
            </span>
            <span className="text-[13px] tabular-nums w-16 text-right">
              {formatMoney(product.price, "USD")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * The collection's ledger: what's gone, what's held, what's live.
 * One-of-one pieces mean "sold" IS the inventory alert.
 */
export const InventoryPage = () => {
  const translate = useTranslate();
  const { data: products } = useCatalogue();
  if (!products) return null;

  const sold = products.filter((product) => product.status === "sold");
  const reserved = products.filter((product) => product.status === "reserved");
  const available = products.filter(
    (product) => product.status === "available",
  );

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-3xl">
      <div>
        <p className="overline">
          {translate("crm.nav.catalogue", { _: "Collection" })}
        </p>
        <h1 className="display mt-1 text-[28px] leading-none">
          {translate("crm.nav.inventory")}
        </h1>
        <p className="text-xs text-muted-foreground mt-3">
          {translate("crm.inventory.note", {
            _: "One-of-one pieces — a sale removes the piece from the site automatically.",
          })}
        </p>
      </div>
      <Section
        title={translate("crm.products.status.available", { _: "Available" })}
        products={available}
        dot="bg-moss"
      />
      <Section
        title={translate("crm.products.status.reserved", { _: "Reserved" })}
        products={reserved}
        dot="bg-tobacco"
      />
      <Section
        title={translate("crm.products.status.sold", { _: "Sold" })}
        products={sold}
        dot="bg-ink"
      />
    </div>
  );
};
