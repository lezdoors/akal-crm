import { useTranslate } from "ra-core";
import { Link } from "react-router";

import type { CatalogueProduct } from "./ProductsPage";
import { ProductStatusBadge, useCatalogue } from "./ProductsPage";

const Section = ({
  title,
  products,
  accent,
}: {
  title: string;
  products: CatalogueProduct[];
  accent?: string;
}) => {
  if (!products.length) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2 pt-4 pb-1">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: accent ?? "var(--ink-muted)" }}
        />
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">{products.length}</span>
      </div>
      <div className="flex flex-col -mx-2">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-3 rounded-md px-2 py-1.5 no-underline hover:bg-muted/70"
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt=""
                loading="lazy"
                className="h-9 w-9 rounded-md border object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-md border bg-muted" />
            )}
            <span className="text-sm truncate">{product.title}</span>
            <span className="text-xs text-muted-foreground">
              {product.category}
            </span>
            <ProductStatusBadge product={product} />
            <span className="text-sm tabular-nums w-16 text-right">
              ${(product.price / 100).toFixed(0)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * Stock states at a glance: what's gone, what's held, what's live.
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
    <div className="flex flex-col gap-2 mt-2 max-w-3xl">
      <h2 className="font-serif text-3xl font-medium tracking-[0.02em]">
        {translate("crm.nav.inventory")}
      </h2>
      <p className="text-xs text-muted-foreground">
        {translate("crm.inventory.note", {
          _: "One-of-one pieces — a sale removes the piece from the site automatically.",
        })}
      </p>
      <Section
        title={translate("crm.products.status.sold", { _: "Sold" })}
        products={sold}
        accent="var(--ink)"
      />
      <Section
        title={translate("crm.products.status.reserved", { _: "Reserved" })}
        products={reserved}
        accent="var(--tobacco)"
      />
      <Section
        title={translate("crm.products.status.available", { _: "Available" })}
        products={available}
        accent="#1f4d3a"
      />
    </div>
  );
};
