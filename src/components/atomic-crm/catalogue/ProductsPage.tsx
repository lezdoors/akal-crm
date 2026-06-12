import { useGetList, useTranslate } from "ra-core";
import { useState } from "react";
import { Link } from "react-router";

import { formatMoney } from "../orders/orderUtils";

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

const STATUS_DOT: Record<string, string> = {
  available: "bg-moss",
  sold: "bg-ink",
  reserved: "bg-tobacco",
  draft: "bg-ink-muted",
};

export const ProductStatusBadge = ({
  product,
}: {
  product: CatalogueProduct;
}) => {
  const translate = useTranslate();
  if (!product.status) return null;
  return (
    <span className="overline flex items-center gap-1.5 whitespace-nowrap">
      <span
        className={`inline-block size-1.5 rounded-full ${STATUS_DOT[product.status] ?? "bg-ink-muted"}`}
      />
      {translate(`crm.products.status.${product.status}`, {
        _: product.status,
      })}
    </span>
  );
};

/** Filters are words, not pills: ink when chosen, muted otherwise. */
const FilterWord = ({
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
    className={`overline px-1 py-1 transition-colors ${
      active
        ? "!text-foreground border-b border-foreground"
        : "hover:text-foreground"
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
    <div className="flex flex-col gap-8 mt-6">
      <div>
        <p className="overline">
          {translate("crm.nav.catalogue", { _: "Collection" })}
        </p>
        <div className="flex items-baseline justify-between flex-wrap gap-2 mt-1">
          <h1 className="display text-[28px] leading-none">
            {translate("crm.nav.products")}
          </h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            {translate("crm.products.count", { smart_count: visible.length })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t pt-4">
        <FilterWord active={!category} onClick={() => setCategory(null)}>
          {translate("crm.products.all", { _: "All" })}
        </FilterWord>
        {categories.map((entry) => (
          <FilterWord
            key={entry}
            active={category === entry}
            onClick={() => setCategory(category === entry ? null : entry)}
          >
            {entry}
          </FilterWord>
        ))}
        <span className="mx-2 self-center h-3 w-px bg-border" />
        {(["available", "sold", "reserved"] as const).map((entry) => (
          <FilterWord
            key={entry}
            active={stock === entry}
            onClick={() => setStock(stock === entry ? null : entry)}
          >
            {translate(`crm.products.status.${entry}`, { _: entry })}
          </FilterWord>
        ))}
      </div>

      {/* The contact sheet */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {visible.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group flex flex-col no-underline"
          >
            <div className="plate aspect-square overflow-hidden">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                />
              )}
            </div>
            <div className="flex items-start justify-between gap-2 pt-3">
              <div className="min-w-0">
                <div className="text-[13px] font-medium truncate">
                  {product.title}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {[product.category, product.variant_attribute?.value]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
              <div className="text-[13px] tabular-nums shrink-0">
                {formatMoney(product.price, "USD")}
              </div>
            </div>
            <div className="pt-2">
              <ProductStatusBadge product={product} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
