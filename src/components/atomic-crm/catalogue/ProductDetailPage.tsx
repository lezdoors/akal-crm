import { useGetOne, useTranslate } from "ra-core";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatMoney } from "../orders/orderUtils";
import type { CatalogueProduct } from "./ProductsPage";
import { ProductStatusBadge } from "./ProductsPage";

const Fact = ({ label, value }: { label: string; value?: string | number }) =>
  value === undefined || value === null || value === "" ? null : (
    <div className="flex justify-between gap-4 py-1.5 border-b last:border-b-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );

/** Read-only product sheet: photography left, facts right. */
export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const translate = useTranslate();
  const { data: product } = useGetOne<CatalogueProduct>(
    "products",
    { id: id! },
    { enabled: !!id },
  );
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;
  const images = product.images ?? [];

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center gap-3">
        <Link
          to="/products"
          className="flex items-center gap-1 text-xs text-muted-foreground no-underline hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {translate("crm.nav.products")}
        </Link>
      </div>
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="text-[17px] font-semibold">
          {product.title}
        </h2>
        <ProductStatusBadge product={product} />
        <span className="text-lg tabular-nums ml-auto">
          {formatMoney(product.price, "USD")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="aspect-square max-h-[560px] overflow-hidden rounded-md border bg-muted">
            {images[activeImage] && (
              <img
                src={images[activeImage]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-opacity ${
                    index === activeImage
                      ? "ring-1 ring-ink"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {translate("crm.products.facts", { _: "Details" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Fact label="Ref" value={product.slug} />
              <Fact
                label={translate("crm.products.collection", { _: "Collection" })}
                value={product.category}
              />
              <Fact
                label={translate("crm.products.leather", { _: "Leather" })}
                value={product.materials?.join(", ")}
              />
              <Fact
                label={translate("crm.products.variant", { _: "Variant" })}
                value={product.variant_attribute?.value}
              />
              <Fact
                label={translate("crm.products.stock", { _: "Stock" })}
                value={product.available_quantity}
              />
            </CardContent>
          </Card>
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {translate("crm.products.description", { _: "Description" })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          )}
          <p className="text-[11px] text-muted-foreground">
            {translate("crm.products.canonical_note", {
              _: "Catalogue data is managed in Airtable and syncs automatically.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
