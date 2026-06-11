import { useGetList, useTranslate } from "ra-core";
import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

export interface CatalogueProduct {
  id: string;
  title: string;
  slug: string;
  /** USD minor units. */
  price: number;
  images?: string[];
  category?: string;
  status?: "available" | "sold" | "reserved" | "draft";
  available_quantity?: number;
  materials?: string[];
  variant_attribute?: { type?: string; value?: string };
  featured?: boolean;
  description?: string;
}

export const useCatalogue = () =>
  useGetList<CatalogueProduct>("products", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "title", order: "ASC" },
  });

const STATUS_BADGE: Record<string, string> = {
  available: "border-emerald-800/30 text-emerald-900 dark:text-emerald-300",
  sold: "border-ink/30 text-ink-soft dark:text-stone-300",
  reserved: "border-amber-600/50 text-amber-800 dark:text-amber-300",
  draft: "border-ink/20 text-muted-foreground",
};

export const ProductStatusBadge = ({
  product,
}: {
  product: CatalogueProduct;
}) => {
  const translate = useTranslate();
  if (!product.status) return null;
  return (
    <Badge variant="outline" className={STATUS_BADGE[product.status] ?? ""}>
      {translate(`crm.products.status.${product.status}`, {
        _: product.status,
      })}
    </Badge>
  );
};

const FilterChip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
      active
        ? "bg-ink text-white dark:bg-white dark:text-ink"
        : "border text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

/**
 * Catalogue grid — read-only window onto the products table (Airtable is
 * canonical via the sync cron). Photo-first cards, calm chips for
 * collection + stock filtering.
 */
export const ProductsPage = () => {
  const translate = useTranslate();
  const { data: products } = useCatalogue();
  const [category, setCategory] = useState<string | null>(null);
  const [stock, setStock] = useState<string | null>(null);

  if (!products) return null;

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  ).sort() as string[];

  const visible = products.filter(
    (product) =>
      (!category || product.category === category) &&
      (!stock || product.status === stock),
  );

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h2 className="font-serif text-3xl font-medium tracking-[0.02em]">
          {translate("crm.nav.products")}
        </h2>
        <span className="text-xs text-muted-foreground">
          {translate("crm.products.count", { smart_count: visible.length })}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={!category} onClick={() => setCategory(null)}>
          {translate("crm.products.all", { _: "All" })}
        </FilterChip>
        {categories.map((entry) => (
          <FilterChip
            key={entry}
            active={category === entry}
            onClick={() => setCategory(category === entry ? null : entry)}
          >
            {entry}
          </FilterChip>
        ))}
        <span className="mx-2 self-center h-4 w-px bg-border" />
        {(["available", "sold", "reserved"] as const).map((entry) => (
          <FilterChip
            key={entry}
            active={stock === entry}
            onClick={() => setStock(stock === entry ? null : entry)}
          >
            {translate(`crm.products.status.${entry}`, { _: entry })}
          </FilterChip>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group flex flex-col no-underline"
          >
            <div className="aspect-square overflow-hidden rounded-md border bg-muted">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="flex items-start justify-between gap-2 pt-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {product.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {[product.category, product.variant_attribute?.value]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
              <div className="text-sm tabular-nums shrink-0">
                ${(product.price / 100).toFixed(0)}
              </div>
            </div>
            <div className="pt-1.5">
              <ProductStatusBadge product={product} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
